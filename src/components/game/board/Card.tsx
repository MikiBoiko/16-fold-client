import { CardState } from "../../../types/game";
import { Color, valueToCard } from "../misc";
import "./Card.css"

const Card = (card: CardState | null) => {
  const isHidden: boolean = card === null

  if (isHidden) {
    return (
      <div className="Card" />
    )
  }

  const { value, color } = card || {}

  return (
    <div
      className="Card"
      style={{
        backgroundImage: "none",
        border: "1px solid var(--ion-color-medium-tint)",
        color: color === Color.red
          ? "var(--ion-color-primary-shade)"
          : "var(--ion-color-secondary-shade)"
      }}
    >
      <div className="Card-value">
        {
          valueToCard(value || 0, color || Color.red)
        }
      </div>
    </div>
  )
}

export default Card