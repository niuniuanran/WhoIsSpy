import PlayerAvatar from "../Shared/PlayerAvatar";
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext";
import { useContext, useState } from "react";
import { Typography, Box, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import { LanguageContextType, LanguageContext } from "../../Contexts/LanguageContext";
import { GameAnswerMessage } from "../../Interfaces/Messages";

const useStyles = makeStyles(theme => ({
    list: {
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

export default function GameAnswer() {
    const { arg } = useContext(RoomContext) as RoomContextType
    const [answer, setAnswer] = useState<GameAnswerMessage>({
        spyNames: undefined,
        goodWord: "",
        spyWord: ""
    })
    
    useEffect(() => {
        if (arg) {
            try {
                setAnswer(JSON.parse(arg))
            } catch (error) {
                return
            }
        }
    }, [arg])

    return <div>
        {answer.goodWord && <WordAnswer good word={answer.goodWord}/>}
        {answer.spyWord && <WordAnswer word={answer.spyWord}/>}
        {answer.spyNames && <SpyList spyList={answer.spyNames}/>}
    </div>
}

interface SpyListProps{
    spyList: [string]
}

interface WordAnswerProps{
    good?: boolean
    word: string
}

function WordAnswer({good, word}: WordAnswerProps) {
    const { getText } = useContext(LanguageContext) as LanguageContextType
    return <Box display="flex" justifyContent="center" >
            {good? <Typography>{getText("goodWord")}</Typography> : <Typography>{getText("spyWord")}</Typography>}
            <Paper>
                <Typography>
                    {word? word: "    "}
                </Typography>
            </Paper>
    </Box>
}

function SpyList({spyList}: SpyListProps) {
    const classes = useStyles()
    const { nickname } = useContext(RoomContext) as RoomContextType
    const { getText } = useContext(LanguageContext) as LanguageContextType

    if (spyList.length < 1) {
        return <div/>
    }

    return <div>
        <Typography>
            {spyList.length === 1? getText("spyIs") : getText("spiesAre")}
        </Typography>
            <Box display="flex" justifyContent="center" className={classes.list}>
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