import {Grid, IconButton, Button} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      textAlign: 'center',
      margin: 0,
      padding: '2rem',
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
    allowBack?: boolean
    children:JSX.Element
}

export default function ContentContainer({children, allowBack}:MainLayoutProp){
    const classes = useStyles();
        return <div className={classes.root}>
            {
                allowBack?(
                    <Grid container >
                        <Grid item xs={9} md={6} className={classes.content}> 
                            {children}
                        </Grid>
                    </Grid>):(
                    <Grid container spacing={0} direction="column">
                        <Grid item xs={1}>
                        <Button aria-label="back" color="primary" variant="text" size="large" style={{fontWeight: "bolder"}}>
                            <ArrowBackIosIcon /> Back
                        </Button>
                        </Grid>
                        <Grid container item xs={9} md={6} className={classes.content}> 
                            {children}
                        </Grid>
                    </Grid>
                )
            }
        </div>

    
}