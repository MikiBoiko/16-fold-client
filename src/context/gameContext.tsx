import { createContext } from "react"
import { Color } from "../components/game/misc"
import { GameContext, Message } from "../types/game"

const gameNotInitializedError = () => {
  () => { console.error('Game context not initialized') }
}

const gameContext = createContext<GameContext>({
  data: undefined,
  viewColor: Color.red,
  connection: undefined,
  playingColor: Color.none,
  state: undefined,
  setState: () => { gameNotInitializedError() },
  messages: []
})

export default gameContext