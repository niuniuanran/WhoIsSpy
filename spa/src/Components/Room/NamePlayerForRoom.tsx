import {useState, useContext} from "react";
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup, TextField, Button, } from "@material-ui/core";
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext";
import { PlayerContext, PlayerContextType } from "../../Contexts/PlayerContext";
import PlayerAvatar from "../Shared/PlayerAvatar";

const useStyles = makeStyles((theme) => ({
    formGroup: {
        width: 'fit-content',
        margin: '1rem auto'
    },
    submitButton: {
        margin: '1rem auto'
    }
  }));

export default function NamePlayerForRoom() {
    const classes = useStyles()
    const { getText } = useContext(LanguageContext) as LanguageContextType
    const { setNickname } = useContext(PlayerContext) as PlayerContextType
    const [ tryNickname, setTryNickname ] = useState("")

    return  <form autoComplete="off">
            <PlayerAvatar nickname={tryNickname} size="xlarge"/>
            <FormGroup className={classes.formGroup}>
                <TextField
                    id="nickname"
                    label={getText("youNickname")}
                    variant="outlined"
                    color="primary"
                    value={tryNickname}
                    autoFocus
                    inputProps={{ maxLength: 6, minLength: 1 }}
                    onInput={(e) => {
                        const targetInput = e.target as HTMLInputElement
                        setTryNickname(targetInput.value)
                    }}
                    required
                />
            </FormGroup>
            <Button type="submit" className={classes.submitButton} 
                    onClick={e => {
                        e.preventDefault()
                        setNickname(tryNickname)
                    }}
                    size="large" variant="contained" color="primary">
                { getText("ok") }
        </Button>      
        </form>
}