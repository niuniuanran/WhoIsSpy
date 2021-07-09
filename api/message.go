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
	AskVoteBroadcast        = "please-vote"
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

const (
	TalkFinishAction      = "talk-finish"
	VoteAction            = "vote"
	PlayerReadyAction     = "player-ready"
	PlayerLeftAction      = "player-left"
	PlayerUndoReadyAction = "player-undo-ready"
	WordReadAction        = "word-read"
)

// Message is sent through websocket connections between the room and client.
type ReportMessage struct {
	Action         string `json:"action"`
	SenderNickname string `json:"senderNickname"`
	RoomCode       string `json:"roomCode"`
	Payload        string `json:"payload"`
}

func (report *ReportMessage) encode() []byte {
	json, err := json.Marshal(report)
	if err != nil {
		log.Println(err)
	}

	return json
}

func (message *ReportMessage) toString() string {
	return fmt.Sprintf("Action: %s, Payload: %s",
		message.Action, message.Payload)
}