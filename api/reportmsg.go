package main

import (
	"encoding/json"
	"log"
)

const (
	CreateRoomAction = "create-room"
	JoinRoomAction   = "join-room"
	NicknameAction   = "nickname"
	TalkFinishAction = "talk-finish"
	VoteAction       = "vote"
	ReadyStartAction = "ready-start"
)

// Message is sent through websocket connections between the room and client.
type ReportMessage struct {
	Action  string  `json:"action"`
	Sender  *Player `json:"sender"`
	Message string  `json:"message"`
	Target  *Room   `json:"target"`
}

func (report *ReportMessage) encode() []byte {
	json, err := json.Marshal(report)
	if err != nil {
		log.Println(err)
	}

	return json
}
