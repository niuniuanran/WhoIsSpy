import {Grid, Button} from "@material-ui/core"
import { makeStyles } from '@material-ui/core/styles';
import { LanguageContext, LanguageContextType } from "../Contexts/LanguageContext";
import { useContext } from "react";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PostAddIcon from '@material-ui/icons/PostAdd';
import Option from "./shared/Option";
import {
    useHistory,
    useRouteMatch
  } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    content: {
        margin: theme.spacing(0, 'auto'),
    }
  }));

export default function EnterGameOptions(){
    const classes = useStyles();
    const {getText} = useContext(LanguageContext) as LanguageContextType
    const match = useRouteMatch();

    return <Grid container spacing={5}>
                <Option text={getText("createRoom")} icon={<GroupAddIcon/>} path={`${match.path}/create-room`}/>
                <Option text={getText("joinRoom")} icon={<PersonAddIcon/>} path={`${match.path}/join-room`}/>
                <Option text={getText("addWords")} icon={<PostAddIcon/>} path={`${match.path}/add-words`}/>
            </Grid>
}