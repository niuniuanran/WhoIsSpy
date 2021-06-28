package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
)

var roomCodeIncr = 1001

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

func handleCreateRoom(w http.ResponseWriter, r *http.Request) {
	// Declare a new Person struct.
	var rs RoomSettings

	// Try to decode the request body into the struct. If there is an error,
	// respond to the player with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&rs)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Println("Error: ", err.Error())
		return
	}
	log.Println("Room settings received: ", rs)
	room := NewRoom(rs)
	rooms[room] = true
	go room.RunRoom()
	fmt.Fprintf(w, room.Code)
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

// RunRoom runs our room, accepting various requests
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
	room.notifyPlayerJoined(player)
	room.players[player] = true
}

func (room *Room) unregisterPlayerInRoom(player *Player) {
	log.Printf("Player %s is leaving room %s", player.Nickname, room.Code)
	delete(room.players, player)
	room.notifyPlayerLeft(player)
	if len(room.players) == 0 {
		log.Printf("Room %s is empty. Cleaning room...", room.Code)
		delete(rooms, room)
		delete(availableRoomCodes, room.Code)
		room = nil
	}
}

func (room *Room) broadcastToPlayersInRoom(message []byte) {
	for player := range room.players {
		player.send <- message
	}
}

func (room *Room) notifyPlayerJoined(player *Player) {
	players := make([]string, 0, len(room.players))
	for p, present := range room.players {
		if present {
			players = append(players, p.Nickname)
		}
	}
	players = append(players, player.Nickname)
	bs, err := json.Marshal(players)
	if err != nil {
		log.Println("Service error: failed to create player list json")
		return
	}

	message := &BroadcastMessage{
		Action:   PlayerJoinedBroadcast,
		Payload:  string(bs),
		RoomCode: room.Code,
	}

	room.broadcastToPlayersInRoom(message.encode())
	log.Println("Broadcasting", message.toString())
}

func (room *Room) notifyPlayerLeft(player *Player) {
	message := &BroadcastMessage{
		Action:   PlayerLeftBroadcast,
		Payload:  player.Nickname,
		RoomCode: player.RoomCode,
	}

	room.broadcastToPlayersInRoom(message.encode())
}

// GetCode returns the code string of room
func (room *Room) GetCode() string {
	return room.Code
}

func findRoomByCode(code string) *Room {
	for room := range rooms {
		if room.Code == code && rooms[room] {
			return room
		}
	}

	return nil
}

// func (room *Room) findPlayerByNickname(nickname string) *Player {
// 	for player := range room.players {
// 		if player.Nickname == nickname {
// 			return player
// 		}
// 	}

// 	return nil
// }

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
