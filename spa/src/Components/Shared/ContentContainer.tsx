import {Button, Grid} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useHistory } from "react-router-dom";
import { useContext } from 'react'
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext";

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

interface ContentContainerProps {
    allowBack?: boolean,
    allowExit?: boolean,
    children:JSX.Element,
    onExit?: () => void
}

export default function ContentContainer({children, allowBack, allowExit, onExit}:ContentContainerProps){
    const history = useHistory();
    const classes = useStyles();
    const languageContext = useContext(LanguageContext) as LanguageContextType

    if (allowBack) {
        return <div className={classes.root}>
            <Grid container >
                <Grid item xs={9} md={4} className={classes.content}> 
                    <div className={classes.back}>
                        <Button size="large" aria-label="back" color="primary" variant="text" style={{fontWeight: "bolder"}} onClick={() => history.goBack()}>
                            <ArrowBackIosIcon /> {languageContext && languageContext.getText("back")}
                        </Button>
                    </div>
                    {children}
                </Grid>
            </Grid>
        </div>
    }

    if (allowExit) {
        return <div className={classes.root}>
            <Grid container >
                <Grid item xs={9} md={4} className={classes.content}> 
                    <div className={classes.back}>
                        <Button size="large" aria-label="back" color="primary" variant="text" style={{fontWeight: "bolder"}} 
                            onClick={() => {
                                onExit && onExit()
                                history.push(`/WhoIsSpy/${languageContext?.getCurrentLanguage()}`
                            )}}>
                            <ArrowBackIosIcon /> {languageContext?.getText("exit")}
                        </Button>
                    </div>
                    {children}
                </Grid>
            </Grid>
        </div>
    }

    return <div className={classes.root}>
       <Grid container>
            <Grid item xs={9} md={6} className={classes.content}> 
                {children}
            </Grid>
        </Grid>
    </div>
}