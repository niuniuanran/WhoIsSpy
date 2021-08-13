import PlayerAvatar from "../Shared/PlayerAvatar";
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext";
import { useContext, useState } from "react";
import { Typography, Box } from "@material-ui/core";
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
        if (arg && arg.startsWith("[")) {
            setSpyList(JSON.parse(arg))
        }
    }, [arg])

    if (spyList.length < 1) {
        return <div/>
    }

    return <div>
        <Typography>
            {spyList.length == 1? getText("spyIs") : getText("spiesAre")}
        </Typography>
            <Box display="flex" justifyContent="center" className={classes.root}>
                {
                    spyList.map((p, i) => (
                        <div key={i} className={classes.player}>
                            <PlayerAvatar nickname={p} size="medium" className={`${(p === nickname)? classes.me : classes.others}`}/>
                            <Typography className={classes.playerName}>
                                {
                                    nickname === p ?`${p} (${getText("you")})`: p
                                }
                            </Typography>
                        </div>))
                }
            </Box>
        </div>
}