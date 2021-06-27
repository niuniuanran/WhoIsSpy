package main

import "fmt"

type WsServer struct {
	players    map[*Player]bool
	rooms      map[*Room]bool
	register   chan *Player
	unregister chan *Player
	broadcast  chan []byte
}

func NewWebsocketServer() *WsServer {
	return &WsServer{
		players:    make(map[*Player]bool),
		register:   make(chan *Player),
		unregister: make(chan *Player),
		broadcast:  make(chan []byte),
		rooms:      make(map[*Room]bool),
	}
}

// Run our websocket server, accepting various requests
func (server *WsServer) Run() {
	for {
		select {
		case player := <-server.register:
			server.registerPlayer(player)

		case player := <-server.unregister:
			server.unregisterPlayer(player)

		case message := <-server.broadcast:
			server.broadcastToPlayers(message)
		}
	}
}

func (server *WsServer) registerPlayer(player *Player) {
	server.notifyPlayerJoined(player)
	// server.listOnlinePlayers(player)
	server.players[player] = true
}

func (server *WsServer) unregisterPlayer(player *Player) {
	if _, ok := server.players[player]; ok {
		delete(server.players, player)
		server.notifyPlayerLeft(player)
	}
}

func (server *WsServer) notifyPlayerJoined(player *Player) {
	message := &BroadcastMessage{
		Action:     UserJoinedBroadcast,
		Payload:    player.Nickname,
		TargetRoom: findRoomByCode(player.RoomCode),
	}

	server.broadcastToPlayersInRoom(message)
}

func (server *WsServer) notifyPlayerLeft(player *Player) {
	message := &BroadcastMessage{
		Action:     UserLeftBroadcast,
		Payload:    player.Nickname,
		TargetRoom: findRoomByCode(player.RoomCode),
	}

	server.broadcastToPlayersInRoom(message)
}

func (server *WsServer) broadcastToPlayers(message []byte) {
	for player := range server.players {
		player.send <- message
	}
}

func (server *WsServer) broadcastToPlayersInRoom(message *BroadcastMessage) {
	fmt.Printf("Broadcasting to players in toom: %s. Message: %s", message.TargetRoom.Code, message.toString())
	for player := range server.players {
		if player.RoomCode == message.TargetRoom.Code {
			player.send <- message.encode()
		}
	}
}

// func (server *WsServer) listOnlinePlayers(player *Player) {
// 	for existingPlayer := range server.players {
// 		message := &Message{
// 			Action: UserJoinedAction,
// 			Sender: existingPlayer,
// 		}
// 		player.send <- message.encode()
// 	}

// }

// func (server *WsServer) createRoom(name string, private bool) *Room {
// 	room := NewRoom(name, private)
// 	go room.RunRoom()
// 	server.rooms[room] = true

// 	return room
// }
