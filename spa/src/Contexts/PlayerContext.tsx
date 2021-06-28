import React, {useState, useRef, useEffect} from "react";
import { useParams } from "react-router-dom";
import { BroadcastMessage } from "../Interfaces/Messages";

const PlayerContext = React.createContext<any>(undefined)

interface PlayerContextProp {
    children:JSX.Element,
}

export type PlayerContextType = {
    id?: number,
    nickname?: string,
    setId: (id: number) => void
    setNickname: (name: string) => void
    getAvatarPath: () => string
    reportExitRoom?: () => void
}

function PlayerProvider({ children }: PlayerContextProp){
    const { code } = useParams<{code?: string}>()
    const [id, setId] = useState(undefined)
    const [nickname, setNickname] = useState(undefined)
    const [connected, setConnected] = useState(false);
    const ws = useRef<WebSocket|null>(null);

    const handleMessage = (message:BroadcastMessage) => {
        console.log(message);
    };

    const reportExitRoom = () => {
        console.log("Leaving room ", code)
        ws?.current?.send(
            JSON.stringify({
              action: "player-left",
              senderNickname: nickname,
              roomCode: code,
              payload: ""
            })
          )
    }

    useEffect(() => {
        if (nickname && code && !connected){
            ws.current = new WebSocket(`ws://${process.env.REACT_APP_API_BASE_URL}/ws?nickname=${nickname}&roomcode=${code}`)
            ws.current.onopen = () => {
                // on connecting, do nothing but log it to the console
                console.log("connected");
                setConnected(true);
            };
            ws.current.onmessage = (evt) => {
                handleMessage(JSON.parse(evt.data));
            };
            ws.current.onclose = () => {
                reportExitRoom()
                console.log("disconnected");
            };
        }
    }, [connected, nickname, ws, code])

    return <PlayerContext.Provider value={
        {
            id,
            setId,
            nickname,
            setNickname,
            reportExitRoom
        }
    }>
        {children}
    </PlayerContext.Provider>
}

export {PlayerProvider, PlayerContext}
