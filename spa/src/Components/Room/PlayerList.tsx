import PlayerAvatar from "../Shared/PlayerAvatar";
import { PlayerContext, PlayerContextType } from "../../Contexts/PlayerContext";
import { useContext } from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    me: {
        backgroundColor: '#555555'
    },
    others: {
        backgroundColor: '#343434'
    },
    root: {
        display: "flex",
        flexDirection: "column"
    }
}))

export default function PlayerList() {
    const classes = useStyles()
    const {nickname, playersInRoom} = useContext(PlayerContext) as PlayerContextType

    return <div>
            {playersInRoom && playersInRoom.map((p, i) => (
                <div key={i}>
                    <div className={classes.root}>
                        <PlayerAvatar nickname={p} size="large" className={(p==nickname)? classes.me : classes.others}/>
                        <Typography>
                            {p}
                        </Typography>
                    </div>
                </div>)) }
        </div>
}