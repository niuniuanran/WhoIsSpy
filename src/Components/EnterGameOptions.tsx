import {Grid, Button} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import { LanguageContext, LanguageContextType } from "../Contexts/LanguageContext";
import { useContext } from "react";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PostAddIcon from '@material-ui/icons/PostAdd';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    content: {
        margin: theme.spacing(0, 'auto'),
    },
    option: {
        height: '5rem',
        width: '15rem',
        fontSize: '1.5rem'
    }
  }));

export default function EnterGameOptions(){
    const classes = useStyles();
    const {getText} = useContext(LanguageContext) as LanguageContextType

    return <Grid container spacing={5}>
                <Grid item xs={12}>
                    <Button variant="contained" size="large" color="primary" className={classes.option}>
                        <GroupAddIcon style={{ fontSize: '2rem', paddingRight: '1rem' }}/> {getText("createRoom")}
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" size="large" color="primary" className={classes.option}>
                        <PersonAddIcon style={{ fontSize: '2rem', paddingRight: '1rem' }} /> {getText("joinRoom")}
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" size="large" color="primary" className={classes.option}>
                        <PostAddIcon style={{ fontSize: '2rem', paddingRight: '1rem' }} /> {getText("addWords")}
                    </Button>
                </Grid>
            </Grid>
}