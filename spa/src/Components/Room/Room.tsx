import { useParams } from "react-router-dom";
import { useContext } from "react"
import { PlayerContext, PlayerContextType } from "../../Contexts/PlayerContext";
import NameUserForRoom from "./NameUserForRoom";
import ContentContainer from "../Shared/ContentContainer"
import { Typography, Modal, Paper } from "@material-ui/core";
import PlayerList from "./PlayerList";
import RoomTopAlert from "./RoomTopAlert"

export default function Room(){
    const { nickname, setNickname, reportExitRoom, alertLine, joinFailedMessage, setJoinFailedMessage } = useContext(PlayerContext) as PlayerContextType
    const { code } = useParams<{code?: string}>()
    const onModalClose = () => {
        setJoinFailedMessage && setJoinFailedMessage("")
        setNickname("")
    }

    if (!nickname) {
        return <ContentContainer allowExit>
                <NameUserForRoom />
            </ContentContainer>
    }

    return <> 
        <Modal
            open={joinFailedMessage !== ""}
            onClose={onModalClose}
            aria-labelledby="join-room-failed"
            aria-describedby="join-room-failed"
            >
                <Paper>
                    {joinFailedMessage}
                </Paper>
        </Modal>
        <ContentContainer allowExit onExit={reportExitRoom}> 
            <div>
                {alertLine && <RoomTopAlert alertLine={alertLine}/>}
                <Typography variant="h4">
                    Room {code}
                </Typography>
                <PlayerList/>
            </div>
        </ContentContainer>
    </>
}