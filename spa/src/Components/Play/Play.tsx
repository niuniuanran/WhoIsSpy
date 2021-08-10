import { useContext, useState, useEffect } from "react"
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext"
import { Button, CircularProgress, Typography } from "@material-ui/core"
import MoodBadOutlinedIcon from '@material-ui/icons/MoodBadOutlined';
import WordCard from "./WordCard"
import ContentContainer from "../Shared/ContentContainer"
import { PlayerStates } from "../../Interfaces/Player"
import { VoteCard } from "./VoteCard"
import { useHistory, useParams } from "react-router-dom";
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext"
import InstructionCard from "./InstructionCard"
import RoomTopAlert from "../Room/RoomTopAlert"
import PlayerList from "../Room/PlayerList";

export default function Play() {
    const {word, onTalkFinish, onWordRead, instruction, playersInRoom, alertLine, alertType, changeWord,
        nickname, reportResultReceived, connected} = useContext(RoomContext) as RoomContextType
    const { getCurrentLanguage, getText } = useContext(LanguageContext) as LanguageContextType
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

    if (!connected) {
        return <ContentContainer>
            <div>
                <InstructionCard instruction={getText("youLookDisconnected")}>
                    <div>
                    <Button variant="contained" size="small" color="primary" onClick={() => {history.push(`/${getCurrentLanguage()}`)}}>
                        {getText("backToHomepage")}
                    </Button>
                    </div>
                </InstructionCard>
            </div>
        </ContentContainer>
    }

    if (playerState === PlayerStates.WordReadingState) {
        return <ContentContainer>
            <div>
                {alertLine && <RoomTopAlert alertLine={alertLine} type={alertType}/>}
                <WordCard word={word} onRead={onWordRead} central/>
                <Button size="small" style={{position: "absolute", bottom: "1rem", left: "1rem"}} onClick={changeWord}>
                    {getText("changeWord")}
                </Button>
            </div>
        </ContentContainer>
    }

    if (playerState === PlayerStates.WordChangingState) {
        let requesterName = (alertLine && alertLine.split(" requested")[0]) || "Someone"
        return <ContentContainer>
            <div>
                {alertLine && <RoomTopAlert alertLine={alertLine} type={alertType}/>}
                <InstructionCard nickname={requesterName} instruction={`Picking new words for you ...`}>
                    <CircularProgress/>
                </InstructionCard>
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
            <InstructionCard instruction={getText("waitingVote")}>
                <CircularProgress/>
            </InstructionCard>
            </div>
        </ContentContainer>
    }

    if (playerState === PlayerStates.LoseState || playerState === PlayerStates.WinState) {
        return <ContentContainer>
            <div>
            {alertLine && <RoomTopAlert alertLine={alertLine} type={alertType}/>}
            <InstructionCard instruction={instruction}>
                <div>
                    {playerState === PlayerStates.LoseState && <Typography variant="h2" color="secondary">
                        You lose
                        <MoodBadOutlinedIcon style={{paddingLeft: "0.5rem"}}/>
                    </Typography>}
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
                 <div>
                {alertLine && <RoomTopAlert alertLine={alertLine} type={alertType}/>}
                <PlayerList/>
                </div>
        </ContentContainer>
    }

    else {
        return <ContentContainer>
            <div>
                {alertLine && <RoomTopAlert alertLine={alertLine} type={alertType}/>}
                <InstructionCard instruction={instruction || `Unexpected state ${playerState}`}>
                    <Button variant="contained" size="small" color="primary" onClick={() => {history.push(`/${getCurrentLanguage()}`)}}>
                        {getText("backToHomepage")}
                    </Button>
                </InstructionCard>
            </div>
        </ContentContainer>
    }
}