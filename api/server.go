package main

type WsServer struct {
	clients    map[*Player]bool
	rooms      map[*Room]bool
	register   chan *Player
	unregister chan *Player
	broadcast  chan []byte
}
