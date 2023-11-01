import { useContext } from "react";
import { Color } from "./misc";
import { GameContext, PlayerState } from "../../types/game";
import gameContext from "../../context/gameContext";
import { IonButton, IonImg } from "@ionic/react";
import profile from "../../images/game/profile.png"
import "./Profile.css"
import PlayerTimer from "./profile/PlayerTimer";

interface ProfileProps {
  playerColor: Color
}

const Profile = ({ playerColor }: ProfileProps) => {
  const { state } = useContext<GameContext>(gameContext)

  if(state === undefined) return null

  const { turn, turnCount, timeStamp, playerStates } = state

  const { username, timeLeft } = playerStates[playerColor]

  return (
    <div
      className="Profile"
      style={{
        backgroundColor: playerColor === Color.red ? "var(--ion-color-primary-shade)" : "var(--ion-color-secondary)",
        color: playerColor === Color.red ? "var(--ion-color-primary-contrast)" : "var(--ion-color-secondary-contrast)"
      }}>
      <div className="Profile-tag">
        <IonImg className="Profile-icon" src={profile} alt="" />
        <div className="Profile-user">
          <div className="Profile-username">
            { username }
          </div>
          <div className="Profile-elo">
            1500?
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