package main

type WsServer struct {
	players    map[*Player]bool
	rooms      map[*Room]bool
	register   chan *Player
	unregister chan *Player
	broadcast  chan []byte
}
