package main

import (
	"encoding/json"
	"fmt"
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
		room.runVoteRound(room.getAlivePlayerPointersInRoom())
	}
	room.announceResult()
	room.tidyUp()
}

func (room *Room) runTalkRound() {
	players := room.getAlivePlayerPointersInRoom()
	room.setAllAlivePlayersToState(PlayerListeningState)
	i := room.startPosition
	for {
		players[i].State = PlayerTalkingState
		room.broadcastPlayersState(fmt.Sprintf("%s's turn to talk", players[i].Nickname))

		waitForState(func() bool { return players[i].State == PlayerTalkFinishedState })
		players[i].State = PlayerListeningState

		i++
		if i == room.startPosition {
			break
		}
		if i == room.numPlayer {
			i = 0
		}
	}

}

func (room *Room) runVoteRound(targets []*Player) {
	room.votes = make(map[string][]string, room.numPlayer)
	players := room.getAlivePlayerPointersInRoom()
	for _, p := range players {
		p.State = PlayerVotingState
	}

	targetNames := make([]string, len(targets))
	for _, p := range targets {
		targetNames = append(targetNames, p.Nickname)
	}
	bs, err := json.Marshal(targetNames)
	if err != nil {
		log.Println("Failed to marshal target names")
	}

	message := BroadcastMessage{
		Action:   AskVoteBroadcast,
		Payload:  string(bs),
		RoomCode: room.Code,
		Line:     "Please vote",
	}
	room.broadcastToPlayersInRoom(message.encode())
	waitForState(func() bool { return room.allAlivePlayersInState(PlayerVotedState) })
	room.calculateVotes()
}

func (room *Room) calculateVotes() {
	players := room.getAlivePlayerPointersInRoom()
	maxVoteCount := 0
	maxVoteTargets := make([]*Player, 0)
	for _, p := range players {
		count := len(room.votes[p.Nickname])
		if count > maxVoteCount {
			maxVoteTargets = make([]*Player, 0)
			maxVoteTargets = append(maxVoteTargets, p)
			maxVoteCount = count
		}
		if count == maxVoteCount {
			maxVoteTargets = append(maxVoteTargets, p)
		}
	}
	if len(maxVoteTargets) == 1 {
		maxVoteTargets[0].State = PlayerKilledState
		room.broadcastPlayersState(fmt.Sprintf("%s is killed", maxVoteTargets[0].Nickname))
		return
	} else {
		room.runVoteRound(maxVoteTargets)
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
	waitForState(func() bool { return room.allAlivePlayersInState(PlayerWordGotState) })
}

func (room *Room) allAlivePlayersInState(state string) bool {
	for _, p := range room.getAlivePlayerPointersInRoom() {
		if p.State != state {
			return false
		}
	}
	return true
}

func (room *Room) setAllAlivePlayersToState(state string) {
	for _, p := range room.getAlivePlayerPointersInRoom() {
		p.State = state
	}
}

func waitForState(check func() bool) {
	for {
		time.Sleep(time.Second)
		if check() {
			return
		}
	}
}
