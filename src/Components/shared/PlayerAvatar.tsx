import { Avatar } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

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
    nickname?:string
}

export default function PlayerAvatar({nickname, size}: PlayerAvatarProps){
    const classes = useStyles()
    return <Avatar alt={nickname} src={`https://avatars.dicebear.com/api/bottts/${nickname}.svg`} 
                    className={classes[size]}/>
}