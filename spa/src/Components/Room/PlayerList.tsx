import PlayerAvatar from "../Shared/PlayerAvatar";
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext";
import { useContext } from "react";
import { Typography, Grid, Badge } from "@material-ui/core";
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
    const {nickname, playersInRoom, roomCapacity} = useContext(RoomContext) as RoomContextType
    const spotNum = (roomCapacity || 0) - (playersInRoom?.length || 0)
    return <Grid container spacing={1} className={classes.root}>
            {
                playersInRoom && playersInRoom.sort((a, b) => a.serialNumber - b.serialNumber).map((p, i) => (
                    <Grid xs={3} item key={i} className={`${classes.player} ${(i === playersInRoom.length - 1)? classes.new: ""}`}>
                        <Badge color="secondary" badgeContent={p.ready? "ready": 0}>
                            <PlayerAvatar nickname={p.nickname} size="large" className={(p.nickname === nickname)? classes.me : classes.others}/>
                        </Badge>
                        <Typography>
                            {
                                nickname === p.nickname ?`${p.nickname} (you)`: p.nickname
                            }
                        </Typography>
                    </Grid>))}
            {
                spotNum > 0 && [...Array(spotNum)].map((_, i) => (
                    <Grid xs={3} item key={i} className={classes.player}>
                        <PlayerAvatar size="large" stayLoading/>
                        <Skeleton width={50} height={23.64} style={{margin: "0 auto"}} animation="wave"/>
                    </Grid>))}
        </Grid>
}