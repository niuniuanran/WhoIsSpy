import { useContext, useState, useEffect } from "react"
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext"
import PlayerList from "../Room/PlayerList"
import WordCard from "./WordCard"
import ContentContainer from "../Shared/ContentContainer"
import { PlayerStates } from "../../Interfaces/Player"
import { Vote } from "./Vote"

export default function Play() {
    const {word, onTalkFinish, onWordRead, instruction, playersInRoom, nickname, onVote} = useContext(RoomContext) as RoomContextType
    const [playerState, setPlayerState] = useState(PlayerStates.IdleState)

    useEffect(() => {
        setPlayerState((playersInRoom?.find(p => p.nickname === nickname)?.state) || PlayerStates.IdleState)
    }, [playersInRoom, nickname])

    return <ContentContainer>
        <div>
            {playerState === PlayerStates.VotingState && <Vote/>}
            {instruction}
            {playerState === PlayerStates.TalkingState && <button onClick={() => {onTalkFinish();}}>
                I Finish
            </button>}
            <WordCard word={word} onRead={onWordRead} central={playerState === PlayerStates.WordReadingState}/>
            <PlayerList/>
        </div>
    </ContentContainer>
}