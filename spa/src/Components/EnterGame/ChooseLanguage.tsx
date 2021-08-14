import OptionButtonBig from '../Shared/OptionButtonBig';
import {Grid} from '@material-ui/core'
import ContentContainer from '../Shared/ContentContainer';

export default function ChooseLanguage(){
    return <ContentContainer>
                <Grid container spacing={5}>
                    <OptionButtonBig path="/WhoIsSpy/en" text="English"/>
                    <OptionButtonBig path="/WhoIsSpy/cn" text="中文"/>
            </Grid>
        </ContentContainer>
}