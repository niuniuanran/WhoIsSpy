import {Grid, Button} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import {
    useHistory,
    useRouteMatch
  } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    option: {
        height: '5rem',
        width: '15rem',
        fontSize: '1.5rem'
    },
    iconSpan: {
        fontSize: '2rem',
        paddingRight: '1rem'
    }
  }));

interface OptionProps {
    text: string,
    path: string,
    icon: JSX.Element
}

export default function Option({text, path, icon}:OptionProps){
    const classes = useStyles();
    const match = useRouteMatch();
    const history = useHistory();

    return <Grid item xs={12}>
                <Button variant="contained" size="large" color="primary" className={classes.option} onClick={()=>{history.push(`${match.path}/${path}`)}}>
                    <span className={classes.iconSpan}>
                        {icon}
                    </span>
                    <span> 
                        {text}
                    </span>
                </Button>
            </Grid>
}