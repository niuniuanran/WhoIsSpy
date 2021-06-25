import { useParams } from "react-router-dom";
import { useContext } from "react"
import { Paper } from "@material-ui/core"
import { PlayerContext, PlayerContextType } from "../../Contexts/PlayerContext";
import NameUserForRoom from "./NameUserForRoom";
import ContentContainer from "../Shared/ContentContainer"

export default function Room(){
    const { nickname } = useContext(PlayerContext) as PlayerContextType
    const { code } = useParams<{code?: string}>()

    if (!nickname) {
        return <NameUserForRoom />
    }
    return <ContentContainer> 
        <Paper>Code: {code}</Paper>
    </ContentContainer>
}