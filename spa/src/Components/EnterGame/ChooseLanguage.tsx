import OptionButtonBig from '../Shared/OptionButtonBig';
import {Grid} from '@material-ui/core'
import ContentContainer from '../Shared/ContentContainer';

export default function ChooseLanguage(){
    return <ContentContainer>
                <Grid container spacing={5}>
                    <OptionButtonBig path="/en" text="English"/>
                    <OptionButtonBig path="/cn" text="中文"/>
            </Grid>
        </ContentContainer>
}