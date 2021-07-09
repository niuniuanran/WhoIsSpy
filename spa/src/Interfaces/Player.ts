export default interface Player{
    nickname: string,
    serialNumber: number
    ready?: boolean,
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
    TalkFinishState: "talk-finish",
	VotingState: "player-voting",
	KilledState: "player-killed",
	WinState: "player-win",
}

export {PlayerStates}