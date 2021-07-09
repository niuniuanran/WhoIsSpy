import { CircularProgress } from "@material-ui/core"
import { useContext } from "react"
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext"
import PlayerList from "../Room/PlayerList"
import WordCard from "./WordCard"
import ContentContainer from "../Shared/ContentContainer"
import { PlayerStates } from "../../Interfaces/Player"

export default function Play() {
    const {word, onTalkFinish, onWordRead, instruction, playersInRoom, nickname, playerState, setPlayerState} = useContext(RoomContext) as RoomContextType
    if (!playerState) {
        setPlayerState(playersInRoom?.find(p => p.nickname === nickname)?.state || "")
    }
    console.log(playerState)
    if (playerState === PlayerStates.WordReadingState) {
        return <ContentContainer>
            <>
            <PlayerList/>
            <WordCard word={word} central onRead={onWordRead}/>
            </>
        </ContentContainer>
    }

    if (playerState === PlayerStates.ListeningState) {
        return <div>
            <PlayerList/>
            {instruction}
        </div>
    }

    if (playerState === PlayerStates.TalkingState) {
        return <div>
            <PlayerList/>
            Your turn to talk
            <button onClick={onTalkFinish}>
                I Finish
            </button>
        </div>
    }

    if (playerState === PlayerStates.VotingState) {
        return <PlayerList/>
    }

    return <><CircularProgress size="5rem"/><PlayerList/></>
}