const BroadcastActions = {
     PlayerLeftBroadcast : "player-left",
     PlayerJoinedBroadcast: "player-joined",
     PlayerNewStateBroadcast: "player-state",
     VoteResultBroadcast: "vote-result",

     PlayerReadyBroadcast: "player-ready",
     TalkTurnBroadcast: "talk-turn",
     PlayerUndoReadyBroadcast: "player-undo-ready",
     GameWillStartBroadcast: "game-will-start", 	
     PleaseVoteBroadcast: "please-vote",
     YourWordBroadcast: "your-word"
}

const ReportActions = {
    TalkFinishAction: "talk-finish",
	VoteAction:        "vote",
	PlayerReadyAction: "player-ready",
	PlayerLeftAction:  "player-left",
    PlayerUndoReadyAction: "player-undo-ready",
    WordReadAction: "word-read"
}

const PlayInstructions = {
    PleaseTalk: "please-talk",
    PleaseVote: "please-vote",
    YourWord: "your-word"
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
export {BroadcastActions, ReportActions, PlayInstructions}