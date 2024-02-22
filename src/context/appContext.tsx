import { createContext } from "react"
import { Socket } from "socket.io-client"

type Challenge = {
    username: string
    format: string
}

type GameType = {
    rival: string
    tag: string
    format: string
}

type AppContext = {
    user: { username: string, publicToken: string } | undefined
    onAccess: (token: string | null) => void
    socket: Socket | undefined,
    challenges: Challenge[],
    games: GameType[]
}

const errorMethodContext = () => console.error('App not set up for access.')

const appContext = createContext<AppContext>({
    user: undefined,
    onAccess: errorMethodContext,
    socket: undefined,
    challenges: [],
    games: []
})

export type { AppContext, Challenge, GameType }
export default appContext