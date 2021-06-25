import { useParams } from "react-router-dom";
import { useContext } from "react"
import { Paper } from "@material-ui/core"
import { PlayerContext, PlayerContextType } from "../../Contexts/PlayerContext";
import NameUserForRoom from "./NameUserForRoom";
import ContentContainer from "../Shared/ContentContainer"
import PlayerAvatar from "../Shared/PlayerAvatar";

export default function Room(){
    const { nickname } = useContext(PlayerContext) as PlayerContextType
    const { code } = useParams<{code?: string}>()

    if (!nickname) {
        return <ContentContainer allowExit>
            <NameUserForRoom />
        </ContentContainer>
    }
    return <ContentContainer allowExit> 
        <div>   
            <PlayerAvatar size="large" nickname="anran"/>
            <Paper>Anran's turn to talk</Paper>
        </div>
    </ContentContainer>
}