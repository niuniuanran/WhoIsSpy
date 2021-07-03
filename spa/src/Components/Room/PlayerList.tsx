import PlayerAvatar from "../Shared/PlayerAvatar";
import { PlayerContext, PlayerContextType } from "../../Contexts/PlayerContext";
import { useContext } from "react";
import { Typography, Grid } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
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
    const {nickname, playersInRoom, roomPlayerNum} = useContext(PlayerContext) as PlayerContextType
    console.log(playersInRoom)
    const spotNum = (roomPlayerNum || 0) - (playersInRoom?.length || 0)
    console.log(spotNum)
    return <Grid container spacing={1} className={classes.root}>
            {
                playersInRoom && playersInRoom.map((p, i) => (
                    <Grid xs={3} item key={i} className={`${classes.player} ${(i === playersInRoom.length - 1)? classes.new: ""}`}>
                        <PlayerAvatar nickname={p} size="large" className={(p === nickname)? classes.me : classes.others}/>
                        <Typography>
                            {
                                nickname === p ?`${p} (you)`: p
                            }
                        </Typography>
                    </Grid>))}

            {
                spotNum > 0 && [...Array(spotNum)].map((_, i) => (
                    <Grid xs={3} item key={i} className={classes.player}>
                        <Skeleton>
                            <PlayerAvatar nickname="" size="large" />
                        </Skeleton>
                        <Skeleton>
                            <Typography>...</Typography>
                        </Skeleton>
                    </Grid>))}
        </Grid>
}