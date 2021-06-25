import { useParams } from "react-router-dom";
import {useContext} from "react"
import { PlayerContext, PlayerContextType } from "../../Contexts/PlayerContext";
import NameUserForRoom from "./NameUserForRoom";

export default function Room(){
    const { nickname } = useContext(PlayerContext) as PlayerContextType
    const { code } = useParams<{code?: string}>()

    return <div>
        {nickname? <div>
            {code}
        </div>:
        <NameUserForRoom />}
    </div>
}