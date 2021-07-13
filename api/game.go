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
	room.assignSpies()
	room.deliverWords()
	for room.state != RoomGameFinishState {
		time.Sleep(time.Second * 1)
		room.runTalkRound()
		room.runVoteRound(room.getAlivePlayerPointersInRoom())
	}

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
	waitForState(func() bool { return room.allAlivePlayersInState(PlayerVotedState) })
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

	if len(maxVoteTargets) > 1 {
		room.runVoteRound(maxVoteTargets)
	}

	maxVoteTargets[0].State = PlayerKilledState
	room.broadcastPlayersState("", fmt.Sprintf("%s is killed", maxVoteTargets[0].Nickname))
	room.decideIfGameFinish()
}

func (room *Room) assignSpies() {
	players := room.getPlayerPointersInRoom()
	room.spies = make([]*Player, 0, room.numPlayer)
	rand.Seed(time.Now().UnixNano())
	perm := rand.Perm(len(players))
	for i := 0; i < room.numSpy; i++ {
		room.spies = append(room.spies, players[perm[i]])
		players[perm[i]].isSpy = true
	}
}

func (room *Room) decideIfGameFinish() {
	alivePlayers := room.getAlivePlayerPointersInRoom()
	aliveSpyCount := 0
	aliveGoodCount := 0
	for _, p := range alivePlayers {
		if p.isSpy {
			aliveSpyCount++
			continue
		}
		aliveGoodCount++
	}

	if aliveSpyCount == 0 {
		room.goodWins()
		return
	}

	if room.numPlayer < 7 {
		if aliveSpyCount >= 1 && aliveGoodCount <= 1 {
			room.spyWins()
			return
		}
	}

	if room.numPlayer >= 7 {
		if aliveSpyCount >= 1 && aliveGoodCount <= 2 {
			room.spyWins()
			return
		}
	}
}

func (room *Room) goodWins() {
	for _, p := range room.getPlayerPointersInRoom() {
		if p.isSpy {
			p.State = PlayerLoseState
			continue
		}
		p.State = PlayerWinState
	}
	room.broadcastPlayersState("Good players win", "")
	room.state = RoomGameFinishState
}

func (room *Room) spyWins() {
	for _, p := range room.getPlayerPointersInRoom() {
		if p.isSpy {
			p.State = PlayerWinState
			continue
		}
		p.State = PlayerLoseState
	}
	room.broadcastPlayersState("Spies win", "")
	room.state = RoomGameFinishState
}

func (room *Room) tidyUp() {
	room.state = RoomIdleState
	waitForState(func() bool { return room.allPlayersInState(ResultReceivedState) })
	for _, s := range room.spies {
		s.isSpy = false
	}
	room.spies = make([]*Player, 0)
	room.setAllPlayersToState(PlayerIdleState)
	room.broadcastPlayersState("", "")
}

func (room *Room) deliverWords() {
	rand.Seed(time.Now().UnixNano())
	players := room.getAlivePlayerPointersInRoom()
	room.normalWord = "dog"
	room.spyWord = "cat"
	for i := 0; i < len(players); i++ {
		word := room.normalWord
		if players[i].isSpy {
			word = room.spyWord
		}
		players[i].send <- (&BroadcastMessage{
			Action:  YourWordBroadcast,
			Payload: word,
		}).encode()
		players[i].State = PlayerWordReadingState
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

func (room *Room) allPlayersInState(state string) bool {
	for _, p := range room.getPlayerPointersInRoom() {
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
