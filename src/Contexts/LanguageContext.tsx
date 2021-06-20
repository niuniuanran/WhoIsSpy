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
            en: "Add words",
            cn: "贡献词条"
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
