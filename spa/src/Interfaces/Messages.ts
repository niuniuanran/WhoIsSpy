const BroadcastActions = {
     PlayerJoinedBroadcast: "player-joined",
     PlayerReadyBroadcast: "player-ready",
     PlayerLeftBroadcast : "player-left",
     TalkTurnBroadcast: "talk-turn",
     VoteResultBroadcast: "vote-result",
     PlayerUndoReadyBroadcast: "player-undo-ready"
}

const ReportActions = {
    TalkFinishAction: "talk-finish",
	VoteAction:        "vote",
	PlayerReadyAction: "player-ready",
	PlayerLeftAction:  "player-left",
    PlayerUndoReadyAction: "player-undo-ready"
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

interface ReportMessage{
    action?: string
    senderNickname?: string
    roomCode?: string
    payload?: string
}

export type {BroadcastMessage, ReportMessage, AytMessage}
export {BroadcastActions, ReportActions}