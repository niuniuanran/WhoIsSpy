import { useContext, useState, useEffect } from "react"
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext"
import PlayerList from "../Room/PlayerList"
import WordCard from "./WordCard"
import ContentContainer from "../Shared/ContentContainer"
import { PlayerStates } from "../../Interfaces/Player"
import { Vote } from "./Vote"
import { useHistory, useParams } from "react-router-dom";
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext"
import { RoomStates } from "../Room/Room"

export default function Play() {
    const {word, onTalkFinish, onWordRead, instruction, playersInRoom, 
                    nickname, setRoomState} = useContext(RoomContext) as RoomContextType
    const { getCurrentLanguage } = useContext(LanguageContext) as LanguageContextType
    const [playerState, setPlayerState] = useState(PlayerStates.IdleState)
    const history = useHistory()
    const { code } = useParams<{code?: string}>()

    useEffect(() => {
        setPlayerState((playersInRoom?.find(p => p.nickname === nickname)?.state) || PlayerStates.IdleState)
    }, [playersInRoom, nickname])

    const onResultReceived = () => {
        setRoomState(RoomStates.IdleState)
        history.push(`/${getCurrentLanguage()}/room/${code}`)
    }

    return <ContentContainer>
        <div>
            {playerState === PlayerStates.VotingState && <Vote/>}
            {instruction}
            {playerState === PlayerStates.TalkingState && <button onClick={() => {onTalkFinish();}}>
                I Finish
            </button>}
            { (playerState === PlayerStates.WinState || playerState === PlayerStates.LoseState) && <button onClick={() => {onResultReceived();}}>
                OK
            </button>}
            <WordCard word={word} onRead={onWordRead} central={playerState === PlayerStates.WordReadingState}/>
            <PlayerList/>
        </div>
    </ContentContainer>
}