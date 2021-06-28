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

func HandleCreateRoom(w http.ResponseWriter, r *http.Request) {
	// Declare a new Person struct.
	var rs RoomSettings

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&rs)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Println("Error: ", err.Error())
		return
	}

	room := NewRoom(rs)
	rooms[room] = true
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
	room.notifyPlayerLeft(player)
	if len(room.players) == 0 {
		delete(rooms, room)
		delete(availableRoomCodes, room.Code)
		room = nil
	}
}

func (room *Room) broadcastToClientsInRoom(message []byte) {
	for client := range room.players {
		client.send <- message
	}
}

func (room *Room) notifyPlayerJoined(player *Player) {
	message := &BroadcastMessage{
		Action:   PlayerJoinedBroadcast,
		Payload:  player.Nickname,
		RoomCode: room.Code,
	}

	room.broadcastToClientsInRoom(message.encode())
	log.Println("Broadcasting", message.toString())
}

func (room *Room) notifyPlayerLeft(player *Player) {
	message := &BroadcastMessage{
		Action:   PlayerLeftBroadcast,
		Payload:  player.Nickname,
		RoomCode: player.RoomCode,
	}

	room.broadcastToClientsInRoom(message.encode())
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

func (room *Room) findPlayerByNickname(nickname string) *Player {
	for player := range room.players {
		if player.Nickname == nickname {
			return player
		}
	}

	return nil
}

func generateCode() string {
	for _, taken := availableRoomCodes[strconv.Itoa(roomCodeIncr)]; taken; {
		roomCodeIncr++
		if roomCodeIncr > 9999 {
			roomCodeIncr = 1000
		}
	}

	return strconv.Itoa(roomCodeIncr)
}
