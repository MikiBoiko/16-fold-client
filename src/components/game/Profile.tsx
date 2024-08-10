import { useContext } from "react";
import { Color } from "./misc";
import { GameContext, PlayerState } from "../../types/game";
import gameContext from "../../context/gameContext";
import { IonButton, IonImg } from "@ionic/react";
import profile from "../../images/profile.png"
import "./Profile.css"
import PlayerTimer from "./profile/PlayerTimer";
import ProfileLink from "../ProfileLink";
import ProfileIcon from "../ProfileIcon";

interface ProfileProps {
  playerColor: Color
}

const Profile = ({ playerColor }: ProfileProps) => {
  const { state, data } = useContext<GameContext>(gameContext)

  if(state === undefined || data === undefined) return null

  const { redUsername, blackUsername } = data

  const { turn, turnCount, timeStamp, playerStates } = state

  const { timeLeft } = playerStates[playerColor]
  const username = playerColor === Color.red ? redUsername : blackUsername
  const gameEnded = state.endedResponse !== null

  return (
    <div
      className="Profile"
      style={{
        backgroundColor: playerColor === Color.red ? "var(--ion-color-primary-shade)" : "var(--ion-color-black-shade)",
        color: playerColor === Color.red ? "var(--ion-color-primary-contrast)" : "var(--ion-color-black-contrast)"
      }}>
      <div className="Profile-tag">
        <ProfileIcon className="Profile-icon" />
        <div className="Profile-user">
          <div className="Profile-username">
            <ProfileLink username={username} />
          </div>
          <div className="Profile-elo">
            · (1500?)
          </div>
        </div>
      </div>
      {
        state === undefined
          ? null
          : (
            <PlayerTimer
              color={playerColor}
              turn={turn || 0}
              turnCount={turnCount || 0}
              timeStamp={timeStamp}
              timeLeft={timeLeft}
            />
          )
      }
    </div>
  )
}

export default Profile