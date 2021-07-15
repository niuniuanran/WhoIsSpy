import { useContext, useState, useEffect } from "react"
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext"
import { Button, CircularProgress, Typography } from "@material-ui/core"
import WordCard from "./WordCard"
import ContentContainer from "../Shared/ContentContainer"
import { PlayerStates } from "../../Interfaces/Player"
import { VoteCard } from "./VoteCard"
import { useHistory, useParams } from "react-router-dom";
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext"
import InstructionCard from "./InstructionCard"
import fireworks from "fireworks"
import RoomTopAlert from "../Room/RoomTopAlert"

export default function Play() {
    const {word, onTalkFinish, onWordRead, instruction, playersInRoom, alertLine, alertType,
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
            <div>
                {alertLine && <RoomTopAlert alertLine={alertLine} type={alertType}/>}
                <WordCard word={word} onRead={onWordRead} central/>
            </div>
        </ContentContainer>
    }

    if (playerState === PlayerStates.TalkingState) {
        return <ContentContainer>
            <div>
                {alertLine && <RoomTopAlert alertLine={alertLine} type={alertType}/>}
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
                {alertLine && <RoomTopAlert alertLine={alertLine} type={alertType}/>}
                <InstructionCard nickname={playersInRoom?.find(p => p.state === PlayerStates.TalkingState)?.nickname} instruction={instruction}/>
                <WordCard word={word} onRead={onWordRead} defaultHide/>
            </div>
        </ContentContainer>
    }

    if (playerState === PlayerStates.VotingState) {
        return <ContentContainer>
            <div>
                {alertLine && <RoomTopAlert alertLine={alertLine} type={alertType}/>}
                <VoteCard/>
            </div>
        </ContentContainer>
    }

    if (playerState === PlayerStates.VotedState) {
        return <ContentContainer>
            <div>
            {alertLine && <RoomTopAlert alertLine={alertLine} type={alertType}/>}
            <InstructionCard instruction="Waiting for other players to vote">
                <CircularProgress/>
            </InstructionCard>
            </div>
        </ContentContainer>
    }

    if (playerState === PlayerStates.WinState) {
        setInterval(() =>{
            fireworks({
                x: window.innerWidth/2,
                y: window.innerHeight/2,
                colors: ['#cc3333', '#4CAF50', '#81C784']
              })
        }, 2000)
    }

    if (playerState === PlayerStates.LoseState || playerState === PlayerStates.WinState) {
        return <ContentContainer>
            <div>
            {alertLine && <RoomTopAlert alertLine={alertLine} type={alertType}/>}
            <InstructionCard instruction={instruction}>
                <div>
                    {playerState === PlayerStates.LoseState && <Typography variant="h3">You lose</Typography>}
                    {playerState === PlayerStates.WinState && <Typography variant="h2">You win!!</Typography>}
                    <Button onClick={() => {onResultReceived();}} variant="contained" size="small" color="primary">
                        OK
                    </Button>
                </div>
            </InstructionCard>
            </div>
        </ContentContainer>
    }

    if (playerState === PlayerStates.KilledState) {
        return <ContentContainer>
                <InstructionCard instruction="You are killed" nickname={nickname} killed/>
        </ContentContainer>
    }

    else {
        return <ContentContainer>
            <div>
                {alertLine && <RoomTopAlert alertLine={alertLine} type={alertType}/>}
                <InstructionCard instruction={`Unexpected state ${playerState}`}>
                    <Button variant="contained" size="small" color="primary" onClick={() => {history.push(`/${getCurrentLanguage()}`)}}>
                        Back to homepage
                    </Button>
                </InstructionCard>
            </div>
        </ContentContainer>
    }
}