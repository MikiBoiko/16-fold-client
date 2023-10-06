import { useState, useEffect, useCallback } from "react"
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr"

import { IonCard } from "@ionic/react"

import gameContext from "../context/gameContext"
import Board from "../components/game/Board"

import Profile from "../components/game/Profile"
import Chat from "../components/game/Chat"
import { Color, initialBoardState } from "../components/game/misc"

import { BoardPositions, GameContext, GameData, GameState, StartedResponse } from "../types/game"

import "./Game.css"

const Game = ({ url }: GameData) => {
  const [viewColor, setViewColor] = useState<Color>(Color.red)
  const [connection, setConnection] = useState<HubConnection | undefined>()
  const [playingColor, setPlayingColor] = useState<Color | undefined>()
  const [state, setState] = useState<GameState | undefined>()

  const nextTurn = useCallback((timestamp: number, timeLeft: number, boardState: BoardPositions | undefined = undefined) => {
    console.log(boardState)

    if (state?.playerStates === undefined) return

    let playerStates = state.playerStates

    playerStates[state.turn].timerLeft = timeLeft

    setState({
      ...state,
      boardState: (boardState === undefined) ? state.boardState : boardState,
      turn: (state.turn + 1) % 2,
      turnCount: state.turnCount + 1,
      lastTurnTimeStamp: timestamp,
      playerStates: playerStates
    })

  }, [state, setState])

  const updateBoard = useCallback((boardState: BoardPositions) => {
    console.log('updating board')
    console.log(boardState)

    if (state === undefined) {
      console.error('Updating board without a state...')
      return
    }

    setState({
      ...state,
      boardState
    })
  }, [state, setState])

  const onRecieveGameStarted = useCallback((response: StartedResponse) => {
    updateBoard(initialBoardState)

    if (state === undefined) return

    const { turn } = response

    setState({
      ...state,
      turn: (turn as number)
    })
  }, [state, updateBoard, setState])

  const onRecieveState = useCallback((response: GameContext) => {
    const { playingColor, state } = response

    console.log(response)

    setViewColor(playingColor || Color.red)
    setPlayingColor(playingColor)
    setState(state)
  }, [setPlayingColor, setViewColor, setState])

  const onRecieveMove = useCallback((response: any) => {
    if (state?.boardState === undefined) return

    console.log(response)

    const { data, timeStamp, timeLeft } = response
    const { from, to } = data

    const newBoardState = { ...state.boardState }
    delete newBoardState[from]
    newBoardState[to] = state.boardState[from]

    nextTurn(timeStamp, timeLeft, newBoardState)
  }, [state, nextTurn])

  const onRecievePassing = useCallback((response: any) => {
    if (state === undefined) return
    console.log(response)
    const { timestamp, timeLeft } = response
    nextTurn(timestamp, timeLeft)
  }, [state, nextTurn])

  const onRecieveAttack = useCallback((response: any) => {
    console.log(state)

    if (state?.boardState === undefined) return

    console.log(response)

    const { data, timeStamp, timeLeft } = response
    const { defense, from, to } = data
    const { topCard } = defense

    const newBoardState = { ...state.boardState }

    from.map((position: string, index: number) => {
      delete newBoardState[position]
    })

    console.log(topCard.state)

    newBoardState[to] = topCard.state

    nextTurn(timeStamp, timeLeft, newBoardState)
  }, [state, nextTurn])

  const onRecieveSee = useCallback((response: any) => {
    if (state === undefined) return
    console.log(response)
    const { timestamp, timeLeft } = response
    nextTurn(timestamp, timeLeft)
  }, [state, nextTurn])

  useEffect(() => {
    const connection: HubConnection = new HubConnectionBuilder()
      .withUrl(`${url}/game`)
      .withAutomaticReconnect()
      .build()

    connection.start().then(() => {
      connection.invoke("State")
    })

    setConnection(connection)
  }, [setConnection])

  useEffect(() => {
    if (connection === undefined) return

    connection.on("RecieveGameStarted", onRecieveGameStarted)
    connection.on("RecieveState", onRecieveState)
    connection.on("RecieveError", (response) => { console.error(response) })
    connection.on("RecieveMove", onRecieveMove)
    connection.on("RecievePassing", onRecievePassing)
    connection.on("RecieveAttack", onRecieveAttack)
    connection.on("RecieveSee", onRecieveSee)

    return () => {
      connection.off("RecieveGameStarted", onRecieveGameStarted)
      connection.off("RecieveState", onRecieveState)
      connection.off("RecieveError")
      connection.off("RecieveMove", onRecieveMove)
      connection.off("RecievePassing", onRecievePassing)
      connection.off("RecieveAttack", onRecieveAttack)
      connection.off("RecieveSee", onRecieveSee)
    }
  }, [connection, onRecieveState, onRecieveMove, onRecievePassing, onRecieveAttack, onRecieveSee])

  return (
    <gameContext.Provider
      value={{
        viewColor,
        connection,
        playingColor,
        state,
        setState
      }}
    >
      <div className="Game">
        <IonCard
          id="game"
          style={{
            flexDirection: playingColor === Color.red
              ? "column"
              : "column-reverse"
          }}
        >
          <Profile playerColor={Color.black} />
          <Board />
          <Profile playerColor={Color.red} />
        </IonCard>
        <IonCard id="chat" className="ion-padding">
          <Chat />
        </IonCard>
      </div>
    </gameContext.Provider>
  )
}

export default Game