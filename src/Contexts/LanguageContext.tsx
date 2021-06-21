import React from "react";

interface LanguageContextProp {
    language:string,
    children:JSX.Element
}
const LanguageContext = React.createContext<any>(undefined)
export type LanguageContextType = {
    language: string,
    getText: (arg:string) => string
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
        }
    }

    const getText = (key:string) => textDisplay[key][language]
    return <LanguageContext.Provider value={
        {
            language,
            getText
        }
    }>
        {children}
    </LanguageContext.Provider>
}

export {LanguageProvider, LanguageContext}
