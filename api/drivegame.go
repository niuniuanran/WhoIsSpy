package main

import (
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
	rand.Seed(time.Now().UnixNano())
	spy := rand.Intn(room.numPlayer)
	players := room.getPlayerPointersInRoom()
	room.spy = players[spy]
	room.normalWord = "dog"
	room.spyWord = "cat"
	room.votes = make(map[string]int, room.numPlayer)
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
		i++
		if i == room.startPosition {
			break
		}
		if i == room.numPlayer {
			i = 0
		}
		room.wordReadByPlayers = 0
	}

	for room.wordReadByPlayers < room.numPlayer {
		continue
	}

	for {
		players[i].talked = false
		players[i].send <- (&BroadcastMessage{
			Action:  TalkTurnBroadcast,
			Payload: "",
		}).encode()

		for {
			if players[i].talked {
				break
			}
		}

		i++
		if i == room.startPosition {
			break
		}
		if i == room.numPlayer {
			i = 0
		}
	}

	for {
		players[i].send <- (&BroadcastMessage{
			Action: PleaseVoteBroadcast,
		}).encode()
		i++
		if i == room.startPosition {
			break
		}
		if i == room.numPlayer {
			i = 0
		}
	}

}

func (room *Room) vote(player *Player, target string) {

}
