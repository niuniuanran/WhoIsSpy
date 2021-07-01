import { useParams } from "react-router-dom";
import { useContext } from "react"
import { PlayerContext, PlayerContextType } from "../../Contexts/PlayerContext";
import NameUserForRoom from "./NameUserForRoom";
import ContentContainer from "../Shared/ContentContainer"
import { Typography } from "@material-ui/core";
import PlayerList from "./PlayerList";
import RoomTopAlert from "./RoomTopAlert"

export default function Room(){
    const { nickname, reportExitRoom, alertLine } = useContext(PlayerContext) as PlayerContextType
    const { code } = useParams<{code?: string}>()

    if (!nickname) {
        return <ContentContainer allowExit>
            <NameUserForRoom />
        </ContentContainer>
    }
    return <ContentContainer allowExit onExit={reportExitRoom}> 
        <div>
            {alertLine && <RoomTopAlert alertLine={alertLine}/>}
            <Typography variant="h4">
                Room {code}
            </Typography>
            <PlayerList/>
        </div>
    </ContentContainer>
}