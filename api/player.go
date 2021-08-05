package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Max wait time when writing message to peer
	writeWait = 10 * time.Second

	// Max time till next pong from peer
	pongWait = 60 * time.Second

	// Send ping interval, must be less then pong wait time
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 10000
)

const (
	PlayerIdleState           = ""
	PlayerReadyState          = "ready"
	PlayerWordReadingState    = "reading"
	PlayerWordGotState        = "got"
	PlayerListeningState      = "listening"
	PlayerTalkingState        = "talking"
	PlayerVotingState         = "voting"
	PlayerKilledState         = "killed"
	PlayerWinState            = "win"
	PlayerLoseState           = "lose"
	PlayerTalkFinishedState   = "talked"
	PlayerVotedState          = "voted"
	PlayerResultReceivedState = "result-received"
	PlayerWordChangingState   = "word-changing"
	PlayerAppearAwayState     = "offline"
)

var (
	newline = []byte{'\n'}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type Player struct {
	RoomCode     string `json:"roomCode"`
	Nickname     string `json:"nickname"`
	SerialNumber int    `json:"serialNumber"`
	State        string `json:"state"`
	conn         *websocket.Conn
	send         chan []byte
	room         *Room
	isSpy        bool
	offline      bool
}

func newPlayer(conn *websocket.Conn, room *Room, nickname string) *Player {
	player := Player{
		RoomCode: room.Code,
		Nickname: nickname,
		State:    PlayerIdleState,
		conn:     conn,
		room:     room,
		send:     make(chan []byte),
	}
	room.register <- &player
	return &player
}

// ServePlayerWs handles websocket requests from players requests.
func ServePlayerWs(w http.ResponseWriter, r *http.Request) {
	nickname, ok := r.URL.Query()["nickname"]
	if !ok || len(nickname[0]) < 1 {
		log.Println("Url Param 'nickname' is missing")
		http.Error(w, "Url Param 'nickname' is missing", http.StatusBadRequest)
		return
	}

	roomCode, ok := r.URL.Query()["roomcode"]
	if !ok || len(roomCode[0]) < 1 {
		log.Println("Url Param 'roomcode' is missing")
		http.Error(w, "Url Param 'roomcode' is missing", http.StatusBadRequest)
		return
	}

	room := findRoomByCode(roomCode[0])
	if room == nil {
		http.Error(w, "Failed to find room with code "+roomCode[0], http.StatusBadRequest)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	player := newPlayer(conn, room, nickname[0])

	go player.writePump()
	go player.readPump()
}

func (player *Player) ToString() string {
	return fmt.Sprintf("Player nickname: %s, room code: %s", player.Nickname, player.RoomCode)
}

// readPump reads new messages from a player's connection
func (player *Player) readPump() {
	defer func() {
		player.disconnect()
	}()

	player.conn.SetReadLimit(maxMessageSize)
	player.conn.SetReadDeadline(time.Now().Add(pongWait))
	player.conn.SetPongHandler(func(string) error { player.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	// Start endless read loop, waiting for messages from player
	for {
		_, jsonMessage, err := player.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("unexpected close error: %v", err)
			}
			break
		}
		player.handleNewMessage(jsonMessage)
	}
}

// writePump writes message to the player's connection
func (player *Player) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		player.conn.Close()
	}()
	for {
		select {
		case message, ok := <-player.send:
			player.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The WsServer closed the channel.
				player.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := player.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Attach queued chat messages to the current websocket message.
			n := len(player.send)
			for i := 0; i < n; i++ {
				w.Write(newline)
				w.Write(<-player.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			player.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := player.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (player *Player) disconnect() {
	player.room.unregister <- player
	close(player.send)
	player.conn.Close()
}

func (player *Player) handleNewMessage(jsonMessage []byte) {

	var message ReportMessage
	if err := json.Unmarshal(jsonMessage, &message); err != nil {
		log.Printf("Error on unmarshal JSON message %s", err)
		return
	}

	switch message.Action {
	case LeftAction:
		{
			player.room.playerLeft(player)
		}
	case ReadyAction:
		{
			player.room.playerReadyInRoom(player)
		}
	case UndoReadyAction:
		{
			player.room.playerUndoReadyInRoom(player)
		}
	case VoteAction:
		{
			player.vote(message.Payload)
		}
	case TalkFinishAction:
		{
			player.State = PlayerTalkFinishedState
		}
	case WordReadAction:
		{
			player.State = PlayerWordGotState
		}
	case ResultReceivedAction:
		{
			player.State = PlayerResultReceivedState
		}
	case ChangeWordAction:
		{
			if !player.room.allPlayersInStates(PlayerWordChangingState) {
				player.room.changeWord(player.Nickname)
			}
		}
	}
}

func (player *Player) vote(target string) {
	v, ok := player.room.votes[target]
	if !ok {
		v = make([]string, 0)
	}
	player.room.votes[target] = append(v, player.Nickname)

	player.State = PlayerVotedState
	player.room.broadcastPlayersState("", "", "")
}

// BySerialNumber implements sort.Interface for []*Player based on the SerialNumber field.
type BySerialNumber []*Player

func (a BySerialNumber) Len() int           { return len(a) }
func (a BySerialNumber) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
func (a BySerialNumber) Less(i, j int) bool { return a[i].SerialNumber < a[j].SerialNumber }
