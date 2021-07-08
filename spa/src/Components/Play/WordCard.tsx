import { useState } from "react";
import { Card, CardActionArea, CardActions, CardContent, Typography, Button } from "@material-ui/core"
import { makeStyles } from "@material-ui/core";
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';

interface WordCardProps{
    word: string
    central: boolean
}

const useStyles = makeStyles(theme => ({
    main: {
        width: "100%",
        height: "10rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        position: "absolute",
        top: "3rem",
        margin: "0 auto"
    },
    invisible: {
        width: "6rem",
        height:"4rem"
    },
    wordArea: {
        height: "7rem"
    },
    cardArea: {
        height: "100%"
    },
    sideInvisible:{

    }
}))

export default function WordCard({word, central}: WordCardProps) {
    const [visible, setVisible] = useState(true)
    const classes = useStyles()
    if (visible) {
        return <Card className = {classes.main}>
            <CardActionArea onClick={() => setVisible(false)} className={classes.wordArea}>
                <CardContent>
                <Typography variant="caption" component="h1" style={{textAlign: "left", paddingLeft:"1em"}}>
                        Your word:
                    </Typography>
                    <Typography variant="h4" component="h1">
                        {word}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button color="secondary" onClick={() => setVisible(false)}>
                    Got it 
                </Button>
            </CardActions>
        </Card>
    } 

    return <Card className={central? classes.main : classes.sideInvisible}>
            <CardActionArea onClick={() => setVisible(true)} className={classes.cardArea}>
                <VisibilityIcon style={{fontSize: (central? "4rem":"2rem")}}/>
            </CardActionArea>
        </Card>
}