import {Card, CardContent, Typography, makeStyles} from "@material-ui/core"
import PlayerAvatar from "../Shared/PlayerAvatar"

interface InstructionCardProps {
    nickname?: string
    instruction: string
    button?: JSX.Element
}

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        position: "absolute",
        top: "3rem",
        margin: "0 auto",
        zIndex: 2
    },
    cardContent: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    instruction: {
        marginLeft:"1rem"
    },
    button: {
        marginTop: 3
    }
}))

export default function InstructionCard({nickname, button, instruction}: InstructionCardProps){
    const classes = useStyles()
    return <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
            <PlayerAvatar size="medium" nickname={nickname}/>
            <div className={classes.instruction}>
                <Typography variant="h6">
                    {instruction}
                </Typography>
                <div className={classes.button}>
                    {button}
                </div>
            </div>
         </CardContent>
    </Card>
}