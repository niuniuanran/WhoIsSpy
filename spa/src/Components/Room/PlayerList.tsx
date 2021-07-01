import PlayerAvatar from "../Shared/PlayerAvatar";
import { PlayerContext, PlayerContextType } from "../../Contexts/PlayerContext";
import { useContext } from "react";
import { Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: '1rem'
    },
    me: {
        backgroundColor: '#898989'
    },
    others: {
        backgroundColor: '#343434'
    },
    new: {
        backgroundColor: '#898989',
        width: 'fit-content'
    },
    player: {
        backgroundColor: 'inherit',
        width: 'fit-content',
        borderRadius: '5px'
    }
}))

export default function PlayerList() {
    const classes = useStyles()
    const {nickname, playersInRoom} = useContext(PlayerContext) as PlayerContextType

    return <Grid container spacing={1} className={classes.root}>
            {playersInRoom && playersInRoom.map((p, i) => (
                <Grid xs={3} item key={i} className={`${classes.player} ${(i === playersInRoom.length - 1)? classes.new: ""}`}>
                    <PlayerAvatar nickname={p} size="large" className={(p === nickname)? classes.me : classes.others}/>
                    <Typography>
                        {p}
                    </Typography>
                </Grid>)) }
        </Grid>
}