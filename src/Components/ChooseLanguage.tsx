import Option from './shared/Option';
import {Grid} from '@material-ui/core'
import ContentContainer from './ContentContainer';

export default function ChooseLanguage(){
    return <ContentContainer>
                <Grid container spacing={5}>
                    <Option path="/en" text="English"/>
                    <Option path="/cn" text="中文"/>
            </Grid>
        </ContentContainer>
}