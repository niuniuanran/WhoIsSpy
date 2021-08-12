import {useState, useContext, useEffect} from "react";
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup, TextField, Button, } from "@material-ui/core";
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext";
import { RoomContext, RoomContextType } from "../../Contexts/RoomContext";
import PlayerAvatar from "../Shared/PlayerAvatar";
import { useParams } from "react-router-dom";

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
    const { setNickname } = useContext(RoomContext) as RoomContextType
    const [ tryNickname, setTryNickname ] = useState("")
    const { code } = useParams<{code?: string}>()

    useEffect(() => {
        const storedCode = localStorage.getItem("roomCode")
        if(storedCode === code) {
            const nickname = localStorage.getItem("nickname") 
            if (nickname) {
                setTryNickname(nickname);
            }
            localStorage.clear();
        }
    }, [code])

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
                { getText("confirm") }
        </Button>      
        </form>
}