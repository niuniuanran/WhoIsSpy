import {Card, CardContent, Typography, makeStyles} from "@material-ui/core"
import PlayerAvatar from "../Shared/PlayerAvatar"

interface InstructionCardProps {
    nickname?: string
    instruction: string
    children?: JSX.Element
    killed?: boolean
}

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        position: "absolute",
        top: "0rem",
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
    children: {
        marginTop: 3
    },
    killed: {  
        filter: "grayscale(100%)"
    }
}))

export default function InstructionCard({nickname, instruction, children, killed}: InstructionCardProps){
    const classes = useStyles()
    return <Card className={classes.root}>
        <CardContent className={classes.cardContent}>
            {nickname && <PlayerAvatar size="medium" nickname={nickname} className={(killed && classes.killed) || ""}/>}
            <div className={classes.instruction}>
                <Typography variant="h6">
                    {instruction}
                </Typography>
                {
                    children &&  <div className={classes.children}>
                        {children}
                    </div>
                }
            </div>
         </CardContent>
    </Card>
}