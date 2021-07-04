import { useParams } from "react-router-dom";
import { useContext } from "react"
import { PlayerContext, PlayerContextType } from "../../Contexts/PlayerContext";
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext"
import NamePlayerForRoom from "./NamePlayerForRoom";
import ContentContainer from "../Shared/ContentContainer"
import { Typography, Modal, Paper, Button } from "@material-ui/core";
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
        marginBottom: "2rem"
    }
}))

export default function Room(){
    const { nickname, setNickname, reportExitRoom, alertLine, joinFailedMessage, setJoinFailedMessage } = useContext(PlayerContext) as PlayerContextType
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
            </div>
        </ContentContainer>
    </>
}