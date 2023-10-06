import { createContext } from "react"
import { Color } from "../components/game/misc"
import { GameContext } from "../types/game"

const gameNotInitializedError = () => {
  () => { console.error('Game context not initialized') }
}

const gameContext = createContext<GameContext>({
  viewColor: Color.red,
  connection: undefined,
  playingColor: undefined,
  state: undefined,
  setState: () => { gameNotInitializedError() }
})

export default gameContext