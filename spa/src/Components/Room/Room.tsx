import { useParams } from "react-router-dom";
import { useContext } from "react"
import { Paper } from "@material-ui/core"
import { PlayerContext, PlayerContextType } from "../../Contexts/PlayerContext";
import NameUserForRoom from "./NameUserForRoom";
import ContentContainer from "../Shared/ContentContainer"
import PlayerAvatar from "../Shared/PlayerAvatar";

export default function Room(){
    const { nickname, reportExitRoom, playersInRoom } = useContext(PlayerContext) as PlayerContextType
    const { code } = useParams<{code?: string}>()

    if (!nickname) {
        return <ContentContainer allowExit>
            <NameUserForRoom />
        </ContentContainer>
    }
    return <ContentContainer allowExit onExit={reportExitRoom}> 
        <div>   
            {code}
            {playersInRoom && playersInRoom.map((p, i) => <div key={i}>
                <PlayerAvatar nickname={p} size="large"/>
                </div>) }
        </div>
    </ContentContainer>
}