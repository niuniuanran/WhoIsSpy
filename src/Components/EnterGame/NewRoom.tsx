import {useState, useContext} from "react";
import { makeStyles } from '@material-ui/core/styles';
import ContentContainer from "../Shared/ContentContainer";
import { FormGroup, FormControlLabel, Checkbox, Button } from "@material-ui/core";
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext";
import NumSettingSliders from "./NumSettingSliders";
import RoomInfoEnter from "./RoomInfoEnter";
import stubCreateRoomApi from "../../stub/StubCreateRoomApi"
import RoomEnterInfo from "../../Interfaces/RoomEnterInfo";

export interface RoomSettings {
    numPlayer: number,
    numSpy: number,
    randomBlank: boolean,
    eighteenPlus: boolean,
    language: string
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
    const {getText, getCurrentLanguage} = useContext(LanguageContext) as LanguageContextType
    const [roomSettings, setRoomSettings] = useState<RoomSettings>({
        numPlayer: 6,
        numSpy: 1,
        randomBlank: true,
        eighteenPlus: false,
        language: getCurrentLanguage()
    })
    const [createdRoomInfo, setCreatedRoomInfo] = useState<RoomEnterInfo>({
        loading: false,
        code: undefined,
        capacity: 5,
        currentPlayerNum: 0,
        language: getCurrentLanguage()
    })
    const onClickCreate = () => {
        setCreatedRoomInfo((createdRoomInfo) => ({...createdRoomInfo, loading: true}))
        setTimeout(()=> {
            setCreatedRoomInfo(() => stubCreateRoomApi(roomSettings))
        }, 2000)
    }

    if (createdRoomInfo.loading || createdRoomInfo.code !== undefined) {
        return <RoomInfoEnter {...createdRoomInfo}/>
    }

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
                <Button className={classes.submitButton} onClick={onClickCreate}
                        size="large" variant="contained" color="primary">
                    { getText("createRoom") }
                </Button>
            </form>
        </ContentContainer>
}