import { CircularProgress } from "@material-ui/core"
import { useContext } from "react"
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext"
import PlayerList from "../Room/PlayerList"
import WordCard from "./WordCard"
import ContentContainer from "../Shared/ContentContainer"
import { PlayerStates } from "../../Interfaces/Player"

export default function Play() {
    const { playerState, word, onTalkFinish, onWordRead} = useContext(RoomContext) as RoomContextType
    
    if (playerState === PlayerStates.WordReadingState) {
        return <ContentContainer>
            <WordCard word={word} central onRead={onWordRead}/>
        </ContentContainer>
    }

    if (playerState === PlayerStates.TalkingState) {
        return <div>
            Your turn to talk
            <button onClick={onTalkFinish}>
                I Finish
            </button>
        </div>
    }

    if (playerState === PlayerStates.VotingState) {
        return <PlayerList/>
    }

    return <CircularProgress size="5rem"/>
}