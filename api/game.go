package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"strings"
	"time"
)

func (room *Room) startGame() {
	message := BroadcastMessage{
		Action:   GameWillStartBroadcast,
		RoomCode: room.Code,
	}
	time.Sleep(500 * time.Millisecond)
	room.broadcastToOnlinePlayers((message.encode()))
	time.Sleep(3 * time.Second)
	room.runGame()
}

func (room *Room) runGame() {
	rand.Seed(time.Now().UnixNano())
	room.state = RoomPlayingState
	room.assignSpies()
	room.pickWords()
	room.deliverWords()
	waitForState(func() bool { return room.allAlivePlayersInState(PlayerWordGotState) })
	for room.state != RoomGameFinishState {
		time.Sleep(time.Second * 1)
		gameHealthy := room.runTalkRound()
		if !gameHealthy {
			return
		}
		gameHealthy = room.runVoteRound(room.getAlivePlayerPointersInRoom(), true)
		if !gameHealthy {
			return
		}
	}

	room.tidyUp()
}

func (room *Room) runTalkRound() bool {
	room.setAllAlivePlayersToState(PlayerListeningState)
	alivePlayers := room.getAlivePlayerPointersInRoom()
	if len(alivePlayers) < 1 {
		room.setAllPlayersToState(PlayerIdleState)
		room.broadcastPlayersState("No alive players in room", "", AlertTypeWarning)
		return false
	}
	startFrom := rand.Intn(len(alivePlayers))
	i := startFrom
	for {
		alivePlayers[i].State = PlayerTalkingState
		room.broadcastPlayersState("", fmt.Sprintf("%s's turn to talk", alivePlayers[i].Nickname), "")
		waitForState(func() bool { return alivePlayers[i].State == PlayerTalkFinishedState })
		alivePlayers[i].State = PlayerListeningState
		i++
		if i == len(alivePlayers) {
			i = 0
		}
		if i == startFrom {
			return true
		}
	}
}

func (room *Room) runVoteRound(targets []*Player, firstRound bool) bool {
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

	room.broadcastToOnlinePlayers(message.encode())
	if firstRound {
		room.broadcastPlayersState("", "Please vote", "")
	} else {
		room.broadcastPlayersState("Got ties. Please vote again", "Please vote", AlertTypeInfo)
	}
	waitForState(func() bool { return room.allAlivePlayersInState(PlayerVotedState) })
	return room.calculateVotes()
}

func (room *Room) calculateVotes() bool {
	alivePlayers := room.getAlivePlayerPointersInRoom()
	if len(alivePlayers) < 1 {
		room.setAllPlayersToState(PlayerIdleState)
		room.broadcastPlayersState("No alive players in room", "", AlertTypeWarning)
		return false
	}
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
		return room.runVoteRound(maxVoteTargets, false)
	}

	maxVoteTargets[0].State = PlayerKilledState
	room.broadcastPlayersState(fmt.Sprintf("%s is killed", maxVoteTargets[0].Nickname), fmt.Sprintf("%s is killed", maxVoteTargets[0].Nickname), AlertTypeError)
	return room.decideIfGameFinish()
}

func (room *Room) assignSpies() {
	players := room.getPlayerPointersInRoom()
	room.spies = make([]*Player, 0, room.numPlayer)
	perm := rand.Perm(len(players))
	for i := 0; i < room.numSpy; i++ {
		room.spies = append(room.spies, players[perm[i]])
		players[perm[i]].isSpy = true
	}
}

func (room *Room) decideIfGameFinish() bool {
	alivePlayers := room.getAlivePlayerPointersInRoom()
	if len(alivePlayers) < 1 {
		room.setAllPlayersToState(PlayerIdleState)
		room.broadcastPlayersState("No alive players in room", "", AlertTypeWarning)
		return false
	}
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
		return true
	}

	if room.numPlayer < 7 {
		if aliveSpyCount >= 1 && aliveGoodCount <= 1 {
			room.spyWins()
			return true
		}
	}

	if room.numPlayer >= 7 {
		if aliveSpyCount >= 1 && aliveGoodCount <= 2 {
			room.spyWins()
			return true
		}
	}
	return true
}

func (room *Room) goodWins() {
	for _, p := range room.getPlayerPointersInRoom() {
		if p.isSpy {
			p.State = PlayerLoseState
			continue
		}
		p.State = PlayerWinState
	}
	room.broadcastPlayersState("Good peope win", "Good peope win", "success")
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
	room.broadcastPlayersState("Spies win", "Spies win", "error")
	room.state = RoomGameFinishState
}

func (room *Room) tidyUp() {
	room.state = RoomIdleState
	waitForState(func() bool { return room.allPlayersInState(PlayerResultReceivedState) })
	for _, s := range room.spies {
		s.isSpy = false
	}
	room.spies = make([]*Player, 0)
	room.setAllPlayersToState(PlayerIdleState)
	room.broadcastPlayersState("", "", "")
}

func (room *Room) pickWords() {
	pickedN := rand.Intn(len(room.wordPairs))
	pickedWords := strings.Split(room.wordPairs[pickedN], "——")
	room.wordPairs = append(room.wordPairs[:pickedN], room.wordPairs[pickedN+1:]...)
	if room.RandomBlank {
		r := rand.Intn(10)
		if r > 7 {
			room.normalWord = pickedWords[r%2]
			room.spyWord = ""
		}
	}
	room.normalWord = pickedWords[pickedN%2]
	room.spyWord = pickedWords[1-pickedN%2]
}

func (room *Room) deliverWords() {
	players := room.getAlivePlayerPointersInRoom()
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

	room.broadcastPlayersState("", "", "")
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

func (room *Room) changeWord(nickname string) {
	room.setAllAlivePlayersToState(PlayerWordChangingState)
	instruction := fmt.Sprintf("%s requested to change the word", nickname)
	room.broadcastPlayersState(instruction, "", AlertTypeInfo)
	time.Sleep(time.Second)
	room.pickWords()
	room.deliverWords()
}
