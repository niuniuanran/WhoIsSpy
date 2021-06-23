import {Grid} from "@material-ui/core"
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext";
import { useContext } from "react";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import PostAddIcon from '@material-ui/icons/PostAdd';
import OptionButtonBig from "../Shared/OptionButtonBig";
import ContentContainer from "../Shared/ContentContainer";
import { useRouteMatch } from "react-router-dom";

export default function EnterGameOptions(){
    const {getText} = useContext(LanguageContext) as LanguageContextType
    const match = useRouteMatch();

    return <ContentContainer allowBack>
                <Grid container spacing={5}>
                    <OptionButtonBig text={getText("newRoom")} icon={<GroupAddIcon/>} path={`${match.path}/new-room`}/>
                    <OptionButtonBig text={getText("joinRoom")} icon={<PersonAddIcon/>} path={`${match.path}/join-room`}/>
                    <OptionButtonBig text={getText("addWords")} icon={<PostAddIcon/>} path={`${match.path}/contribute`}/>
                </Grid>
            </ContentContainer>
}