export default interface Player{
    nickname: string,
    serialNumber: number
    ready?: boolean,
    roomCode?: string,
    state: number
}

const PlayerStates = {
    IdleState: 0,
	ReadyState: 1,
	WordReadingState: 2,
	ListeningState: 3,
	TalkingState: 4,
	VotingState: 5,
	KilledState: 6,
	WinState: 7
}

export {PlayerStates}