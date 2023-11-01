import { useCallback, useState, useContext, useEffect } from "react"
import gameContext from "../../context/gameContext"
import { Color, colorNames, valueToCard } from "./misc"
import { IonButton, IonIcon, IonTextarea } from "@ionic/react"
import { send } from 'ionicons/icons';
import { HubConnection } from "@microsoft/signalr";
import { Message, UserMessage } from "../../types/game";
import "./Chat.css"

const UserMessageElement = ({ username, content }: UserMessage) => {
  return (
    <div className="Chat-user-message">
      <strong>{username}</strong>:{" " + content}
    </div>
  )
}

const GameMessageElement = ({ content }: Message) => {
  return <div className="Chat-game-message">{content}</div>
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
  const [userInput, setUserInput] = useState<string>("")

  const { connection, playingColor, messages } = useContext(gameContext)

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
            <UserMessageElement
              key={index}
              username={(message as UserMessage).username}
              content={content}
              type={type}
            />
          ) : (
            <GameMessageElement
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