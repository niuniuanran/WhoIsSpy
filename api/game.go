package main

import (
	"log"
	"math/rand"
	"time"
)

func (room *Room) startGame() {
	message := BroadcastMessage{
		Action:   GameWillStartBroadcast,
		RoomCode: room.Code,
	}
	time.Sleep(500 * time.Millisecond)
	room.broadcastToPlayersInRoom((message.encode()))
	time.Sleep(3 * time.Second)
	room.runGame()
}

func (room *Room) runGame() {
	room.state = RoomPlayingState
	room.deliverWords()
	for room.state != RoomGameFinishState {
		room.runTalkRound()
		room.collectVote()
	}
	room.announceResult()
	room.tidyUp()
}

func (room *Room) runTalkRound() {
	message := &BroadcastMessage{
		Action:   PlayerNewStateBroadcast,
		Payload:  PlayerTalkingState,
		RoomCode: room.Code,
	}
	room.broadcastToPlayersInRoom(message.encode())
	for {
		if room.AllPlayersInState(PlayerTalkFinishedState) {
			return
		}
	}
}

func (room *Room) collectVote() {
	message := &BroadcastMessage{
		Action:   PlayerNewStateBroadcast,
		Payload:  PlayerVotingState,
		RoomCode: room.Code,
	}
	room.broadcastToPlayersInRoom(message.encode())
	for {
		if room.AllPlayersInState(PlayerVotedState) {
			break
		}
	}

}

func (room *Room) announceResult() {

}

func (room *Room) tidyUp() {
	room.state = RoomIdleState
	for _, p := range room.getPlayerPointersInRoom() {
		p.State = PlayerIdleState
	}
}

func (room *Room) deliverWords() {
	rand.Seed(time.Now().UnixNano())
	spy := rand.Intn(room.numPlayer)
	players := room.getPlayerPointersInRoom()
	room.spy = players[spy]
	room.normalWord = "dog"
	room.spyWord = "cat"
	room.votes = make(map[string]string, room.numPlayer)
	room.startPosition = rand.Intn(room.numPlayer)
	i := room.startPosition
	for {
		word := room.normalWord
		if spy == i {
			word = room.spyWord
		}
		players[i].send <- (&BroadcastMessage{
			Action:  YourWordBroadcast,
			Payload: word,
		}).encode()
		players[i].State = PlayerWordReadingState
		i++
		if i == room.startPosition {
			break
		}
		if i == room.numPlayer {
			i = 0
		}
	}

	for {
		if room.AllPlayersInState(PlayerWordGotState) {
			log.Println("Words read by all players")
			return
		}
	}
}

func (room *Room) AllPlayersInState(state string) bool {
	for _, p := range room.getPlayerPointersInRoom() {
		if p.State != state {
			return false
		}
	}
	return true
}
