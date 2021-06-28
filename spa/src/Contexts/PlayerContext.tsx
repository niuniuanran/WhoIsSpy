import React, {useState, useRef, useEffect} from "react";
import { useParams } from "react-router-dom";

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
    closeConnection?: () => void
}

function PlayerProvider({ children }: PlayerContextProp){
    const { code } = useParams<{code?: string}>()
    const [id, setId] = useState(undefined)
    const [nickname, setNickname] = useState(undefined)
    const [connected, setConnected] = useState(false);
    const ws = useRef<WebSocket|null>(null);

    const handleMessage = (message:string) => {
        console.log(message);
    };

    useEffect(() => {
        if (nickname && code && !connected){
            ws.current = new WebSocket(`ws://${process.env.REACT_APP_API_BASE_URL}/ws?nickname=${nickname}&roomcode=${code}`)
            ws.current.onopen = () => {
                // on connecting, do nothing but log it to the console
                console.log("connected");
                setConnected(true);
            };
            ws.current.onmessage = (evt) => {
                // listen to data sent from the websocket server
                console.log(evt.data);
                handleMessage(JSON.parse(evt.data));
            };
            ws.current.onclose = () => {
                console.log("disconnected");
            // automatically try to reconnect on connection loss
            };
        }
    }, [connected, nickname, ws, code])

    const onExitRoom = () => {
        ws?.current?.send(
            JSON.stringify({
              action: "player-left",
              sender: nickname,
              roomcode: code,
              payload: ""
            })
          )
    }

    return <PlayerContext.Provider value={
        {
            id,
            setId,
            nickname,
            setNickname,
            closeConnection: onExitRoom
        }
    }>
        {children}
    </PlayerContext.Provider>
}

export {PlayerProvider, PlayerContext}
