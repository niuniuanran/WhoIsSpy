import { useContext, useState, useEffect } from "react"
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext"
import { makeStyles, Card, Typography, CardContent, Button, CircularProgress } from "@material-ui/core"
import PlayerList from "../Room/PlayerList"
import WordCard from "./WordCard"
import ContentContainer from "../Shared/ContentContainer"
import { PlayerStates } from "../../Interfaces/Player"
import { VoteCard } from "./VoteCard"
import { useHistory, useParams } from "react-router-dom";
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext"
import InstructionCard from "./InstructionCard"

const useStyles = makeStyles((theme) => ({
    players: {
        marginTop: "4rem"
    },
    instruction: {
        maxWidth: "100%",
        width: "30rem",
        margin: "0 auto"
    }
}))

export default function Play() {
    const {word, onTalkFinish, onWordRead, instruction, playersInRoom, 
                    nickname, reportResultReceived} = useContext(RoomContext) as RoomContextType
    const { getCurrentLanguage } = useContext(LanguageContext) as LanguageContextType
    const [playerState, setPlayerState] = useState(PlayerStates.IdleState)
    const history = useHistory()
    const { code } = useParams<{code?: string}>()
    const classes = useStyles()

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

    return <ContentContainer>
        <div>
            <Card className={classes.instruction}>
                <CardContent>
                    <Typography variant="h5">
                        {instruction}
                    </Typography>
                </CardContent>
            </Card>
            { (playerState === PlayerStates.WinState || playerState === PlayerStates.LoseState) && <button onClick={() => {onResultReceived();}}>
                OK
            </button>}
            <WordCard word={word} onRead={onWordRead} defaultHide/>
            <div className={classes.players}>
                <PlayerList/>
            </div>
        </div>
    </ContentContainer>
}