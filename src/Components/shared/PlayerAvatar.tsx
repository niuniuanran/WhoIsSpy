import { Avatar, Paper } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useState } from "react";
import { Skeleton } from "@material-ui/lab";
import { useEffect } from "react";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    xlarge:{
        width: theme.spacing(10),
        height: theme.spacing(10),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    small: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
    xsmall: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    }
  }),
);

interface PlayerAvatarProps {
    size:"xlarge"|"large"|"small"|"xsmall"
    nickname?:string,
}

export default function PlayerAvatar({nickname, size}: PlayerAvatarProps){
    const classes = useStyles()
    const [loading, setLoading] = useState(true)
    useEffect(()=>setLoading(true),[nickname])

    return <div>
            <Avatar alt={nickname} src={`https://avatars.dicebear.com/api/bottts/${nickname}.svg`} 
                    className={classes[size]} onLoad={()=>setLoading(false)} style={loading? {display: 'none'}: {display: 'block'}}/>
            <Skeleton variant="circle" className={classes[size]} style={loading? {display: 'block'}: {display: 'none'}}/>
        </div>
}