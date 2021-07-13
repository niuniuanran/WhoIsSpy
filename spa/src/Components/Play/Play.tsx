import { useContext, useState, useEffect } from "react"
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext"
import { Button, CircularProgress } from "@material-ui/core"
import WordCard from "./WordCard"
import ContentContainer from "../Shared/ContentContainer"
import { PlayerStates } from "../../Interfaces/Player"
import { VoteCard } from "./VoteCard"
import { useHistory, useParams } from "react-router-dom";
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext"
import InstructionCard from "./InstructionCard"
import fireworks from "fireworks"

export default function Play() {
    const {word, onTalkFinish, onWordRead, instruction, playersInRoom, 
                    nickname, reportResultReceived} = useContext(RoomContext) as RoomContextType
    const { getCurrentLanguage } = useContext(LanguageContext) as LanguageContextType
    const [playerState, setPlayerState] = useState(PlayerStates.IdleState)
    const history = useHistory()
    const { code } = useParams<{code?: string}>()

    useEffect(() => {
        setPlayerState((playersInRoom?.find(p => p.nickname === nickname)?.state) || PlayerStates.IdleState)
    }, [playersInRoom, nickname])

    const onResultReceived = () => {
        reportResultReceived()
        history.push(`/${getCurrentLanguage()}/room/${code}`)
    }

    if (playerState === PlayerStates.WordReadingState) {
        return <ContentContainer>
            <WordCard word={word} onRead={onWordRead} central/>
        </ContentContainer>
    }

    if (playerState === PlayerStates.TalkingState) {
        return <ContentContainer>
            <div>
                <InstructionCard nickname={nickname} instruction={"Your turn to talk"}>
                    <Button variant="contained" size="small" color="primary" onClick={() => {onTalkFinish();}}>I finish</Button>
                </InstructionCard>
                <WordCard word={word} onRead={onWordRead} defaultHide/>
            </div>
        </ContentContainer>
    }

    if (playerState === PlayerStates.ListeningState) {
        return <ContentContainer>
        <div>
            <InstructionCard nickname={playersInRoom?.find(p => p.state === PlayerStates.TalkingState)?.nickname} instruction={instruction}/>
            <WordCard word={word} onRead={onWordRead} defaultHide/>
        </div>
    </ContentContainer>
    }

    if (playerState === PlayerStates.VotingState) {
        return <ContentContainer>
            <VoteCard/>
        </ContentContainer>
    }

    if (playerState === PlayerStates.VotedState) {
        return <ContentContainer>
            <InstructionCard instruction="waiting for other players to vote">
                <CircularProgress/>
            </InstructionCard>
        </ContentContainer>
    }

    if (playerState === PlayerStates.WinState) {
        fireworks({
            x: window.innerWidth,
            y: window.innerHeight,
            colors: ['#cc3333', '#4CAF50', '#81C784']
          })
    }

    if (playerState === PlayerStates.LoseState || playerState === PlayerStates.WinState) {
        return <ContentContainer>
            <InstructionCard instruction={instruction}>
                <div>
                    {playerState === PlayerStates.LoseState && <div>You lose</div>}
                    {playerState === PlayerStates.WinState && <div>You win!!</div>}
                    <Button onClick={() => {onResultReceived();}}>
                        OK
                    </Button>
                </div>
            </InstructionCard>
        </ContentContainer>
    }

    if (playerState === PlayerStates.KilledState) {
        return <ContentContainer>
                <InstructionCard instruction="You are killed" nickname={nickname} killed/>
        </ContentContainer>
    }

    else {
        return <ContentContainer>
            <InstructionCard instruction={`Unexpected state ${playerState}`}/>
        </ContentContainer>
    }
}