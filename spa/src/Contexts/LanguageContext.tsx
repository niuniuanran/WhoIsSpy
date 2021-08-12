import React from "react";

interface LanguageContextProp {
    language:string,
    children:JSX.Element
}
const LanguageContext = React.createContext<any>(undefined)
export type LanguageContextType = {
    language: string,
    getText: (key:string, arg?:string) => string,
    getCurrentLanguage: () => string
}

function LanguageProvider({language, children}:LanguageContextProp){
    
    const textDisplay:{ [name: string]: {[language:string]:string}}={
        newRoom: {
            en: "New room",
            cn: "新建房间",
        },
        joinRoom:{
            en: "Join room",
            cn: "加入房间"
        },
        addWords:{
            en: "Contribute",
            cn: "贡献词条"
        },
        randomBlank: {
            en: "Spy can be blank",
            cn: "卧底可以是白板"
        },
        eighteenPlus: {
            en: "Allow 18+ words",
            cn: "允许成人词汇"
        },
        back: {
            en: "Back",
            cn: "返回"
        },
        spyPlural: {
            en: "spies",
            cn: "个卧底"
        },
        spySingular: {
            en: "spy",
            cn: "个卧底"
        },
        total: {
            en: "total",
            cn: "个玩家"
        },
        roomCode: {
            en: "Room code",
            cn: "房间号"
        },
        enRoom: {
            en: "Room in English",
            cn: "英文房间"
        },
        cnRoom: {
            en: "Room in Chinese",
            cn: "中文房间"
        },
        enterRoom: {
            en: "Enter room",
            cn: "进入房间"
        },
        roomFull: {
            en: "Room is full",
            cn: "房间已满"
        },
        createRoom: {
            en: "Create room",
            cn: "创建房间"
        },
        confirm: {
            en: "OK",
            cn: "确认"
        },
        ok: {
            en: "OK",
            cn: "好的"
        },
        youNickname: {
            en: "Your nickname",
            cn: "你的昵称"
        },
        exit: {
            en: "Exit",
            cn: "退出"
        },
        findRoom: {
            en: "Find room",
            cn: "查找房间"
        },
        failJoinRoom: {
            en: "Failed to join room",
            cn: "加入房间失败"
        },
        changeWord: {
            en: "Change words",
            cn: "换词"
        },
        backToHomepage: {
            en: "Back to homepage",
            cn: "返回主页"
        },
        youLookDisconnected:{
            en: "You look disconnected...",
            cn: "你好像掉线了🤔"
        },
        waitingVote:{
            en: "Waiting for other players to vote",
            cn: "正在等待其他玩家投票"
        },
        you: {
            en: "you",
            cn: "你"
        },
        imReady: {
            en:"I'm ready",
            cn:"准备"
        },
        notReady: {
            en:"I'm not ready",
            cn:"没准备好"
        },
        gameStarting:{
            en: "Game starting...",
            cn: "游戏即将开始..."
        },
        ready: {
            en: "ready",
            cn: "准备"
        },
        reading: {
            en: "reading",
            cn: "读词中"
        },
        listening: {
            en: "",
            cn: ""
        },
        talking: {
            en: "talking",
            cn: "发言中"
        },
        voting: {
            en: "voting",
            cn: "投票中"
        },
        killed: {
            en: "killed",
            cn: "被杀"
        },
        win: {
            en: "win",
            cn: "胜利"
        },
        lose: {
            en: "lose",
            cn: "失败"
        },
        voted: {
            en: "voted",
            cn: "已投票"
        },
        wordChanging:{
            en: "",
            cn: ""
        },
        offline: {
            en: "offline",
            cn: "掉线"
        },
        yourWord: {
            en: "Your word:",
            cn: "你的词是："
        },
        gotIt: {
            en: "Got it",
            cn: "好的"
        },
        seeWord:{
            en: "See word",
            cn: "显示词语"
        },
        pleaseVote: {
            en: "Please vote",
            cn: "请投票"
        },
        submitVote: {
            en: "Vote",
            cn: "提交"
        },
        noAlivePlayers: {
            en: `No alive players in room`,
            cn: `已没有存活玩家`
        },
        gotTies: {
            en: "Got ties. Please continue to vote",
            cn: "平票，请继续投票"
        },
        goodWin: {
            en: "No spies left. Good people win!",
            cn: "卧底全部死亡，好人胜利！"
        },
        youWin: {
            en: "You win",
            cn: "你赢啦"
        },
        youLose: {
            en: "You lose",
            cn: "你输了"
        }
    }

    const textDisplayFuncs: { [name: string]: {[language:string]:(arg:string)=>string}}={
        room:{
            en: (arg:string) => `Room ${arg}`,
            cn: (arg: string) => `${arg} 房间`
        },
        isReady:{
            en: (arg:string) => `${arg} is ready`,
            cn: (arg: string) => `玩家 ${arg} 准备`
        },
        isNotReady:{
            en: (arg:string) => `${arg} is not ready`,
            cn: (arg: string) => `玩家 ${arg} 撤销准备`
        },
        appearAway:{
            en: (arg:string) => `${arg} appears away`,
            cn: (arg: string) => `玩家 ${arg} 掉线`
        },
        turnToTalk: {
            en: (arg:string) => `${arg}'s turn to talk`,
            cn: (arg:string) => `玩家 ${arg} 请发言`,
        },
        isKilled: {
            en: (arg:string) => `${arg} is killed`,
            cn: (arg:string) => `玩家 ${arg} 被杀`,
        },
        spiesWin: {
            en: (arg:string) => `Only ${arg} good people left. Spies win!`,
            cn: (arg:string) => `仅剩${arg}名好人，卧底胜利！`,
        },
        requestChangeWord: {
            en: (arg:string) => `${arg} requested to change word`,
            cn: (arg:string) => `玩家 ${arg} 要求换词`,
        },
        joined: {
            en: (arg: string) => `${arg} joined the room`,
            cn: (arg: string) => `${arg} 加入了房间`,
        },
        left: {
            en: (arg: string) => `${arg} left the room`,
            cn: (arg: string) => `${arg} 离开了房间`,
        }
    }

    const getText = (key:string, arg:string) => {
        return (arg && textDisplayFuncs[key][language](arg)) || textDisplay[key][language]}
    const getCurrentLanguage = () => language

    return <LanguageContext.Provider value={
        {
            language,
            getText,
            getCurrentLanguage
        }
    }>
        {children}
    </LanguageContext.Provider>
}

export {LanguageProvider, LanguageContext}
