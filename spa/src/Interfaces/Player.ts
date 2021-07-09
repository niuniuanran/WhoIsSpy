export default interface Player{
    nickname: string,
    serialNumber: number
    roomCode?: string,
    state: string
}

const PlayerStates = {
    IdleState: "player-idle",
	ReadyState: "player-ready",
	WordReadingState: "player-reading",
    PlayerWordGotState: "player-word-got",
	ListeningState: "player-listening",
	TalkingState:"player-talking",
	VotingState: "player-voting",
	KilledState: "player-killed",
	WinState: "player-win",
    TalkFinishState: "talk-finish",
    PlayerVotedState: "player-voted"
}

export {PlayerStates}