package main

import (
	"github.com/gorilla/websocket"
)

type Client struct {
	// The actual websocket connection.
	conn         *websocket.Conn
	wsServer     *WsServer
	send         chan []byte
	RoomCode     string `json:"roomCode"`
	SerialNumber int    `json:"serialNumber"`
	Nickname     string `json:"nickname"`
}
