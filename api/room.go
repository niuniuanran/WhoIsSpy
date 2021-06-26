package main

type Room struct {
	Code       string `json:"code"`
	clients    map[*Client]bool
	register   chan *Client
	unregister chan *Client
	broadcast  chan *BroadcastMessage
}
