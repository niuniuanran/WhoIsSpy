import { Alert } from "@material-ui/lab"
import PersonPinIcon from '@material-ui/icons/PersonPin';
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    root: {
        position: "fixed",
        top: "-3rem",
        left: 0,
        right: 0,
        width: "100vw",
        height: "3em",
    }
}))

interface RoomTopAlertProps{
    alertLine: string
}

export default function RoomTopAlert({ alertLine }:RoomTopAlertProps) {
    const classes = useStyles()
    return <Alert className={classes.root} iconMapping={{ success: <PersonPinIcon fontSize="inherit" /> }}>
        { alertLine }
    </Alert>
}