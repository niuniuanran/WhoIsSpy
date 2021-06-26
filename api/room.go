package main

type Room struct {
	Code       string `json:"code"`
	PlayerNum  int    `json:"playerNum"`
	SpyNum     int    `json:"spyNum"`
	Language   string `json:"language"`
	players    map[*Player]bool
	register   chan *Player
	unregister chan *Player
	broadcast  chan *BroadcastMessage
}

type RoomSettings struct {
	Language     string `json:"language"`
	PlayerNum    int    `json:"playerNum"`
	SpyNum       int    `json:"spyNum"`
	EighteenPlus bool   `json:"eighteenPlus"`
}

func NewRoom(roomSettings RoomSettings) *Room {
	return &Room{
		Code:       generateCode(),
		Language:   roomSettings.Language,
		PlayerNum:  roomSettings.PlayerNum,
		SpyNum:     roomSettings.SpyNum,
		players:    make(map[*Player]bool, roomSettings.PlayerNum),
		register:   make(chan *Player),
		unregister: make(chan *Player),
		broadcast:  make(chan *BroadcastMessage),
	}
}

func generateCode() string {
	return "1234"
}
