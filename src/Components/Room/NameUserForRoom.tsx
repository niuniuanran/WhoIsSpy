import {useState, useContext} from "react";
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup, TextField, Button, } from "@material-ui/core";
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext";
import { PlayerContext, PlayerContextType } from "../../Contexts/PlayerContext";
import PlayerAvatar from "../Shared/PlayerAvatar";

interface NameUserProps{
    onOk: () => void 
}

const useStyles = makeStyles((theme) => ({
    formGroup: {
        width: 'fit-content',
        margin: '1rem auto'
    },
    submitButton: {
        margin: '2rem 1rem 1rem 0'
    }
  }));

export default function NameUserForRoom({onOk}: NameUserProps) {
    const classes = useStyles()
    const {getText} = useContext(LanguageContext) as LanguageContextType
    const {nickname, setNickname} = useContext(PlayerContext) as PlayerContextType
    
    return <form>
        <PlayerAvatar nickname={nickname} size="xlarge"/>
        <FormGroup className={classes.formGroup}>
            <TextField
                id="nickname"
                label="Nickname"
                variant="outlined"
                color="primary"
                value={nickname}
                onInput={(e) => {
                    const targetInput = e.target as HTMLInputElement
                    setNickname(targetInput.value)
                }}
            />
        </FormGroup>
        <Button className={classes.submitButton} onClick={onOk}
                size="large" variant="contained" color="primary">
            { getText("createRoom") }
        </Button>
    </form>
}