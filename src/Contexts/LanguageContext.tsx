import React from "react";

interface LanguageContextProp {
    language:string,
    children:JSX.Element
}
const LanguageContext = React.createContext<any>(undefined)
export type LanguageContextType = {
    language: string,
    getText: (arg:string) => string,
    getCurrentLanguage: () => string
}

function LanguageProvider({language, children}:LanguageContextProp){
    
    const textDisplay:{ [name: string]: {[language:string]:string}}={
        createRoom: {
            en: "New room",
            cn: "创建房间",
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
        }
    }

    const getText = (key:string) => textDisplay[key][language]
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
