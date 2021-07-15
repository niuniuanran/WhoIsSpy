import { Alert } from "@material-ui/lab"
import PersonPinIcon from '@material-ui/icons/PersonPin';
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    root: {
        position: "fixed",
        top: "-3.5rem",
        left: 0,
        right: 0,
        width: "100%",
        height: "3em",
    }
}))

interface RoomTopAlertProps{
    alertLine: string
    type?: "success"|"error"|"warning"
}

export default function RoomTopAlert({ alertLine, type }:RoomTopAlertProps) {
    const classes = useStyles()
    return <Alert severity={ type } className={classes.root} iconMapping={{ success: <PersonPinIcon fontSize="inherit" />, error:  <PersonPinIcon fontSize="inherit" />}}>
        { alertLine }
    </Alert>
}