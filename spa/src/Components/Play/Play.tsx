import { CircularProgress } from "@material-ui/core"
import { useContext } from "react"
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext"
import { PlayInstructions } from "../../Interfaces/Messages"
import PlayerList from "../Room/PlayerList"

export default function Play() {
    const { instruction, word, onVote, onTalkFinish, onWordRead} = useContext(RoomContext) as RoomContextType
    
    if (instruction === PlayInstructions.YourWord) {
        return <div>
            Your word: <span>{word}</span>
            <button onClick={onWordRead}>
                Got it
            </button>
        </div>
    }

    if (instruction === PlayInstructions.PleaseTalk) {
        return <div>
            Your turn to talk
            <button onClick={onTalkFinish}>
                I Finish
            </button>
        </div>
    }

    if (instruction === PlayInstructions.PleaseVote) {
        return <PlayerList/>
    }

    return <CircularProgress size="5rem"/>
}