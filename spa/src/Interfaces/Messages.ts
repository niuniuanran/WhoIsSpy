const BroadcastActions = {
     PlayerLeftBroadcast : "player-left",
     PlayerJoinedBroadcast: "player-joined",
     PlayerNewStateBroadcast: "player-state",
     YourWordBroadcast: "your-word",
     GameWillStartBroadcast: "game-will-start", 	
     AskVoteBroadcast: "please-vote",
}

const ReportActions = {
    TalkFinishAction: "talk-finish",
	VoteAction:        "vote",
	PlayerReadyAction: "player-ready",
	PlayerLeftAction:  "player-left",
    PlayerUndoReadyAction: "player-undo-ready",
    WordReadAction: "word-read",
    ResultReceived: "result-received",
    ChangeWordAction: "change-word"
}

interface AytMessage {
    line?: string
    numPlayer?: number
}

interface BroadcastMessage{
    action: string
    payload: string
    roomcode?: string
    alert?: string
    instruction?: string
    alertType?: string
}

interface ReportMessage{
    action?: string
    senderNickname?: string
    roomCode?: string
    payload?: string
}

export type {BroadcastMessage, ReportMessage, AytMessage}
export {BroadcastActions, ReportActions}