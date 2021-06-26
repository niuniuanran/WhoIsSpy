import { Grid } from "@material-ui/core";
import { Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Skeleton } from '@material-ui/lab';
import ContentContainer from '../Shared/ContentContainer'
import PersonIcon from '@material-ui/icons/Person';
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext";
import { useContext } from "react";
import RoomEnterInfo from "../../Interfaces/RoomEnterInfo"
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    codeDisplay: {
        [theme.breakpoints.up('md')]: {
            width: "80%",
            margin: '0 auto'
        }
    },
    skeleton: {
        margin: '0 auto'
    }
  }));

export default function RoomInfoEnter({loading, code, capacity, currentPlayerNum, language: roomLanguage}: RoomEnterInfo){
        const { getText } = useContext(LanguageContext) as LanguageContextType
        const classes = useStyles()
        const history = useHistory()

        return <ContentContainer allowBack>
            <div>
                <Grid container style={{marginBottom: '3rem'}} className={classes.codeDisplay}>
                    <Grid item xs={11}>
                        <Typography align="left" paragraph variant="h6" display="block" style={{margin: "1rem 0 1rem 1rem"}}>
                            {getText("roomCode")}: 
                        </Typography>
                    </Grid>
                    {
                        (loading || !code)? [...Array(4)].map((_, i) => (
                            <Grid item xs={3} key={i}>
                                <Skeleton className={classes.skeleton} animation="wave">
                                    <Typography variant="h2">1</Typography>
                                </Skeleton>
                            </Grid>)) : (
                            code.split("").map((c, i) => (
                                <Grid item xs={3} key={i}>
                                    <Typography variant="h2">{c}</Typography>
                                </Grid>)
                        ))
                    }
                </Grid>

                {
                    (currentPlayerNum !== undefined && capacity !== undefined) ? (
                        <div>
                        {
                            [...Array(currentPlayerNum)].map((_, i) => <PersonIcon color="primary" key={i}/>)
                        }
                        {
                            [...Array(capacity - currentPlayerNum)].map((_, i) => <PersonIcon color="disabled" key={i}/>)
                        }
                        </div>
                    ) : (
                        <Skeleton className={classes.skeleton}>
                            {[...Array(7)].map((_, i) => <PersonIcon color="primary" key={i}/>)}
                        </Skeleton>
                    )
                }

                {
                    (roomLanguage !== undefined ) ? (
                        <Typography display="block" variant="caption">
                            {getText(`${roomLanguage}Room`)}
                        </Typography>
                    ) : (
                        <Skeleton className={classes.skeleton}>
                            <Typography>Room in English</Typography>
                        </Skeleton>
                    )
                }
                
                {(loading || !code)? (<Skeleton className={classes.skeleton} animation="wave">
                    {
                        (currentPlayerNum < capacity) ? (<Button size="large" variant="contained" color="primary" style={{marginTop: "2rem"}}>
                            {getText("enterRoom")}
                        </Button>) : (
                        <Button disabled size="large" variant="contained" color="primary" style={{marginTop: "2rem"}}>
                            {getText("roomFull")}
                        </Button>
                        )
                    }
                    </Skeleton>):(
                <Button size="large" variant="contained" color="primary" style={{marginTop: "2rem"}} onClick={() => {history.push(`/${roomLanguage}/room/${code}`)}}>
                    {getText("enterRoom")}
                </Button>)} 
            </div>
        </ContentContainer>
}