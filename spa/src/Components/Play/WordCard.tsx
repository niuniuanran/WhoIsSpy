import { useState } from "react";
import { Card, CardActionArea, CardActions, CardContent, Typography, Button } from "@material-ui/core"
import { makeStyles } from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility';

interface WordCardProps{
    word: string
    central: boolean
    onRead: () => void
}

const useStyles = makeStyles((theme) => ({
    main: {
        width: "100%",
        height: "10rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        position: "absolute",
        top: "3rem",
        margin: "0 auto",
        zIndex: 100
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
    side:{
        width: "5rem",
        height: "3rem",
        position: "absolute",
        bottom: "0",
        right: "0"
    }
}))

export default function WordCard({word, central, onRead}: WordCardProps) {
    const [visible, setVisible] = useState(true)
    const classes = useStyles()
    const onClickGotIt = () => {
        setVisible(false)
        onRead()
    }

    if (visible) {
        return <Card className = {classes.main}>
            <CardActionArea onClick={onClickGotIt} className={classes.wordArea}>
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
                <Button color="secondary" onClick={onClickGotIt}>
                    Got it 
                </Button>
            </CardActions>
        </Card>
    } 

    return <Card className={central? classes.main : classes.side}>
            <CardActionArea onClick={() => setVisible(true)} className={classes.cardArea}>
                <VisibilityIcon style={{fontSize: (central? "4rem":"2rem")}}/>
            </CardActionArea>
        </Card>
}