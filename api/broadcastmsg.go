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
	PlayerJoinedBroadcast   = "player-joined"
	PlayerLeftBroadcast     = "player-left"
	PlayerNewStateBroadcast = "player-state"

	PlayerReadyBroadcast     = "player-ready"
	TalkTurnBroadcast        = "talk-turn"
	VoteResultBroadcast      = "vote-result"
	PlayerUndoReadyBroadcast = "player-undo-ready"
	GameWillStartBroadcast   = "game-will-start"
	PleaseVoteBroadcast      = "please-vote"
	YourWordBroadcast        = "your-word"
)

type BroadcastMessage struct {
	Action   string `json:"action"`
	Payload  string `json:"payload"`
	RoomCode string `json:"roomcode"`
	Line     string `json:"line"`
}

func (message *BroadcastMessage) encode() []byte {
	json, err := json.Marshal(message)
	if err != nil {
		log.Println(err)
	}

	return json
}

func (message *BroadcastMessage) toString() string {
	return fmt.Sprintf("Action: %s, Payload: %s",
		message.Action, message.Payload)
}
