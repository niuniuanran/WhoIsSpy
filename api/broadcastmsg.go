package main

import (
	"encoding/json"
	"fmt"
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
	Action  string `json:"action"`
	Payload string `json:"payload"`
}

func (message *BroadcastMessage) encode() []byte {
	json, err := json.Marshal(message)
	if err != nil {
		log.Println(err)
	}

	return json
}

func (message *BroadcastMessage) toString() string {
	return fmt.Sprintf("Action: %s, Payload: %s, Target room: %s",
		message.Action, message.Payload)
}
