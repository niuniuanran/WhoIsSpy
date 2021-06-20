import {Grid, Button} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import { LanguageContext, LanguageContextType } from "../Contexts/LanguageContext";
import { useContext } from "react";

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    content: {
        margin: theme.spacing(0, 'auto'),
    },
    option: {
        height: '5rem',
        width: '12rem',
        fontSize: '1.5rem'
    }
  }));

export default function EnterGameOptions(){
    const classes = useStyles();
    const {getText} = useContext(LanguageContext) as LanguageContextType

    return <Grid container spacing={5}>
                <Grid item xs={12}>
                    <Button variant="contained" size="large" color="primary" className={classes.option}>
                        {getText("createRoom")}
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" size="large" color="primary" className={classes.option}>
                        {getText("joinRoom")}
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" size="large" color="primary" className={classes.option}>
                        One
                    </Button>
                </Grid>
            </Grid>
}