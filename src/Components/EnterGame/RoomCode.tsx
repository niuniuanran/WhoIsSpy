import {useState} from 'react'
import { Grid } from "@material-ui/core";
import { Skeleton } from '@material-ui/lab';

export default function RoomCode(){
    
    return <Grid container>
    <Grid item xs={3}>
        <Skeleton variant="circle" width={40} height={40} style={{margin: '0 auto'}} animation="wave"/>
    </Grid>
    <Grid item xs={3}>
        <Skeleton variant="circle" width={40} height={40} style={{margin: '0 auto'}} animation="wave"/>
    </Grid>
    <Grid item xs={3}>
        <Skeleton variant="circle" width={40} height={40} style={{margin: '0 auto'}} animation="wave"/>
    </Grid>
    <Grid item xs={3}>
        <Skeleton variant="circle" width={40} height={40} style={{margin: '0 auto'}} animation="wave"/>
    </Grid>
</Grid>
}