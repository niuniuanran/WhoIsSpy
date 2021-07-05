import { CircularProgress } from "@material-ui/core"
import { useContext } from "react"
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext"
import { PlayInstructions } from "../../Interfaces/Messages"
import PlayerList from "../Room/PlayerList"

export default function Play() {
    const { instruction, word } = useContext(RoomContext) as RoomContextType
    
    if (instruction === PlayInstructions.YourWord) {
        return <div>
            Your word: <span>{word}</span>
        </div>
    }

    if (instruction === PlayInstructions.PleaseTalk) {
        return <div>
            Your turn to talk
            <button>
                I Finish
            </button>
        </div>
    }

    if (instruction === PlayInstructions.PleaseVote) {
        return <PlayerList/>
    }

    return <CircularProgress size="5rem"/>
}