import React, {useState, useRef, useEffect, useCallback} from "react";
import { useParams } from "react-router-dom";
import { BroadcastActions, BroadcastMessage, ReportActions } from "../Interfaces/Messages";
import { CallApi } from "../Utils/Api"
import {AytMessage} from "../Interfaces/Messages"
import Player from "../Interfaces/Player"

const RoomContext = React.createContext<any>(undefined)

interface RoomContextProp {
    children:JSX.Element,
}

export type RoomContextType = {
    id?: number,
    nickname?: string,
    setId: (id: number) => void
    setNickname: (name: string) => void
    getAvatarPath: () => string
    reportExitRoom?: () => void
    playersInRoom?: [Player]
    alertLine?: string
    joinFailedMessage?: string
    setJoinFailedMessage?: (s: string) => void
    roomCapacity?: number
    getReady?: () => void
    undoReady?: () => void
    gameWillStart: boolean
    setGameWillStart: (b: boolean) => void
}

function RoomProvider({ children }: RoomContextProp){
    const { code } = useParams<{code?: string}>()
    const [id, setId] = useState(undefined)
    const [nickname, setNickname] = useState(undefined)
    const [connected, setConnected] = useState(false)
    const [alertLine, setAlertLine] = useState("")
    const [gameWillStart, setGameWillStart] = useState(false)
    const [playersInRoom, setPlayersInRoom] = useState<[Player]>()
    const [joinFailedMessage, setJoinFailedMessage] = useState("")
    const [roomCapacity, setRoomCapacity] = useState(0)

    const ws = useRef<WebSocket|null>(null);

    const handleMessage = (message:BroadcastMessage) => {
        if (message.line) {
            setAlertLine(message.line)
            setTimeout(()=>setAlertLine(""), 2000)
        }
        if (message.action === BroadcastActions.PlayerJoinedBroadcast || 
            message.action === BroadcastActions.PlayerLeftBroadcast || 
            message.action === BroadcastActions.PlayerReadyBroadcast ||
            message.action === BroadcastActions.PlayerUndoReadyBroadcast ) {
            setPlayersInRoom(JSON.parse(message.payload))
        }
        if (message.action === BroadcastActions.GameWillStartBroadcast) {
            setGameWillStart(true)
        }
    };

    const reportExitRoom = useCallback(async () => {
        console.log("Leaving room ", code)
        ws?.current?.send(
            JSON.stringify({
              action: ReportActions.PlayerLeftAction,
              senderNickname: nickname,
              roomCode: code,
              payload: ""
            })
          )
    }, [ws, nickname, code])

    const getReady = useCallback(async () => {
        ws?.current?.send(
            JSON.stringify({
              action: ReportActions.PlayerReadyAction,
              senderNickname: nickname,
              roomCode: code,
              payload: ""
            })
          )
        }, [ws, nickname, code])
    
    const undoReady = useCallback(async () => {
        ws?.current?.send(
            JSON.stringify({
                action: ReportActions.PlayerUndoReadyAction,
                senderNickname: nickname,
                roomCode: code,
                payload: ""
            })
            )
        }, [ws, nickname, code])

    useEffect(() => {
        if (nickname && code && !connected){
            CallApi({path: `ayt?nickname=${nickname}&roomcode=${code}` })
            .then((m: AytMessage) => {
                if (m.line) {
                    setJoinFailedMessage(m.line)
                    return
                }

                m.numPlayer && setRoomCapacity(m.numPlayer)

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

            }})
        }
    }, [reportExitRoom, code, nickname, ws, connected])

    return <RoomContext.Provider value={
        {
            id,
            setId,
            nickname,
            setNickname,
            reportExitRoom,
            playersInRoom,
            alertLine,
            joinFailedMessage,
            setJoinFailedMessage,
            roomCapacity,
            getReady,
            undoReady,
            gameWillStart,
            setGameWillStart
        }
    }>
        {children}
    </RoomContext.Provider>
}

export {RoomProvider, RoomContext}
