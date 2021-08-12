package main

import (
	"encoding/json"
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

func (room *Room) runHealthCheck() {
	for room.state == RoomPlayingState {
		for _, p := range room.getPlayerPointersInRoom() {
			if p.offline {
				room.decideIfGameFinish()
			}
		}
	}
}

func (room *Room) runGame() {
	rand.Seed(time.Now().UnixNano())
	room.state = RoomPlayingState
	go room.runHealthCheck()
	room.assignSpies()
	room.pickWords()
	room.deliverWords()
	room.waitForOneOfStates(
		func() bool { return room.allAlivePlayersInState(PlayerWordGotState) },
		func() bool { return room.state != RoomPlayingState },
	)
	for room.state != RoomGameFinishState {
		time.Sleep(time.Second * 1)
		room.runTalkRound()
		room.runVoteRound(room.getAlivePlayerPointersInRoom(), true)
	}

	room.tidyUp()
}

func (room *Room) runTalkRound() {
	if room.state != RoomPlayingState {
		return
	}
	room.setAllAlivePlayersToState(PlayerListeningState)
	alivePlayers := room.getAlivePlayerPointersInRoom()
	if len(alivePlayers) < 1 {
		room.setAllPlayersToState(PlayerIdleState)
		room.broadcastPlayersState("noAlivePlayers", "", "", AlertTypeWarning)
	}
	startFrom := rand.Intn(len(alivePlayers))
	i := startFrom
	for room.state == RoomPlayingState {
		if alivePlayers[i].offline {
			continue
		}
		alivePlayers[i].State = PlayerTalkingState
		room.broadcastPlayersState("", "turnToTalk", alivePlayers[i].Nickname, "")
		room.waitForOneOfStates(
			func() bool { return alivePlayers[i].State == PlayerTalkFinishedState },
			func() bool { return alivePlayers[i].offline },
			func() bool { return room.state != RoomPlayingState })
		if room.state != RoomPlayingState {
			return
		}
		if !alivePlayers[i].offline {
			alivePlayers[i].State = PlayerListeningState
		}
		i++
		if i == len(alivePlayers) {
			i = 0
		}
		if i == startFrom {
			return
		}
	}
}

func (room *Room) runVoteRound(targets []*Player, firstRound bool) {
	if room.state != RoomPlayingState {
		return
	}
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

	if room.state != RoomPlayingState {
		return
	}

	room.broadcastToOnlinePlayers(message.encode())
	if firstRound {
		room.broadcastPlayersState("", "pleaseVote", "", "")
	} else {
		room.broadcastPlayersState("gotTies", "pleaseVote", "", AlertTypeInfo)
	}
	room.waitForOneOfStates(
		func() bool { return room.allAlivePlayersInState(PlayerVotedState) },
		func() bool { return room.state != RoomPlayingState },
	)

	if room.state != RoomPlayingState {
		return
	}

	room.calculateVotes()
}

func (room *Room) calculateVotes() {
	if room.state != RoomPlayingState {
		return
	}

	alivePlayers := room.getAlivePlayerPointersInRoom()
	if len(alivePlayers) < 1 {
		room.setAllPlayersToState(PlayerIdleState)
		room.broadcastPlayersState("noAlivePlayers", "", "", AlertTypeWarning)
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
		room.runVoteRound(maxVoteTargets, false)
	}

	maxVoteTargets[0].State = PlayerKilledState
	room.broadcastPlayersState("isKilled", "isKilled", maxVoteTargets[0].Nickname, AlertTypeError)
	room.decideIfGameFinish()
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

func (room *Room) decideIfGameFinish() {
	if room.state != RoomPlayingState {
		return
	}

	alivePlayers := room.getAlivePlayerPointersInRoom()
	if len(alivePlayers) < 1 {
		room.setAllPlayersToState(PlayerIdleState)
		room.broadcastPlayersState("noAlivePlayers", "", "", AlertTypeWarning)
		return
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
		return
	}

	if room.numPlayer < 7 {
		if aliveSpyCount >= 1 && aliveGoodCount <= 1 {
			room.spyWins(aliveGoodCount)
			return
		}
	}

	if room.numPlayer >= 7 {
		if aliveSpyCount >= 1 && aliveGoodCount <= 2 {
			room.spyWins(aliveGoodCount)
			return
		}
	}
}

func (room *Room) goodWins() {
	room.state = RoomGameFinishState
	for _, p := range room.getPlayerPointersInRoom() {
		if p.offline {
			p.State = PlayerAppearAwayState
			continue
		}
		if p.isSpy {
			p.State = PlayerLoseState
			continue
		}
		p.State = PlayerWinState
	}

	room.broadcastPlayersState("goodWin", "goodWin", room.listSpies(), "success")
}

func (room *Room) spyWins(aliveCount int) {
	room.state = RoomGameFinishState
	for _, p := range room.getPlayerPointersInRoom() {
		if p.offline {
			p.State = PlayerAppearAwayState
			continue
		}
		if p.isSpy {
			p.State = PlayerWinState
			continue
		}
		p.State = PlayerLoseState
	}
	room.broadcastPlayersState("spiesWin", "spiesWin", room.listSpies(), "error")
}

func (room *Room) listSpies() string {
	spies := make([]string, 0, room.numSpy)
	for _, p := range room.getPlayerPointersInRoom() {
		if p.isSpy {
			spies = append(spies, p.Nickname)
		}
	}
	bs, err := json.Marshal(spies)
	if err != nil {
		log.Println("Error marshaling spy list: ", err.Error())
	}
	log.Println("Spy list:", string(bs))
	return string(bs)
}

func (room *Room) tidyUp() {
	room.state = RoomIdleState

	for _, p := range room.getPlayerPointersInRoom() {
		if p.offline {
			room.unregisterPlayerInRoom(p)
		}
		if room == nil {
			return
		}
	}

	room.waitForOneOfStates(
		func() bool { return room.allPlayersInStates(PlayerResultReceivedState, PlayerAppearAwayState) },
	)

	for _, s := range room.spies {
		s.isSpy = false
	}
	room.spies = make([]*Player, 0)

	room.setAllPlayersToState(PlayerIdleState)
	room.broadcastPlayersState("", "", "", "")
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
			return
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

	room.broadcastPlayersState("", "", "", "")
}

func (room *Room) allAlivePlayersInState(state string) bool {
	for _, p := range room.getAlivePlayerPointersInRoom() {
		if p.State != state {
			return false
		}
	}

	return true
}

func (room *Room) allPlayersInStates(states ...string) bool {
	oneOfState := func(state string) bool {
		for _, s := range states {
			if state == s {
				return true
			}
		}
		return false
	}

	for _, p := range room.getPlayerPointersInRoom() {
		if !oneOfState(p.State) {
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

func (room *Room) waitForOneOfStates(checks ...func() bool) {
	for {
		time.Sleep(time.Second)
		for _, check := range checks {
			if check() {
				return
			}
		}
	}
}

func (room *Room) changeWord(nickname string) {
	room.setAllAlivePlayersToState(PlayerWordChangingState)
	room.broadcastPlayersState("requestChangeWord", "", nickname, AlertTypeInfo)
	time.Sleep(time.Second)
	room.pickWords()
	room.deliverWords()
}
