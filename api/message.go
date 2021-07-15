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
	GameWillStartBroadcast  = "game-will-start"
	YourWordBroadcast       = "your-word"
	AskVoteBroadcast        = "please-vote"
)

const (
	AlertTypeSuccess = "success"
	AlertTypeWarning = "warning"
	AlertTypeError   = "error"
	AlertTypeInfo    = "info"
)

type BroadcastMessage struct {
	Action      string `json:"action"`
	Payload     string `json:"payload"`
	RoomCode    string `json:"roomcode"`
	Alert       string `json:"alert"`
	Instruction string `json:"instruction"`
	AlertType   string `json:"alertType"`
}

func (message *BroadcastMessage) encode() []byte {
	json, err := json.Marshal(message)
	if err != nil {
		log.Println(err)
	}

	return json
}

func (message *BroadcastMessage) toString() string {
	return fmt.Sprintf("Action: %s, Payload: %s, Instruction: %s, Alert: %s",
		message.Action, message.Payload, message.Instruction, message.Alert)
}

const (
	TalkFinishAction     = "talk-finish"
	VoteAction           = "vote"
	ReadyAction          = "player-ready"
	LeftAction           = "player-left"
	UndoReadyAction      = "player-undo-ready"
	WordReadAction       = "word-read"
	ResultReceivedAction = "result-received"
	ChangeWordAction     = "change-word"
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
	return fmt.Sprintf("Action: %s, Payload: %s, From: %s",
		message.Action, message.Payload, message.SenderNickname)
}
