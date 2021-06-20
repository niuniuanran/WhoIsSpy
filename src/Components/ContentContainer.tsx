import {Grid, Box} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      textAlign: 'center',
      margin: 0,
      padding: '3rem',
      width: '100vw',
      height: '100vh',
      boxSizing: 'border-box',
      color: theme.palette.text.secondary,
      backgroundColor: '#121212',
    },
    content: {
        margin: theme.spacing(0, 'auto'),
        position: 'absolute',
        top: '50%',
        left: '50%',
        msTransform: 'translateY(-50%) translateX(-50%)',
        transform: 'translateY(-50%) translateX(-50%)',
    },
  }));

interface MainLayoutProp {
    children:JSX.Element
}

export default function ContentContainer({children}:MainLayoutProp){
    const classes = useStyles();

    return <div className={classes.root}>
        <Grid container >
            <Grid item xs={9} md={6} className={classes.content}> 
                {children}
            </Grid>
        </Grid>
    </div>
}