import { useParams } from "react-router-dom";
import { useContext } from "react"
import { PlayerContext, PlayerContextType } from "../../Contexts/PlayerContext";
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext"
import NamePlayerForRoom from "./NamePlayerForRoom";
import ContentContainer from "../Shared/ContentContainer"
import { Typography, Modal, Paper, Button, CircularProgress } from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles"
import PlayerList from "./PlayerList";
import RoomTopAlert from "./RoomTopAlert"

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
    roomTitle: {
        marginBottom: "1rem"
    },
    readyButton: {
        marginTop: "1rem"
    }
}))

export default function Room(){
    const { nickname, setNickname, reportExitRoom, alertLine, joinFailedMessage, gameWillStart, setGameWillStart,
        setJoinFailedMessage, roomCapacity, playersInRoom, getReady, undoReady } = useContext(PlayerContext) as PlayerContextType
    const { getText } = useContext(LanguageContext) as LanguageContextType
    const { code } = useParams<{code?: string}>()
    const classes = useStyle()
    const onModalClose = () => {
        setJoinFailedMessage && setJoinFailedMessage("")
        setNickname("")
    }

    if (!nickname) {
        return <ContentContainer allowExit>
                <NamePlayerForRoom />
            </ContentContainer>
    }

    if (gameWillStart) {
        setTimeout(() => setGameWillStart(false), 3000)
        return <ContentContainer allowExit onExit={reportExitRoom}> 
            <div>
                <CircularProgress />
                <Typography>
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
                <Typography variant="h4" className={classes.roomTitle}>
                    Room {code}
                </Typography>
                <PlayerList/>
                {
                    playersInRoom && roomCapacity && (roomCapacity === playersInRoom?.length) && (
                        playersInRoom.find(p => p.nickname === nickname)?.ready ?
                    <Button size="large" variant="contained" color="secondary"  className={classes.readyButton} onClick={undoReady}>
                        I'm not ready
                    </Button>:
                     <Button size="large" variant="contained" color="secondary" className={classes.readyButton} onClick={getReady}>
                        I'm ready
                    </Button>)
                }
            </div>
        </ContentContainer>
    </>
}