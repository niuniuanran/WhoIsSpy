import React, {useState, useRef, useEffect, useCallback} from "react";
import { useParams } from "react-router-dom";
import { BroadcastActions, BroadcastMessage, ReportActions } from "../Interfaces/Messages";
import { CallApi } from "../Utils/Api"
import {AytMessage} from "../Interfaces/Messages"
import Player, { PlayerStates } from "../Interfaces/Player"

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
    gameStarted: boolean
    setGameStarted: (b: boolean) => void
    word: string
    onVote: (n: string) => void
    onTalkFinish: () => void
    onWordRead: () => void
    playerState: string
    instruction: string
}

function RoomProvider({ children }: RoomContextProp){
    const { code } = useParams<{code?: string}>()
    const [id, setId] = useState(undefined)
    const [nickname, setNickname] = useState(undefined)
    const [connected, setConnected] = useState(false)
    const [alertLine, setAlertLine] = useState("")
    const [gameStarted, setGameStarted] = useState(false)
    const [playersInRoom, setPlayersInRoom] = useState<[Player]>()
    const [joinFailedMessage, setJoinFailedMessage] = useState("")
    const [roomCapacity, setRoomCapacity] = useState(0)
    const [word, setWord] = useState("")
    const [playerState, setPlayerState] = useState(PlayerStates.IdleState)
    const [instruction, setInstruction] = useState("")
    const [wordRead, setWordRead] = useState(false)

    const ws = useRef<WebSocket|null>(null);

    const handleMessage = useCallback((message:BroadcastMessage) => {
        if (message.line) {
            setAlertLine(message.line)
            setTimeout(()=>setAlertLine(""), 2000)
        }
        if (message.action === BroadcastActions.PlayerJoinedBroadcast || 
            message.action === BroadcastActions.PlayerLeftBroadcast) {
            setPlayersInRoom(JSON.parse(message.payload))
        }
        if (message.action === BroadcastActions.GameWillStartBroadcast) {
            setGameStarted(true)
        }

        if (message.action === BroadcastActions.PlayerNewStateBroadcast) {
            console.log(message)
            setPlayersInRoom(JSON.parse(message.payload))
            setPlayerState((playersInRoom?.find(p => p.nickname === nickname)?.state) || PlayerStates.IdleState)
            message.line && setInstruction(message.line)
        }

        if (message.action === BroadcastActions.YourWordBroadcast) {
            setWord(message.payload)
            setPlayerState(PlayerStates.WordReadingState)
        }
    }, [nickname, playersInRoom]);

    const reportExitRoom = useCallback(() => {
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

    const onVote = useCallback((target:string) => {
        ws?.current?.send(
            JSON.stringify({
              action: ReportActions.VoteAction,
              senderNickname: nickname,
              roomCode: code,
              payload: target
            })
          )
    }, [ws, nickname, code])

    const onTalkFinish = useCallback(() => {
        ws?.current?.send(
            JSON.stringify({
              action: ReportActions.TalkFinishAction,
              senderNickname: nickname,
              roomCode: code,
              payload: ""
            })
          )
    }, [ws, nickname, code])

    const onWordRead = useCallback(() => {
        if (wordRead) {
            return
        }
        setWordRead(true)
        ws?.current?.send(
            JSON.stringify({
              action: ReportActions.WordReadAction,
              senderNickname: nickname,
              roomCode: code,
              payload: ""
            })
          )
    }, [ws, nickname, code, wordRead])

    const getReady = useCallback(() => {
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
    }, [reportExitRoom, handleMessage, code, nickname, ws, connected])

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
            gameStarted,
            setGameStarted,
            word,
            playerState,
            onVote,
            onTalkFinish,
            onWordRead,
            instruction
        }
    }>
        {children}
    </RoomContext.Provider>
}

export {RoomProvider, RoomContext}
