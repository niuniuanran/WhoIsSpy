import { Grid } from "@material-ui/core";
import { Typography, Button } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import ContentContainer from '../Shared/ContentContainer'
import PersonIcon from '@material-ui/icons/Person';
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext";
import { useContext } from "react";

interface RoomInfoEnterProps {
    loading: boolean,
    code?: string,
    capacity: number,
    currentPlayerNum: number,
    language?: string
}

export default function RoomInfoEnter({loading, code, capacity, currentPlayerNum, language}:RoomInfoEnterProps){
        const {getText, getCurrentLanguage} = useContext(LanguageContext) as LanguageContextType
        return <ContentContainer allowBack>
            <div>
                <Grid container style={{marginBottom: '4rem'}}>
                    <Grid item xs={11}>
                        <Typography align="left" paragraph variant="h6" display="block" style={{margin: "1rem 0 1rem 1rem"}}>
                            {getText("roomCode")}: 
                        </Typography>
                    </Grid>
                    {
                        (loading || !code)? [...Array(4)].map(() => (
                        <Grid item xs={3}>
                            <Skeleton style={{margin: '0 auto'}} animation="wave">
                                <Typography variant="h2">1</Typography>
                            </Skeleton>
                        </Grid>)) : <div></div>
                    }
                </Grid>

                {
                    (currentPlayerNum !== undefined && capacity !== undefined) ? (
                        <div>
                        {
                            [...Array(currentPlayerNum)].map(() => <PersonIcon color="primary"/>)
                        }
                        {
                            [...Array(capacity - currentPlayerNum)].map(() => <PersonIcon color="disabled"/>)
                        }
                        </div>
                    ) : (
                        <Skeleton style={{margin: '0 auto'}}>
                            {[...Array(7)].map(() => <PersonIcon color="primary"/>)}
                        </Skeleton>
                    )
                }

                {
                    (language !== undefined ) ? (
                        <Typography variant="caption">{getText(`${getCurrentLanguage()}Room`)}</Typography>
                    ) : (
                        <Skeleton style={{margin: '0 auto'}}>
                            <Typography>Room in English</Typography>
                        </Skeleton>
                    )
                }
                
                {(loading || !code)? (<Skeleton style={{margin: '0 auto'}} animation="wave">
                    <Button size="large" variant="contained" color="primary" style={{marginTop: "2rem"}}>
                        Enter room
                    </Button>
                    </Skeleton>):(
                <Button size="large" variant="contained" color="primary" style={{marginTop: "6rem"}}>
                    Enter room
                </Button>)} 
            </div>
        </ContentContainer>
}