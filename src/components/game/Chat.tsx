import { useCallback, useState, useContext, useEffect } from "react"
import gameContext from "../../context/gameContext"
import { Color, colorNames, valueToCard } from "./misc"
import { IonButton, IonIcon, IonTextarea } from "@ionic/react"
import { send } from 'ionicons/icons';
import "./Chat.css"
import { HubConnection } from "@microsoft/signalr";

interface Message {
  type: string
  content: string
}

interface UserMessage extends Message {
  username: string
}

const UserMessage = ({ username, content }: UserMessage) => {
  return (
    <div className="Chat-user-message">
      <strong>{username}</strong>:{" " + content}
    </div>
  )
}

const GameMessage = ({ content }: Message) => {
  return <div className="Chat-game-message">{content}</div>
}

const gameStartedMessage = (pickedCards: number[], turn: number, playingColor: Color) => {
  let startingCards: string[] = [valueToCard(0, playingColor ?? Color.red)]

  pickedCards
    .sort(function (a: number, b: number) {
      return a - b
    })
    .forEach((value: number) => {
      startingCards.push(valueToCard(value, playingColor ?? Color.red))
    })

  return `Game started, ${colorNames[turn]} starts. Playing cards: ${startingCards.toString()}`
}

const reasonsName = ["agreed", "passing", "material", "time", "report", "illegal"]

const gameEndedMessage = (result: Color, way: number) => {
  return `Game ended. ${colorNames[result].toUpperCase()} won due to ${reasonsName[way]}.`
}

const reportButton = (connection: HubConnection) => {
  return (
    <IonButton
      onClick={
        () => {
          connection?.invoke("DoDecision", { type: "ReportIllegal" })
        }
      }
    >
      ⚠ Report move
    </IonButton>
  )
}

const addTimeButton = (connection: HubConnection) => {
  return (
    <IonButton
      onClick={
        () => {
          connection?.invoke("DoDecision", { type: "AddTime" })
        }
      }
    >
      + Add time
    </IonButton>
  )
}

const drawButton = (connection: HubConnection) => {
  return (
    <IonButton
      onClick={
        () => {
          connection?.invoke("DoDecision", { type: "Draw" })
        }
      }
    >
      ½ Draw
    </IonButton>
  )
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState<string>("")

  const { connection, state, playingColor } = useContext(gameContext)

  const onRecieveUserMessage = useCallback(
    (data: UserMessage) => {
      setMessages([...messages, { ...data, type: "user" }])
    },
    [messages, setMessages]
  )

  const onRecieveGameMessage = useCallback(
    (data: string) => {
      console.log(data)
      setMessages([...messages, { content: data, type: "game" }])
    },
    [messages, setMessages]
  )

  const onRecieveState = useCallback((response: any) => {
    const { startedResponse, endedResponse } = response.state

    if (startedResponse === null) {
      onRecieveGameMessage('Waiting for the other player...')
    }
    else if (endedResponse === null) {
      if (state?.startedResponse === null) return;
      const { pickedCards, turn } = startedResponse
      onRecieveGameMessage(gameStartedMessage(pickedCards, turn, playingColor ?? Color.red))
    }
    else {
      const { result, way } = endedResponse
      onRecieveGameMessage(gameEndedMessage(result, way))
    }
  }, [onRecieveGameMessage])

  const onRecieveGameStarted = useCallback((response: any) => {
    const { pickedCards, turn } = response
    onRecieveGameMessage(gameStartedMessage(pickedCards, turn, playingColor ?? Color.red))
  }, [onRecieveGameMessage])

  const onRecieveGameEnded = useCallback((response: any) => {
    const { result, way } = response
    onRecieveGameMessage(gameEndedMessage(result, way))
  }, [onRecieveGameMessage])

  const onRecieveOwnerSee = useCallback((response: any) => {
    const { card } = response.data
    onRecieveGameMessage(`Seen card: ${valueToCard(card.value, card.color)}`)
  }, [onRecieveGameMessage])

  const onRecieveAttack = useCallback((response: any) => {
    const { data } = response
    const { cardDefense } = data
    const { cardValues } = cardDefense

    const defendingCard = valueToCard(cardValues[0].value, cardValues[0].color)
    delete cardValues[0]
    var attackingCards: string[] = []

    cardValues.forEach((cardValue: any) => {
      attackingCards.push(valueToCard(cardValue.value, cardValue.color))
    });

    onRecieveGameMessage(`Attacked with: ${attackingCards.toString()}. Defended with ${defendingCard}.`,)
  }, [onRecieveGameMessage])

  useEffect(() => {
    if (connection === undefined) return

    connection.on("RecieveState", onRecieveState)
    connection.on("RecieveMessage", onRecieveUserMessage)
    connection.on("RecieveGameStarted", onRecieveGameStarted)
    connection.on("RecieveGameEnded", onRecieveGameEnded)
    connection.on("RecieveOwnerSee", onRecieveOwnerSee)
    connection.on("RecieveAttack", onRecieveAttack)

    return () => {
      connection.off("RecieveState", onRecieveState)
      connection.off("RecieveMessage", onRecieveUserMessage)
      connection.off("RecieveGameStarted", onRecieveGameStarted)
      connection.off("RecieveGameEnded", onRecieveGameEnded)
      connection.off("RecieveOwnerSee", onRecieveOwnerSee)
      connection.off("RecieveAttack", onRecieveAttack)
    }
  }, [connection, onRecieveState, onRecieveUserMessage, onRecieveGameStarted, onRecieveGameEnded, onRecieveOwnerSee])

  const sendUserMesage = useCallback(
    (message: string) => {
      if (connection === undefined || message.length < 1) return

      connection.invoke("SendMessage", message)

      setUserInput("")
    },
    [connection, setUserInput]
  )

  return (
    <div className="Chat">
      {
        connection === undefined
          ? null
          : (
            <div className="Chat-decisions">
              {reportButton(connection)}
              {addTimeButton(connection)}
              {drawButton(connection)}
            </div>
          )
      }
      <div className="Chat-messages">
        {messages.map((message, index) => {
          const { content, type } = message
          return message.type === "user" ? (
            <UserMessage
              key={index}
              username={(message as UserMessage).username}
              content={content}
              type={type}
            />
          ) : (
            <GameMessage
              key={index}
              content={content}
              type={type}
            />
          )
        })}
      </div>
      <div className="Chat-user">
        <IonTextarea
          placeholder="Write a message..."
          className="Chat-textarea"
          fill="outline"
          onIonChange={(e) => { setUserInput(e.target.value || "") }}
          value={userInput}
        />
        <IonButton
          className="Chat-button"
          disabled={playingColor === Color.none}
          onClick={() => sendUserMesage(userInput)}
        >
          <IonIcon src={send} />
        </IonButton>
      </div>
    </div>
  )
}

export default Chat