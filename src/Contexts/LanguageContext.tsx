import React from "react";

interface LanguageContextProp {
    language:string,
    children:JSX.Element
}

export default function LanguageProvider({language, children}:LanguageContextProp){
    
    const textDisplay:{ [name: string]: {[language:string]:string}}={
        createRoom: {
            en: "Create a room",
            cn: "创建房间",
        },
        joinRoom:{
            en: "Join a room",
            cn: "加入房间"
        }
    }
    const getText = (key:string) => textDisplay[key][language]

    const LanguageContext = React.createContext<any>(undefined)

    return <LanguageContext.Provider value={
        {
            language,
            getText
        }
    }>
        {children}
    </LanguageContext.Provider>
}