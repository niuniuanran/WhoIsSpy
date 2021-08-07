import React, {useState, useRef, useEffect, useCallback} from "react";
import { useParams } from "react-router-dom";
import { BroadcastActions, BroadcastMessage, ReportActions } from "../Interfaces/Messages";
import { CallApi } from "../Utils/Api"
import {AytMessage} from "../Interfaces/Messages"
import Player from "../Interfaces/Player"
import { RoomStates } from "../Components/Room/Room";
import ReconnectingWebSocket from 'reconnecting-websocket';

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
    onExitRoom?: () => void
    playersInRoom?: [Player]
    alertLine?: string
    joinFailedMessage?: string
    setJoinFailedMessage?: (s: string) => void
    roomCapacity?: number
    getReady?: () => void
    undoReady?: () => void
    word: string
    onVote: (n: string) => void
    onTalkFinish: () => void
    onWordRead: () => void
    playerState: string
    instruction: string
    voteTargets: [string]
    roomState: string
    setRoomState: (s: string) => void
    reportResultReceived: () => void
    alertType?: "success"|"warning"|"error"|"info"
    changeWord: () => void
}

function RoomProvider({ children }: RoomContextProp){
    const { code } = useParams<{code?: string}>()
    const [id, setId] = useState(undefined)
    const [nickname, setNickname] = useState("")
    const [connected, setConnected] = useState(false)
    const [alertLine, setAlertLine] = useState("")
    const [playersInRoom, setPlayersInRoom] = useState<Player[]>()
    const [joinFailedMessage, setJoinFailedMessage] = useState("")
    const [roomCapacity, setRoomCapacity] = useState(0)
    const [word, setWord] = useState("")
    const [instruction, setInstruction] = useState("")
    const [wordRead, setWordRead] = useState(false)
    const [voteTargets, setVoteTargets] = useState<[string]>()
    const [roomState, setRoomState] = useState(RoomStates.IdleState)
    const [alertType, setAlertType] = useState("success")

    const ws = useRef<ReconnectingWebSocket|null>(null);

    const handleMessage = useCallback((message:BroadcastMessage) => {
        message.instruction && setInstruction(message.instruction)
        if (message.alert){
            message.alertType && setAlertType(message.alertType)
            setAlertLine(message.alert)
            setTimeout(()=>setAlertLine(""), 2500)
        } 

        if (message.action === BroadcastActions.PlayerNewStateBroadcast) {
            let players: [Player] = JSON.parse(message.payload) 
            setPlayersInRoom(players)
        }

        if (message.action === BroadcastActions.PlayerJoinedBroadcast || 
            message.action === BroadcastActions.PlayerLeftBroadcast) {
            setPlayersInRoom(JSON.parse(message.payload))
        }

        if (message.action === BroadcastActions.GameWillStartBroadcast) {
            setRoomState(RoomStates.GameOnState)
        }

        if (message.action === BroadcastActions.YourWordBroadcast) {
            setWord(message.payload)
            setWordRead(false)
        }

        if (message.action === BroadcastActions.AskVoteBroadcast) {
            setVoteTargets(JSON.parse(message.payload))
        }

    }, [roomState]);

    const changeWord = useCallback(() => {
        ws?.current?.send(
            JSON.stringify({
              action: ReportActions.ChangeWordAction,
              senderNickname: nickname,
              roomCode: code,
              payload: ""
            })
          )
    }, [ws, nickname, code])

    const onExitRoom = useCallback(() => {
        if(roomState === RoomStates.GameOnState) {
            nickname && localStorage.setItem("nickname", nickname)
            code && localStorage.setItem("roomCode", code)
        }
        ws?.current?.send(
            JSON.stringify({
              action: ReportActions.PlayerExitAction,
              senderNickname: nickname,
              roomCode: code,
              payload: ""
            })
          )
    }, [ws, nickname, code, roomState])

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

    const reportResultReceived= useCallback(async () => {
        setRoomState(RoomStates.IdleState)
        setWord("")
        ws?.current?.send(
            JSON.stringify({
                action: ReportActions.ResultReceived,
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

                ws.current = new ReconnectingWebSocket(`ws://${process.env.REACT_APP_API_BASE_URL}/ws?nickname=${nickname}&roomcode=${code}`)
                ws.current.onopen = () => {
                    console.log("connected");
                    setConnected(true);
                };
                ws.current.onmessage = (evt) => {
                    handleMessage(JSON.parse(evt.data));
                };
                ws.current.onclose = () => {
                    onExitRoom()
                    console.log("disconnected");

            }})
        }
    }, [onExitRoom, handleMessage, code, nickname, ws, connected])

    return <RoomContext.Provider value={
        {
            id,
            setId,
            nickname,
            setNickname,
            onExitRoom,
            playersInRoom,
            alertLine,
            joinFailedMessage,
            setJoinFailedMessage,
            roomCapacity,
            getReady,
            undoReady,
            roomState,
            setRoomState,
            word,
            onVote,
            onTalkFinish,
            onWordRead,
            instruction,
            voteTargets,
            reportResultReceived,
            alertType,
            changeWord
        }
    }>
        {children}
    </RoomContext.Provider>
}

export {RoomProvider, RoomContext}
