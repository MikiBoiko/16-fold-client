import { HubConnection } from "@microsoft/signalr"
import { Color } from "../components/game/misc"

interface GameData {
  url: string
}

interface TileState {
  position: string,
  value: CardState | undefined | null
}

interface CardState {
  color: Color,
  value: number
}

interface PlayerState {
  username: string,
  timerLeft: number
}

interface StartedResponse {
  turn: Color,
  pickedCards: number[]
}

interface EndedResponse {
  way: number,
  result: Color
}

type BoardPositions = {
  [K in string]: CardState | null
}

interface GameState {
  startedResponse: StartedResponse | undefined,
  endedResponse: EndedResponse | undefined,
  boardState: BoardPositions | undefined,
  turn: number,
  turnCount: number,
  playerStates: PlayerState[],
  lastTurnTimeStamp: number
}

interface GameContext {
  viewColor: Color,
  connection: HubConnection | undefined,
  playingColor: Color | undefined,
  state: GameState | undefined,
  setState: (state: GameState) => void
}

interface Action {
  type: string,
  data: DataDictionary
}

type DataDictionary = {
  [K in string]: object | string | number | boolean | object[] | string[] | Symbol
}

export type {
  GameState,
  GameData,
  PlayerState,
  StartedResponse,
  EndedResponse,
  BoardPositions,
  CardState,
  TileState,
  GameContext,
  Action
}