import { Avatar } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useState } from "react";
import { Skeleton } from "@material-ui/lab";
import { useEffect } from "react";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    xlarge:{
        width: theme.spacing(12),
        height: theme.spacing(12),
        padding: theme.spacing(1)
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        padding: 3
    },
    medium: {
        width: theme.spacing(6),
        height: theme.spacing(6),
        padding: 4
    }, 
    small: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
    xsmall: {
        width: theme.spacing(4),
        height: theme.spacing(4),
        padding: 2
    },
    avatar: {
        backgroundColor: '#343434',
    },
  }),
);

interface PlayerAvatarProps {
    size: "xlarge"|"large"|"medium"|"small"|"xsmall"
    nickname?: string,
    className?: string,
    stayLoading?: boolean
}

export default function PlayerAvatar({nickname, size, className, stayLoading=false}: PlayerAvatarProps){
    const classes = useStyles()
    const [loading, setLoading] = useState(true)
    useEffect(()=>setLoading(true),[nickname])

    return <div className={classes.root}>
            <Avatar alt={nickname} src={`https://avatars.dicebear.com/api/bottts/${nickname}.svg`} 
                    className={`${classes.avatar} ${classes[size]} ${className}`} onLoad={()=>setLoading(false)} style={(loading || stayLoading)? {display: 'none'}: {display: 'block'}}/>
            <Skeleton variant="circle" animation="wave" className={`${classes[size]}`} 
                    style={(loading || stayLoading)? {display: 'block'}: {display: 'none'}}/>
        </div>
}