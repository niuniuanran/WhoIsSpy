import PlayerAvatar from "../Shared/PlayerAvatar";
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext";
import { useContext, useState } from "react";
import { Typography, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import { LanguageContextType, LanguageContext } from "../../Contexts/LanguageContext";

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
    player: {
        backgroundColor: 'inherit',
        width: 'fit-content',
        borderRadius: '5px'
    },
    playerName: {
        textAlign: "center"
    }
}))

export default function SpyList() {
    const classes = useStyles()
    const {arg, nickname} = useContext(RoomContext) as RoomContextType
    const { getText } = useContext(LanguageContext) as LanguageContextType
    const [spyList, setSpyList] = useState([])

    useEffect(() => {
        console.log(arg)
        arg && setSpyList(JSON.parse(arg))
    }, [arg])

    if (spyList.length < 1) {
        return <div/>
    }

    return <Grid container spacing={1} className={classes.root}>
            {
                spyList && spyList.map((p, i) => (
                    <Grid xs={3} item key={i} className={classes.player}>
                        <PlayerAvatar nickname={p} size="large" className={`${(p === nickname)? classes.me : classes.others}`}/>
                        <Typography className={classes.playerName}>
                            {
                                nickname === p ?`${p} (${getText("you")})`: p
                            }
                        </Typography>
                    </Grid>))
            }
        </Grid>
}