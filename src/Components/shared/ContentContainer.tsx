import {Button} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useHistory } from "react-router-dom";

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
        height: '60%',
        width: '100%',
        margin: theme.spacing(0, 'auto'),
        position: 'absolute',
        top: '50%',
        left: '50%',
        msTransform: 'translateY(-50%) translateX(-50%)',
        transform: 'translateY(-50%) translateX(-50%)',
    },
    back: {
        position: 'absolute',
        left: '-2rem',
        top: '-6rem'
    }
  }));

interface MainLayoutProp {
    allowBack?: boolean
    children:JSX.Element
}

export default function ContentContainer({children, allowBack}:MainLayoutProp){
    const history = useHistory();
    const classes = useStyles();
    return <div className={classes.root}>
        {
            allowBack?( <div>
                    <div className={classes.content}> 
                        <div className={classes.back}>
                            <Button aria-label="back" color="primary" variant="text" size="large" style={{fontWeight: "bolder"}} onClick={() => history.goBack()}>
                                <ArrowBackIosIcon /> Back
                            </Button>
                        </div>
                        {children}
                    </div>
                </div>
                ):( <div >
                    <div className={classes.content}> 
                        {children}
                    </div>
                </div>
            )
        }
        </div>
}