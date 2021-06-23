import { Grid } from "@material-ui/core";
import { Typography, Button } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

interface RoomCodeProps {
    loading: boolean,
    code?: string
}

export default function RoomCode({loading, code}:RoomCodeProps){
        return <div>
            <Grid container>
                <Grid item xs={11}>
                    <Typography align="left" paragraph variant="h5" display="block" style={{margin: "1rem 0 2rem 1rem"}}>
                        Room code: 
                    </Typography>
                </Grid>
                {
                    (loading || !code)? [...Array(4)].map(() => (
                    <Grid item xs={3}>
                        <Skeleton variant="circle" width={40} height={40} style={{margin: '0 auto'}} animation="wave"/>
                    </Grid>)) : <div></div>
                }
            </Grid>

            {(loading || !code)? (<Skeleton style={{margin: '4rem auto'}} animation="wave">
                <Button size="large" variant="contained" color="primary" style={{marginTop: "2rem"}}>
                    Enter room
                </Button>
                </Skeleton>):(
            <Button size="large" variant="contained" color="primary" style={{marginTop: "6rem"}}>
                 Enter room
            </Button>)} 
        </div>
}