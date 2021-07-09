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
    PlayerWordGotState: "got",
	ListeningState: "listening",
	TalkingState:"talking",
	VotingState: "voting",
	KilledState: "killed",
	WinState: "win",
    TalkFinishState: "talked",
    PlayerVotedState: "voted"
}

export {PlayerStates}