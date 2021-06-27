package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

var roomCodeIncr = 1001

type Room struct {
	Code         string `json:"code"`
	PlayerNum    int    `json:"playerNum"`
	SpyNum       int    `json:"spyNum"`
	Language     string `json:"language"`
	EighteenPlus bool   `json:"eighteenPlus"`
	RandomBlank  bool   `json:"randomBlank"`
	players      map[*Player]bool
	register     chan *Player
	unregister   chan *Player
	broadcast    chan *BroadcastMessage
}

type RoomSettings struct {
	Language     string `json:"language"`
	PlayerNum    int    `json:"playerNum"`
	SpyNum       int    `json:"spyNum"`
	EighteenPlus bool   `json:"eighteenPlus"`
	RandomBlank  bool   `json:"randomBlank"`
}

func NewRoom(roomSettings RoomSettings) *Room {
	return &Room{
		Code:         generateCode(),
		Language:     roomSettings.Language,
		PlayerNum:    roomSettings.PlayerNum,
		SpyNum:       roomSettings.SpyNum,
		EighteenPlus: roomSettings.EighteenPlus,
		RandomBlank:  roomSettings.RandomBlank,
		players:      make(map[*Player]bool, roomSettings.PlayerNum),
		register:     make(chan *Player),
		unregister:   make(chan *Player),
		broadcast:    make(chan *BroadcastMessage),
	}
}

func HandleCreateRoom(wsServer *WsServer, w http.ResponseWriter, r *http.Request) {
	// Declare a new Person struct.
	var rs RoomSettings

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&rs)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		fmt.Println("Error: ", err.Error())
		return
	}
	room := NewRoom(rs)
	go room.RunRoom()
	fmt.Fprintf(w, room.Code)
}

// RunRoom runs our room, accepting various requests
func (room *Room) RunRoom() {
	for {
		select {
		case client := <-room.register:
			room.registerClientInRoom(client)

		case client := <-room.unregister:
			room.unregisterClientInRoom(client)

		case message := <-room.broadcast:
			room.broadcastToClientsInRoom(message.encode())
		}
	}
}

func (room *Room) registerClientInRoom(player *Player) {
	room.notifyPlayerJoined(player)
	room.players[player] = true
}

func (room *Room) unregisterClientInRoom(player *Player) {
	delete(room.players, player)
}

func (room *Room) broadcastToClientsInRoom(message []byte) {
	for client := range room.players {
		client.send <- message
	}
}

func (room *Room) notifyPlayerJoined(player *Player) {
	message := &BroadcastMessage{
		Action:     UserJoinedBroadcast,
		TargetRoom: room,
		Payload:    player.Nickname,
	}

	room.broadcastToClientsInRoom(message.encode())
}

// GetCode returns the code string of room
func (room *Room) GetCode() string {
	return room.Code
}

func generateCode() string {
	roomCodeIncr++
	return strconv.Itoa(roomCodeIncr)
}
