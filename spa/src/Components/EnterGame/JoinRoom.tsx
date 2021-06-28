import ContentContainer from "../Shared/ContentContainer"
import { FormGroup, TextField, Button, CircularProgress } from "@material-ui/core"
import { LanguageContext, LanguageContextType } from "../../Contexts/LanguageContext"
import { makeStyles } from '@material-ui/core/styles';
import { useState, useContext } from "react";
import RoomEnterInfo from "../../Interfaces/RoomEnterInfo";
import { CallApi } from "../../Utils/Api"
import RoomInfoEnter from "./RoomInfoEnter";

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
        setRoomInfoFound(roomInfoFound => ({...roomInfoFound, loading: true}))
        CallApi({
            path: `find-room?code=${roomCode}`,
            payload: roomCode,
            method: "GET"
        }).then((j:any) => {
            console.log("json: ", j)
            setRoomInfoFound({...j, loading: false})
            console.log(roomInfoFound)
        })
    }

    if (roomInfoFound.code) {
        return <RoomInfoEnter {...roomInfoFound}/>
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
        {
            roomInfoFound.loading? (
                <Button className={classes.submitButton} onClick={findRoom}
                    size="large" variant="contained" color="primary" disabled>
                    <CircularProgress />
                </Button> 
            ):(
                <Button className={classes.submitButton} onClick={findRoom}
                    size="large" variant="contained" color="primary">
                        { getText("findRoom") }
                 </Button>   
            )
        }    
        </form>
    </ContentContainer>
}