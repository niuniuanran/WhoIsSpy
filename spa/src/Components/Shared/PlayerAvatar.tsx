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
    },
    small: {
        width: theme.spacing(5),
        height: theme.spacing(5),
    },
    xsmall: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    avatar: {
        backgroundColor: '#343434',
    },
  }),
);

interface PlayerAvatarProps {
    size: "xlarge"|"large"|"small"|"xsmall"
    nickname?: string,
    className?: string
}

export default function PlayerAvatar({nickname, size, className}: PlayerAvatarProps){
    const classes = useStyles()
    const [loading, setLoading] = useState(true)
    useEffect(()=>setLoading(true),[nickname])

    return <div className={classes.root}>
            <Avatar alt={nickname} src={`https://avatars.dicebear.com/api/bottts/${nickname}.svg`} 
                    className={`${classes.avatar} ${classes[size]} ${className}`} onLoad={()=>setLoading(false)} style={loading? {display: 'none'}: {display: 'block'}}/>
            <Skeleton variant="circle" animation="wave" className={`${classes[size]}`} 
                    style={loading? {display: 'block'}: {display: 'none'}}/>
        </div>
}