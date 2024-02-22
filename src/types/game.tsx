import { HubConnection } from "@microsoft/signalr"
import { Color } from "../components/game/misc"

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
  timeLeft: number
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
  startedResponse: StartedResponse | null,
  endedResponse: EndedResponse | null,
  boardState: BoardPositions | null,
  turn: number,
  turnCount: number,
  playerStates: PlayerState[],
  timeStamp: Date
}

interface GameData { 
  url: string
  key: string
  redUsername: string
  blackUsername: string 
}

interface GameContext {
  data: GameData | undefined
  viewColor: Color,
  connection: HubConnection | undefined,
  playingColor: Color,
  state: GameState | undefined,
  setState: (state: GameState) => void,
  messages: Message[]
}

interface Action {
  type: string,
  data: DataDictionary
}

type DataDictionary = {
  [K in string]: object | string | number | boolean | object[] | string[] | Symbol
}

interface Message {
  type: string
  content: string
}

interface UserMessage extends Message {
  username: string
}

export type {
  GameState,
  PlayerState,
  StartedResponse,
  EndedResponse,
  BoardPositions,
  CardState,
  TileState,
  GameData,
  GameContext,
  Action,
  Message,
  UserMessage
}