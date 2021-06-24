import { RoomSettings } from "../Components/EnterGame/NewRoom";

export default function stubCreateRoomApi(roomSettings: RoomSettings){
    return {
        loading: false,
        code: "2333",
        capacity: roomSettings.numPlayer,
        currentPlayerNum: 0,
        language: roomSettings.language
    }
}