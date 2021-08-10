export default interface Player{
    nickname: string,
    serialNumber: number
    roomCode?: string,
    state: string
}

const PlayerStates = {
    IdleState: "",
	ReadyState: "ready",
	WordReadingState: "reading",
	ListeningState: "listening",
	TalkingState:"talking",
	VotingState: "voting",
	KilledState: "killed",
	WinState: "win",
    LoseState: "lose",
    VotedState: "voted",
    WordChangingState:"wordChanging",
    AppearAwayState: "offline"
}

export {PlayerStates}