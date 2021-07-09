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
	VoteResultBroadcast     = "vote-result"
	GameWillStartBroadcast  = "game-will-start"
	YourWordBroadcast       = "your-word"

	// PlayerReadyBroadcast     = "player-ready"
	// TalkTurnBroadcast        = "talk-turn"
	// PlayerUndoReadyBroadcast = "player-undo-ready"
	// GameWillStartBroadcast   = "game-will-start"
	// PleaseVoteBroadcast      = "please-vote"
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
