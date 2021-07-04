
const BroadcastActions = {
     PlayerJoinedBroadcast: "player-joined",
     PlayerReadyBroadcast: "player-ready",
     PlayerLeftBroadcast : "player-left",
     TalkTurnBroadcast: "talk-turn",
     VoteResultBroadcast: "vote-result"
}

interface AytMessage {
    line?: string
    numPlayer?: number
}

interface BroadcastMessage{
    action: string
    payload: string
    roomcode?: string
    line?: string
}

const ReportActions = {
    TalkFinishAction: "talk-finish",
	VoteAction: "vote",
	ReadyStartAction: "ready-start",
	PlayerLeftAction: "player-left"
}

interface ReportMessage{
    action?: string
    senderNickname?: string
    roomCode?: string
    payload?: string
}

export type {BroadcastMessage, ReportMessage, AytMessage}
export {BroadcastActions, ReportActions}