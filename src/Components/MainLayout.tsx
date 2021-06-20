import {Grid, Paper} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      textAlign: 'center',
      margin: 0,
      padding: 0,
      width: '100vw',
      height: '100vh',
      color: theme.palette.text.secondary,
      backgroundColor: '#121212',
    },
    content: {
        margin: theme.spacing(0, 'auto'),
    },
  }));

interface MainLayoutProp {
    children:JSX.Element
}

export default function MainLayout({children}:MainLayoutProp){
    const classes = useStyles();

    return <div className={classes.root}>
    <Grid container>
      <Grid item xs={9} md={6} className={classes.content}>
          {children}
      </Grid>
    </Grid>
  </div>
}