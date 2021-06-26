import React, {useState} from "react";

const PlayerContext = React.createContext<any>(undefined)

interface PlayerContextProp {
    children:JSX.Element
}

export type PlayerContextType = {
    id?: number,
    nickname?: string,
    setId: (id: number) => void
    setNickname: (name: string) => void
    getAvatarPath: () => string
}

function PlayerProvider({ children }: PlayerContextProp){
    const [id, setId] = useState(undefined)
    const [nickname, setNickname] = useState(undefined)

    return <PlayerContext.Provider value={
        {
            id,
            setId,
            nickname,
            setNickname,
        }
    }>
        {children}
    </PlayerContext.Provider>
}

export {PlayerProvider, PlayerContext}
