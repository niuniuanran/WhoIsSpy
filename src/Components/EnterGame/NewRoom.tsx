import {useState, useContext} from "react";
import ContentContainer from "../Shared/ContentContainer";
import { FormGroup, Typography, FormControlLabel, Checkbox } from "@material-ui/core";
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext";
import NumSettingSliders from "./NumSettingSliders";

interface RoomSettings {
    numPlayer: number,
    numSpy: number,
    randomBlank: boolean,
    eighteenPlus: boolean,
}

export default function NewRoom(){
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
                <FormGroup row>
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
                </form>
            </ContentContainer>
    
}