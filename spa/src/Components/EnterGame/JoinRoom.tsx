import ContentContainer from "../Shared/ContentContainer"
import { FormGroup, TextField, Button } from "@material-ui/core"
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext"
import { makeStyles } from '@material-ui/core/styles';
import { useState, useContext } from "react";
import RoomEnterInfo from "../../Interfaces/RoomEnterInfo";
import { CallApi } from "../../Utils/Api"

const useStyles = makeStyles((theme) => ({
    formGroup: {
        width: 'fit-content',
        margin: '1rem auto'
    },
    submitButton: {
        margin: '1rem auto'
    }
  }));

export default function JoinRoom(){
    const { getText } = useContext(LanguageContext) as LanguageContextType
    const [roomCode, setRoomCode] = useState("")
    const [roomInfoFound, setRoomInfoFound] = useState<RoomEnterInfo>({
        loading: false,
        code: undefined,
        capacity: 5,
        currentPlayerNum: 0,
        language: ""
    })

    const classes = useStyles()
    const findRoom = () => {
        CallApi({
            path: `find-room?code=${roomCode}`,
            payload: roomCode,
            method: "GET"
        }).then((json:string) => {
            console.log(json)
        })
    }
    
    return <ContentContainer allowBack>
        <form>
            <FormGroup className={classes.formGroup}>
                        <TextField
                            id="room-code"
                            label={getText("roomCode")}
                            variant="outlined"
                            color="primary"
                            value={roomCode}
                            autoFocus
                            onChange={(e) => {
                                setRoomCode(e.target.value)
                            }}
                        />
            </FormGroup>

            <Button className={classes.submitButton} onClick={findRoom}
                    size="large" variant="contained" color="primary">
                { getText("findRoom") }
            </Button>   
        </form>

               
    </ContentContainer>
}