import { createContext } from "react"
import { Action } from "../types/game"

interface BoardContext {
    action: Action | undefined,
    onCancel: () => void,
    onSelect: (from: string) => void,
    onAttack: (to: string) => void,
    onAddToAttack: (from: string) => void,
    onDoAction: (action: Action) => void,
}

const boardContext = createContext<BoardContext>({
    action: undefined,
    onCancel: () => { },
    onSelect: (from: string) => { },
    onAttack: (to: string) => { },
    onAddToAttack: (from: string) => { },
    onDoAction: (action: Action) => { },
})

export default boardContext