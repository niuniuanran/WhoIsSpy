import { Grid } from "@material-ui/core";
import { Skeleton } from '@material-ui/lab';

interface RoomCodeProps {
    loading: boolean,
    code?: string
}

export default function RoomCode({loading, code}:RoomCodeProps){
    if (loading || !code) {
        return <Grid container>
            {
            [...Array(4)].map(() => (
             <Grid item xs={3}>
                 <Skeleton variant="circle" width={40} height={40} style={{margin: '0 auto'}} animation="wave"/>
             </Grid>))
            }
           
        </Grid>
    }
    return <div></div>
    
}