package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type Player struct {
	// The actual websocket connection.
	conn     *websocket.Conn
	wsServer *WsServer
	send     chan []byte
	RoomCode string `json:"roomCode"`
	Id       int    `json:"Id"`
	Nickname string `json:"nickname"`
}

func newPlayer(conn *websocket.Conn, roomCode string, nickname string) *Player {
	return &Player{
		conn:     conn,
		RoomCode: roomCode,
		Nickname: nickname,
	}
}

// ServeWs handles websocket requests from clients requests.
func ServeWs(w http.ResponseWriter, r *http.Request) {
	nickname, ok := r.URL.Query()["nickname"]
	if !ok || len(nickname[0]) < 1 {
		log.Println("Url Param 'nickname' is missing")
		return
	}

	roomCode, ok := r.URL.Query()["roomcode"]
	if !ok || len(roomCode[0]) < 1 {
		log.Println("Url Param 'roomcode' is missing")
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	fmt.Printf("New player %s joined room %s!", nickname, roomCode)
	player := newPlayer(conn, roomCode[0], nickname[0])
	fmt.Println(player)
}
