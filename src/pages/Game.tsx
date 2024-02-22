import { useState, useEffect, useCallback, useContext, useRef } from "react"
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr"

import { IonCard } from "@ionic/react"

import gameContext from "../context/gameContext"
import Board from "../components/game/Board"

import Profile from "../components/game/Profile"
import Chat from "../components/game/Chat"
import { Color, colorNames, initialBoardState, reasonsName, valueToCard } from "../components/game/misc"

import { BoardPositions, EndedResponse, GameContext, GameData, GameState, Message, StartedResponse, UserMessage } from "../types/game"

import "./Game.css"
import { useParams } from "react-router"
import axios from "axios"
import appContext from "../context/appContext"
import { HTTP_URL } from "../socket"
import { TabLayout } from "../components/game/Layout"

function gameStartedMessage(pickedCards: number[], playingColor: Color, startingTurn: number) {
  const startingCards: string[] = [valueToCard(0, playingColor)]

  pickedCards
    .sort(function (a: number, b: number) {
      return a - b
    })
    .forEach((value: number) => {
      startingCards.push(valueToCard(value, playingColor))
    })

  return `Game started, ${colorNames[startingTurn]} starts. Playing cards: ${startingCards.toString()}`
}

function gameEndedMessage(result: number, way: number) {
  return `Game ended. ${colorNames[result].toUpperCase()} won due to ${reasonsName[way]}.`
}

const Game = () => {
  const { user } = useContext(appContext)
  const { tag } = useParams<{ tag: string }>()
  const [game, setGame] = useState<GameData>()

  useEffect(() => {
    if (user === undefined) return

    const params = new URLSearchParams([['tag', tag]]);
    axios.get(`${HTTP_URL}/games/fetch`, { params, headers: { "auth": `bearer ${user.publicToken}` } })
      .then((result) => {
        const { hostname, port, key, redUsername, blackUsername } = result.data
        setGame({
          url: `http://${hostname}:${port}`,
          key,
          redUsername,
          blackUsername
        })
      })
  }, [user])

  //#region Chat
  const [messages, setMessages] = useState<Message[]>([])

  const onRecieveUserMessage = useCallback(
    (data: UserMessage) => {
      setMessages([...messages, { ...data, type: "user" }])
    },
    [messages, setMessages]
  )

  const onRecieveGameMessage = useCallback(
    (data: string) => {
      setMessages([...messages, { content: data, type: "game" }])
    },
    [messages, setMessages]
  )
  //#endregion

  //#region Game state
  const [viewColor, setViewColor] = useState<Color>(Color.red)
  const [playingColor, setPlayingColor] = useState<Color>(Color.none)
  const [state, setState] = useState<GameState | undefined>()

  const nextTurn = useCallback((timeStamp: string, timeLeft: number, boardState: BoardPositions | undefined = undefined) => {
    setState((state: GameState | undefined) => {
      if (state === undefined) return undefined

      const newBoardState = boardState || state.boardState
      const nextTurn = (state.turn + 1) % 2

      const playerStates = state.playerStates
      playerStates[state.turn].timeLeft = timeLeft

      return {
        ...state,
        boardState: newBoardState,
        turn: nextTurn,
        turnCount: state.turnCount + 1,
        timeStamp: new Date(timeStamp),
        playerStates
      }
    })

  }, [setState])

  const onRecieveGameStarted = useCallback((response: StartedResponse) => {
    const { pickedCards, turn } = response

    setState((state: GameState | undefined) => {
      if (state === undefined) return undefined
      return {
        ...state,
        turn: (turn as number),
        boardState: initialBoardState
      }
    })

    onRecieveGameMessage(gameStartedMessage(pickedCards, playingColor, turn))
  }, [setState, onRecieveGameMessage])

  const onRecieveGameEnded = useCallback((response: EndedResponse) => {
    const { result, way } = response

    onRecieveGameMessage(gameEndedMessage(result, way))
    setState((oldState) => {
      if(oldState === undefined) return undefined
      return {
        ...oldState,
        endedResponse: response
      }
    })
  }, [onRecieveGameMessage, setState])

  const onRecieveState = useCallback((response: GameContext) => {
    const { playingColor, state } = response

    if (state === undefined) return

    const { startedResponse, endedResponse } = response.state || { startedResponse: null, endedResponse: null }

    if (startedResponse === null) {
      onRecieveGameMessage('Waiting for game to start...')
    }
    else if (endedResponse === null) {
      const { pickedCards, turn } = startedResponse
      onRecieveGameMessage(gameStartedMessage(pickedCards, playingColor || Color.none, turn))
    }
    else {
      const { result, way } = endedResponse
      onRecieveGameMessage(gameEndedMessage(result, way))
    }

    setViewColor(playingColor === Color.none ? Color.red : playingColor)
    setPlayingColor(playingColor)
    setState({
      ...state,
      timeStamp: new Date(state.timeStamp)
    })
  }, [setPlayingColor, setViewColor, setState, onRecieveGameMessage])
  //#endregion

  //#region Actions callbacks
  const onRecieveMove = useCallback((response: any) => {
    if (state === undefined || state.boardState === null) return

    const { data, timeStamp, timeLeft } = response
    const { from, to } = data

    const newBoardState = { ...state.boardState }
    delete newBoardState[from]
    newBoardState[to] = state.boardState[from]

    nextTurn(timeStamp, timeLeft, newBoardState)
  }, [state, nextTurn])

  const onRecievePassing = useCallback((response: any) => {
    if (state === undefined) return

    const { timeStamp, timeLeft } = response
    nextTurn(timeStamp, timeLeft)
  }, [state, nextTurn])

  const onRecieveAttack = useCallback((response: any) => {
    if (state === undefined || state?.boardState === null) return

    console.log(response)

    const { data, timeStamp, timeLeft } = response
    const { defense, from, to } = data
    const { topCard, cardValues } = defense

    const newBoardState = { ...state.boardState }

    from.map((position: string) => {
      delete newBoardState[position]
    })

    if (defense.result === 2) {
      delete newBoardState[to]
    }
    else {
      newBoardState[to] = topCard.state
    }

    nextTurn(timeStamp, timeLeft, newBoardState)

    const attackingKey = Object.keys(cardValues)[0]
    const defendingCard = valueToCard(cardValues[attackingKey].value, cardValues[attackingKey].color)
    console.log(defendingCard)
    let attackingCardValues = { ...cardValues }
    console.log(attackingCardValues)
    delete attackingCardValues[attackingKey]
    console.log(attackingCardValues)
    const attackingCards: string[] = []

    Object.keys(attackingCardValues).forEach((cardPosition: any) => {
      attackingCards.push(valueToCard(attackingCardValues[cardPosition].value, attackingCardValues[cardPosition].color))
    })
    console.log(attackingCards)

    onRecieveGameMessage(`Attacked with: ${attackingCards.join(', ')}. Defended with ${defendingCard}.`,)
  }, [state, nextTurn, onRecieveGameMessage])

  const onRecieveSee = useCallback((response: any) => {
    if (state === undefined) return

    const { timeStamp, timeLeft } = response
    console.log(response)

    console.log(timeStamp)

    nextTurn(timeStamp, timeLeft)
  }, [state, nextTurn])

  const onRecieveOwnerSee = useCallback((response: any) => {
    const { card } = response.data

    onRecieveGameMessage(`Seen card: ${valueToCard(card.value, card.color)}`)
  }, [onRecieveGameMessage])
  //#endregion

  //#region Connection events
  const [connection, setConnection] = useState<HubConnection | undefined>()

  useEffect(() => {
    if (game === undefined) return

    const connection: HubConnection = new HubConnectionBuilder()
      .withUrl(`${game.url}/game`)
      .withAutomaticReconnect()
      .build()

    connection.start().then(() => {
      console.log('Game key: ' + game.key)
      connection.invoke("State", game.key)
    })

    setConnection(connection)
  }, [game])

  useEffect(() => {
    if (connection === undefined) return

    function onRecieveError(response: any) { console.error(response) }

    connection.on("RecieveGameStarted", onRecieveGameStarted)
    connection.on("RecieveGameEnded", onRecieveGameEnded)
    connection.on("RecieveState", onRecieveState)
    connection.on("RecieveMove", onRecieveMove)
    connection.on("RecievePassing", onRecievePassing)
    connection.on("RecieveAttack", onRecieveAttack)
    connection.on("RecieveSee", onRecieveSee)
    connection.on("RecieveOwnerSee", onRecieveOwnerSee)
    connection.on("RecieveError", onRecieveError)
    connection.on("RecieveMessage", onRecieveUserMessage)

    return () => {
      connection.off("RecieveGameStarted", onRecieveGameStarted)
      connection.off("RecieveGameEnded", onRecieveGameEnded)
      connection.off("RecieveState", onRecieveState)
      connection.off("RecieveMove", onRecieveMove)
      connection.off("RecievePassing", onRecievePassing)
      connection.off("RecieveAttack", onRecieveAttack)
      connection.off("RecieveSee", onRecieveSee)
      connection.off("RecieveOwnerSee", onRecieveOwnerSee)
      connection.off("RecieveError", onRecieveError)
      connection.off("RecieveMessage", onRecieveUserMessage)
    }
  }, [connection, onRecieveState, onRecieveMove, onRecievePassing, onRecieveAttack, onRecieveSee])
  //#endregion

  const [gameSizeRatio, setGameSizeRatio] = useState(0)
  const gameRef = useRef(null)

  useEffect(() => {
    if (gameRef.current === null) return
    console.log(gameRef.current)
    const { clientHeight, clientWidth } = gameRef.current
    setGameSizeRatio(clientHeight / clientWidth)
  })

  const gameComponent = (
    <IonCard
      ref={gameRef}
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
  )

  const chatComponent = (
    <Chat />
  )

  return (
    <gameContext.Provider
      value={{
        data: game,
        viewColor,
        connection,
        playingColor,
        state,
        setState,
        messages
      }}
    >
      <TabLayout
        game={gameComponent}
        chat={chatComponent}
      />
    </gameContext.Provider>
  )
}

export default Game