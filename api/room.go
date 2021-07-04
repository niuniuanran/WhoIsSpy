package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sort"
	"strconv"
)

var roomCodeIncr = 1001

const (
	RoomFull        = "room-full"
	NicknameTaken   = "nickname-taken"
	RoomClosed      = "room-closed"
	NicknameInvalid = "nickname-invalid"
)

type Room struct {
	Code         string
	numPlayer    int
	numSpy       int
	Language     string
	EighteenPlus bool
	RandomBlank  bool
	players      map[*Player]bool
	register     chan *Player
	unregister   chan *Player
	broadcast    chan *BroadcastMessage
}

type RoomSettings struct {
	Language     string `json:"language"`
	NumPlayer    int    `json:"numPlayer"`
	NumSpy       int    `json:"numSpy"`
	EighteenPlus bool   `json:"eighteenPlus"`
	RandomBlank  bool   `json:"randomBlank"`
}

type RoomInfo struct {
	Code             string `json:"code"`
	Capacity         int    `json:"capacity"`
	CurrentPlayerNum int    `json:"currentPlayerNum"`
	Language         string `json:"language"`
	EighteenPlus     bool   `json:"eighteenPlus"`
}

func NewRoom(roomSettings RoomSettings) *Room {
	return &Room{
		Code:         generateCode(),
		Language:     roomSettings.Language,
		numPlayer:    roomSettings.NumPlayer,
		numSpy:       roomSettings.NumSpy,
		EighteenPlus: roomSettings.EighteenPlus,
		RandomBlank:  roomSettings.RandomBlank,
		players:      make(map[*Player]bool, roomSettings.NumPlayer),
		register:     make(chan *Player),
		unregister:   make(chan *Player),
		broadcast:    make(chan *BroadcastMessage),
	}
}

type AytMessage struct {
	Line      string `json:"line"`
	NumPlayer int    `json:"numPlayer"`
}

func handleAyt(w http.ResponseWriter, r *http.Request) {
	roomCode, ok := r.URL.Query()["roomcode"]
	if !ok {
		http.Error(w, "Url Param 'roomcode' is missing", http.StatusBadRequest)
		return
	}
	aytMessage := AytMessage{"", 0}

	room := findRoomByCode(roomCode[0])

	if room == nil {
		aytMessage.writeResponse(RoomClosed, w)
		return
	}

	aytMessage.NumPlayer = room.numPlayer

	if len(room.players) >= room.numPlayer {
		aytMessage.writeResponse(RoomFull, w)
		return
	}

	nickname, ok := r.URL.Query()["nickname"]
	if !ok {
		http.Error(w, "Url Param 'nickname' is missing", http.StatusBadRequest)
		return
	}

	if nickname[0] == "" {
		aytMessage.writeResponse(NicknameInvalid, w)
		return
	}

	for name, present := range room.players {
		if present && name.Nickname == nickname[0] {
			aytMessage.writeResponse(NicknameTaken, w)
			return
		}
	}
	aytMessage.writeResponse("", w)
}

func (aytMessage *AytMessage) writeResponse(line string, w http.ResponseWriter) {
	aytMessage.Line = line
	bs, err := json.Marshal(aytMessage)
	if err != nil {
		http.Error(w, "Failed to create response", http.StatusInternalServerError)
	}
	fmt.Fprint(w, string(bs))
}

func handleCreateRoom(w http.ResponseWriter, r *http.Request) {
	var rs RoomSettings
	err := json.NewDecoder(r.Body).Decode(&rs)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Println("Error: ", err.Error())
		return
	}
	room := NewRoom(rs)
	rooms[room] = true
	go room.RunRoom()
	fmt.Fprint(w, room.Code)
	log.Println("Room created: ", room.Code)
}

func handleFindRoom(w http.ResponseWriter, r *http.Request) {
	roomCode, ok := r.URL.Query()["code"]
	if !ok {
		http.Error(w, "Url Param 'roomcode' is missing", http.StatusBadRequest)
		return
	}
	room := findRoomByCode(roomCode[0])
	if room == nil {
		http.Error(w, "Cannot find room with code "+roomCode[0], http.StatusNotFound)
		return
	}
	roomInfo := RoomInfo{
		Code:             room.Code,
		Capacity:         room.numPlayer,
		CurrentPlayerNum: len(room.players),
		Language:         room.Language,
		EighteenPlus:     room.EighteenPlus,
	}
	bs, err := json.Marshal(roomInfo)
	if err != nil {
		http.Error(w, "Failed to create room info response", http.StatusInternalServerError)
	}
	fmt.Fprintln(w, string(bs))
}

// RunRoom runs the room, accepting various requests
func (room *Room) RunRoom() {
	for {
		select {
		case player := <-room.register:
			room.registerPlayerInRoom(player)

		case player := <-room.unregister:
			room.unregisterPlayerInRoom(player)

		case message := <-room.broadcast:
			room.broadcastToPlayersInRoom(message.encode())
		}
	}
}

func (room *Room) registerPlayerInRoom(player *Player) {
	player.SerialNumber = 100
	log.Printf("Player %s joins room %s", player.Nickname, room.Code)
	room.players[player] = true
	room.notifyPlayerJoined(player)
}

func (room *Room) unregisterPlayerInRoom(player *Player) {
	log.Printf("Player %s leaves room %s", player.Nickname, room.Code)
	delete(room.players, player)
	room.notifyPlayerLeft(player)
	if len(room.players) == 0 {
		log.Printf("Room %s is empty. Cleaning room...", room.Code)
		delete(rooms, room)
		delete(availableRoomCodes, room.Code)
		room = nil
	}
}

func (room *Room) playerReadyInRoom(player *Player) {
	players := room.getPlayersInRoom()
	bs, err := json.Marshal(players)
	if err != nil {
		log.Println("Service error: failed to create player list json")
		return
	}
	message := BroadcastMessage{
		Action:   PlayerReadyBroadcast,
		Payload:  string(bs),
		RoomCode: player.RoomCode,
		Line:     fmt.Sprintf("%s is ready", player.Nickname),
	}
	room.broadcastToPlayersInRoom(message.encode())
	log.Println("Broadcasting", message.toString())
}

func (room *Room) playerUndoReadyInRoom(player *Player) {
	players := room.getPlayersInRoom()
	bs, err := json.Marshal(players)
	if err != nil {
		log.Println("Service error: failed to create player list json")
		return
	}
	message := BroadcastMessage{
		Action:   PlayerUndoReadyBroadcast,
		Payload:  string(bs),
		RoomCode: player.RoomCode,
		Line:     fmt.Sprintf("%s is not ready", player.Nickname),
	}
	room.broadcastToPlayersInRoom(message.encode())
	log.Println("Broadcasting", message.toString())
}

func (room *Room) broadcastToPlayersInRoom(message []byte) {
	for player := range room.players {
		player.send <- message
	}
}

func (room *Room) notifyPlayerJoined(player *Player) {
	players := room.getPlayersInRoom()
	bs, err := json.Marshal(players)
	if err != nil {
		log.Println("Service error: failed to create player list json")
		return
	}

	message := &BroadcastMessage{
		Action:   PlayerJoinedBroadcast,
		Payload:  string(bs),
		RoomCode: room.Code,
		Line:     fmt.Sprintf("%s just joined", player.Nickname),
	}

	room.broadcastToPlayersInRoom(message.encode())
	log.Println("Broadcasting", message.toString())
}

func (room *Room) notifyPlayerLeft(player *Player) {
	players := room.getPlayersInRoom()
	bs, err := json.Marshal(players)
	if err != nil {
		log.Println("Service error: failed to create player list json")
		return
	}
	message := &BroadcastMessage{
		Action:   PlayerLeftBroadcast,
		Payload:  string(bs),
		RoomCode: player.RoomCode,
		Line:     fmt.Sprintf("%s left the room", player.Nickname),
	}

	room.broadcastToPlayersInRoom(message.encode())
	log.Println("Broadcasting", message.toString())
}

func (room *Room) getPlayersInRoom() []Player {
	ps := make([]*Player, 0, len(room.players))
	for p, present := range room.players {
		if present {
			ps = append(ps, p)
		}
	}
	assignSerialNumbers(ps)

	players := make([]Player, 0, len(room.players))
	for _, p := range ps {
		players = append(players, *p)
	}
	return players
}

func assignSerialNumbers(players []*Player) {
	sort.Sort(BySerialNumber(players))
	for i := 0; i < len(players); i++ {
		players[i].SerialNumber = i
	}
}

func findRoomByCode(code string) *Room {
	for room := range rooms {
		if room.Code == code && rooms[room] {
			return room
		}
	}

	return nil
}

func generateCode() string {
	for {
		_, taken := availableRoomCodes[strconv.Itoa(roomCodeIncr)]
		if !taken {
			break
		}
		roomCodeIncr++
		if roomCodeIncr > 9999 {
			roomCodeIncr = 1000
		}
	}
	availableRoomCodes[strconv.Itoa(roomCodeIncr)] = true
	return strconv.Itoa(roomCodeIncr)
}
