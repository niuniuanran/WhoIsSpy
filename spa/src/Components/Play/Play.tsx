import { useContext, useState, useEffect } from "react"
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext"
import PlayerList from "../Room/PlayerList"
import WordCard from "./WordCard"
import ContentContainer from "../Shared/ContentContainer"
import { PlayerStates } from "../../Interfaces/Player"

export default function Play() {
    const {word, onTalkFinish, onWordRead, instruction, playersInRoom, nickname, onVote} = useContext(RoomContext) as RoomContextType
    const [playerState, setPlayerState] = useState(PlayerStates.IdleState)

    useEffect(() => {
        setPlayerState((playersInRoom?.find(p => p.nickname === nickname)?.state) || PlayerStates.IdleState)
    }, [playersInRoom, nickname])

    if (!playerState) {
        setPlayerState(playersInRoom?.find(p => p.nickname === nickname)?.state || "")
    }
    console.log(playerState)

    return <ContentContainer>
        <div>
            {instruction}
            <button onClick={() => {onTalkFinish();}}>
                I Finish
            </button>
            <button onClick={() => {onVote("a");}}>
                I Vote
            </button>
            <WordCard word={word} onRead={onWordRead} central={playerState === PlayerStates.WordReadingState}/>
            <PlayerList/>
        </div>
    </ContentContainer>

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
}