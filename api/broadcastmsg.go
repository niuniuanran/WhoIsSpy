package main

import (
	"encoding/json"
	"log"
)

type Message interface {
	encode() []byte
}

const (
	UserJoinedBroadcast = "user-joined"
	UserReadyBroadcast  = "user-ready"
	UserLeftBroadcast   = "user-left"
	TalkTurnBroadcast   = "talk-turn"
	VoteResultBroadcast = "vote-result"
)

type BroadcastMessage struct {
	Action  string  `json:"action"`
	Payload string  `json:"payload"`
	Target  *Room   `json:"target"`
	Sender  *Player `json:"sender"`
}

func (Broadcast *BroadcastMessage) encode() []byte {
	json, err := json.Marshal(Broadcast)
	if err != nil {
		log.Println(err)
	}

	return json
}
