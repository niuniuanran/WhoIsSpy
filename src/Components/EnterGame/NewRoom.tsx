import {useState, useContext} from "react";
import { makeStyles } from '@material-ui/core/styles';
import ContentContainer from "../Shared/ContentContainer";
import { FormGroup, FormControlLabel, Checkbox, Button } from "@material-ui/core";
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext";
import NumSettingSliders from "./NumSettingSliders";

interface RoomSettings {
    numPlayer: number,
    numSpy: number,
    randomBlank: boolean,
    eighteenPlus: boolean,
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

export default function NewRoom(){
    const classes = useStyles();
    const {getText} = useContext(LanguageContext) as LanguageContextType
    const [roomSettings, setRoomSettings] = useState<RoomSettings>({
        numPlayer: 6,
        numSpy: 1,
        randomBlank: true,
        eighteenPlus: false
    })

    return <ContentContainer allowBack>
            <form>
                <NumSettingSliders/>    
                <FormGroup className={classes.formGroup}>
                    <FormControlLabel
                        control={<Checkbox checked={roomSettings.randomBlank} 
                                        onChange={ e => setRoomSettings(roomSettings => ({...roomSettings, randomBlank: e.target.checked}))} 
                                        name="random-blank"
                                        color="primary" />}
                        label={getText("randomBlank")}
                    />
                    <FormControlLabel
                        control={<Checkbox checked={roomSettings.eighteenPlus} 
                                        onChange={ e => setRoomSettings(roomSettings => ({...roomSettings, eighteenPlus: e.target.checked}))} 
                                        name="eighteen-plus"
                                        color="secondary" />}
                        label={getText("eighteenPlus")}
                    />
                </FormGroup>
                <Button className={classes.submitButton} size="large" variant="contained" color="primary">
                    Create room
                </Button>
                </form>
            </ContentContainer>

}