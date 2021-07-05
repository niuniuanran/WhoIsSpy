import { useParams, useHistory } from "react-router-dom";
import { useContext } from "react"
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext";
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext"
import { Typography, Modal, Paper, Button, CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles"
import NamePlayerForRoom from "./NamePlayerForRoom";
import ContentContainer from "../Shared/ContentContainer"
import PlayerList from "./PlayerList";
import RoomTopAlert from "./RoomTopAlert"
import Play from "../Play/Play"

const useStyle = makeStyles(theme => ({
    modalBody: {
        padding: theme.spacing(2, 4, 3),
        [theme.breakpoints.up('sm')]: {
            width: "320px",
            height:"150px",
            margin: "100px auto"        
        },
        [theme.breakpoints.down('sm')]: {
            width: "240px",
            height: "150px",
            margin: "150px auto"        
        },
    },
    modalButton: {
        marginLeft: "200px"
    },
    marginBottom: {
        marginBottom: "1rem"
    },
    marginTop: {
        marginTop: "1rem"
    }
}))

export default function Room(){
    const { nickname, setNickname, reportExitRoom, alertLine, joinFailedMessage, gameStarted,
        setJoinFailedMessage, roomCapacity, playersInRoom, getReady, undoReady } = useContext(RoomContext) as RoomContextType
    const { getText, getCurrentLanguage } = useContext(LanguageContext) as LanguageContextType
    const { code } = useParams<{code?: string}>()
    const { state } = useParams<{state?: string}>()
    const classes = useStyle()
    const history = useHistory()
    const onModalClose = () => {
        setJoinFailedMessage && setJoinFailedMessage("")
        setNickname("")
    }

    if (state === "play") {
        return <Play/>
    }

    if (!nickname) {
        return <ContentContainer allowExit>
                <NamePlayerForRoom />
            </ContentContainer>
    }

    if (gameStarted) {
        setTimeout(() => {
            history.push(`/${getCurrentLanguage()}/room/${code}/play`)
        }, 3000)
        return <ContentContainer allowExit onExit={reportExitRoom}> 
            <div>
                <CircularProgress size="5rem" className={classes.marginBottom}/>
                <Typography variant="h5" className={classes.marginTop}>
                    Game starting....
                </Typography>         
            </div>
        </ContentContainer>
    }

    return <> 
        <Modal
            open={joinFailedMessage !== ""}
            onClose={onModalClose}
            aria-labelledby="join-room-failed"
            aria-describedby="join-room-failed"
            >
                <Paper className={classes.modalBody}>
                    <h2>
                        {getText("failJoinRoom")}
                    </h2>
                    <p>
                        {joinFailedMessage}
                    </p>
                    <Button onClick={onModalClose} className={classes.modalButton}>
                        {getText("ok")}
                    </Button>
                </Paper>
        </Modal>
        <ContentContainer allowExit onExit={reportExitRoom}> 
            <div>
                {alertLine && <RoomTopAlert alertLine={alertLine}/>}
                <Typography variant="h4" className={classes.marginBottom}>
                    Room {code}
                </Typography>
                <PlayerList/>
                {
                    playersInRoom && roomCapacity && (roomCapacity === playersInRoom?.length) && (
                        playersInRoom.find(p => p.nickname === nickname)?.ready ?
                    <Button size="large" variant="contained" color="secondary"  className={classes.marginTop} onClick={undoReady}>
                        I'm not ready
                    </Button>:
                     <Button size="large" variant="contained" color="secondary" className={classes.marginTop} onClick={getReady}>
                        I'm ready
                    </Button>)
                }
            </div>
        </ContentContainer>
    </>
}