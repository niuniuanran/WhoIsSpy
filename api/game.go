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
		time.Sleep(time.Second * 2)
		room.runTalkRound()
		room.runVoteRound(room.getAlivePlayerPointersInRoom())
	}
	room.announceResult()
	room.tidyUp()
}

func (room *Room) runTalkRound() {
	room.setAllAlivePlayersToState(PlayerListeningState)
	alivePlayers := room.getAlivePlayerPointersInRoom()
	startFrom := rand.Intn(len(alivePlayers))
	i := startFrom
	for {
		alivePlayers[i].State = PlayerTalkingState
		room.broadcastPlayersState("", fmt.Sprintf("%s's turn to talk", alivePlayers[i].Nickname))
		waitForState(func() bool { return alivePlayers[i].State == PlayerTalkFinishedState })
		alivePlayers[i].State = PlayerListeningState
		i++
		if i == len(alivePlayers) {
			i = 0
		}
		if i == startFrom {
			break
		}
	}
}

func (room *Room) runVoteRound(targets []*Player) {
	room.votes = make(map[string][]string)
	room.setAllAlivePlayersToState(PlayerVotingState)
	targetNames := make([]string, 0)
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
	}

	room.broadcastToPlayersInRoom(message.encode())
	room.broadcastPlayersState("", "Please vote")
	log.Println("Called for vote")
	waitForState(func() bool { return room.allAlivePlayersInState(PlayerVotedState) })
	log.Println("All player voted")
	room.calculateVotes()
}

func (room *Room) calculateVotes() {
	alivePlayers := room.getAlivePlayerPointersInRoom()
	maxVoteCount := 0
	maxVoteTargets := make([]*Player, 0)
	for _, p := range alivePlayers {
		count := len(room.votes[p.Nickname])
		if count > maxVoteCount {
			maxVoteTargets = make([]*Player, 0)
			maxVoteTargets = append(maxVoteTargets, p)
			maxVoteCount = count
			continue
		}
		if count == maxVoteCount {
			maxVoteTargets = append(maxVoteTargets, p)
		}
	}

	if len(maxVoteTargets) == 1 {
		maxVoteTargets[0].State = PlayerKilledState
		room.broadcastPlayersState("", fmt.Sprintf("%s is killed", maxVoteTargets[0].Nickname))
		return
	} else {
		room.runVoteRound(maxVoteTargets)
	}
}

func (room *Room) announceResult() {

}

func (room *Room) tidyUp() {
	log.Println("Tidying up...")
	room.state = RoomIdleState
	room.setAllPlayersToState(PlayerIdleState)
}

func (room *Room) deliverWords() {
	rand.Seed(time.Now().UnixNano())
	alivePlayers := room.getAlivePlayerPointersInRoom()
	spyPos := rand.Intn(len(alivePlayers))
	room.spy = alivePlayers[spyPos]
	room.normalWord = "dog"
	room.spyWord = "cat"
	for i := 0; i < len(alivePlayers); i++ {
		word := room.normalWord
		if spyPos == i {
			word = room.spyWord
		}
		alivePlayers[i].send <- (&BroadcastMessage{
			Action:  YourWordBroadcast,
			Payload: word,
		}).encode()
		alivePlayers[i].State = PlayerWordReadingState
	}

	room.broadcastPlayersState("", "")
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

func (room *Room) setAllPlayersToState(state string) {
	for _, p := range room.getPlayerPointersInRoom() {
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
