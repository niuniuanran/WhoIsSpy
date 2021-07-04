package main

import (
	"encoding/json"
	"fmt"
	"log"
)

const (
	TalkFinishAction  = "talk-finish"
	VoteAction        = "vote"
	PlayerReadyAction = "player-ready"
	PlayerLeftAction  = "player-left"
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
