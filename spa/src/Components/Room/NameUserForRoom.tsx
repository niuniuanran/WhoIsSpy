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

export default function NameUserForRoom() {
    const classes = useStyles()
    const { getText } = useContext(LanguageContext) as LanguageContextType
    const { setNickname } = useContext(PlayerContext) as PlayerContextType
    const [ tryNickname, setTryNickname ] = useState("")

    return  <form>
            <PlayerAvatar nickname={tryNickname} size="xlarge"/>
            <FormGroup className={classes.formGroup}>
                <TextField
                    id="nickname"
                    label={getText("youNickname")}
                    variant="outlined"
                    color="primary"
                    value={tryNickname}
                    autoFocus
                    onInput={(e) => {
                        const targetInput = e.target as HTMLInputElement
                        setTryNickname(targetInput.value)
                    }}
                />
            </FormGroup>
            <Button className={classes.submitButton} onClick={() => setNickname(tryNickname)}
                    size="large" variant="contained" color="primary">
                { getText("ok") }
        </Button>      
        </form>
}