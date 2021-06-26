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

func newPlayer(conn *websocket.Conn) *Player {
	return &Player{
		conn: conn,
	}
}

// ServeWs handles websocket requests from clients requests.
func ServeWs(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	player := newPlayer(conn)

	fmt.Println("New player joined the hub!")
	fmt.Println(player)
}
