import React, {useState, useRef, useEffect, useCallback} from "react";
import { useParams } from "react-router-dom";
import { BroadcastActions, BroadcastMessage } from "../Interfaces/Messages";
import { CallApi } from "../Utils/Api"
import { Modal } from "@material-ui/core"

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
    playersInRoom?: [string]
    alertLine?: string
}

function PlayerProvider({ children }: PlayerContextProp){
    const { code } = useParams<{code?: string}>()
    const [id, setId] = useState(undefined)
    const [nickname, setNickname] = useState(undefined)
    const [connected, setConnected] = useState(false)
    const [alertLine, setAlertLine] = useState("")
    const [playersInRoom, setPlayersInRoom] = useState<[string]>()
    const [joinFailedMessage, setJoinFailedMessage] = useState("")

    const ws = useRef<WebSocket|null>(null);

    const handleMessage = (message:BroadcastMessage) => {
        console.log(message);
        if (message.line) {
            setAlertLine(message.line)
            setTimeout(()=>setAlertLine(""), 2000)
        }
        if (message.action === BroadcastActions.PlayerJoinedBroadcast || message.action === BroadcastActions.PlayerLeftBroadcast) {
            setPlayersInRoom(JSON.parse(message.payload))
        }
    };

    const reportExitRoom = useCallback(async () => {
        console.log("Leaving room ", code)
        ws?.current?.send(
            JSON.stringify({
              action: "player-left",
              senderNickname: nickname,
              roomCode: code,
              payload: ""
            })
          )
    }, [ws, nickname, code])

    useEffect(() => {
        if (nickname && code && !connected){
            CallApi({path: "ayt?nickname=${nickname}&roomcode=${code}" })
            .then((r:string) => {
                if (r === "") {
                    ws.current = new WebSocket(`ws://${process.env.REACT_APP_API_BASE_URL}/ws?nickname=${nickname}&roomcode=${code}`)
                    ws.current.onopen = () => {
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
                } else {
                    setJoinFailedMessage(r)
                }
            })
        }
    }, [reportExitRoom, code, nickname, ws, connected])

    return <PlayerContext.Provider value={
        {
            id,
            setId,
            nickname,
            setNickname,
            reportExitRoom,
            playersInRoom,
            alertLine
        }
    }>
        {children}
        <Modal
            open={joinFailedMessage !== ""}
            onClose={() => setJoinFailedMessage("")}
            aria-labelledby="join-room-failed"
            aria-describedby="join-room-failed"
            >
            <span>
                {joinFailedMessage}
            </span>
        </Modal>
    </PlayerContext.Provider>
}

export {PlayerProvider, PlayerContext}
