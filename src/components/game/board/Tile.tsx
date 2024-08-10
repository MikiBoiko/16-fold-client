import { useCallback, useContext, useEffect, useState } from "react"
import Card from "./Card"
import boardContext from "../../../context/boardContext"
import gameContext from "../../../context/gameContext"
import { TileState } from "../../../types/game"
import { Color, adjacentTo } from "../misc"
import attack from "../../../images/game/actions/attack.svg"
import move from "../../../images/game/actions/move.svg"
import passing from "../../../images/game/actions/passing.svg"
import see from "../../../images/game/actions/see.svg"
import "./Tile.css"

type IconDictionary = {
  [K in string]: string
}

const tileMoveIcons: IconDictionary = {
  "Attack": attack,
  "Target": attack,
  "Confirm": attack,
  "Move": move,
  "Add": move,
  "Passing": passing,
  "StartSee": see,
  "EndSee": see
}

const Tile = ({ position, value }: TileState) => {
  const hasCard: boolean = value !== undefined
  const isHidden: boolean = value === null

  const { playingColor, state } = useContext(gameContext)

  const isTurn: boolean = (state?.turn ?? -1) === (playingColor ?? -2)
  const hasEnded = state?.endedResponse !== null
  const expectedMove = state?.expectedMove || null

  const {
    action,
    onCancel,
    onSelect,
    onAttack,
    onAddToAttack,
    onDoAction
  } = useContext(boardContext)

  const [move, setMove] = useState("")

  const onClick = useCallback(() => {
    if (!isTurn) return

    switch (move) {
      case "None":
        break
      case "Move":
        if (action === undefined) return

        onDoAction({
          type: "Move",
          data: {
            from: action.data["from"] as string,
            to: position,
          },
        })
        break
      case "StartSee":
        onDoAction({
          type: "StartSee",
          data: {
            from: position
          },
        })
        break
      case "EndSee":
        onDoAction({
          type: "EndSee",
          data: {
            from: position
          },
        })
        break
      case "Cancel":
        onCancel()
        break
      case "Target":
        onAttack(position)
        break
      case "Add":
        onAddToAttack(position)
        break
      case "Select":
        onSelect(position)
        break
      case "Confirm":
        if (action === undefined) return

        onDoAction({
          type: "Attack",
          data: {
            from: action.data["from"] as string[],
            to: action.data["to"] as string,
          },
        })
        break
      case "Passing":
        onDoAction({
          type: "Passing",
          data: {
            from: action?.data["from"] as string,
          },
        })
        break
      default:
        break
    }
  }, [
    position,
    isTurn,
    action,
    move,
    onCancel,
    onSelect,
    onAttack,
    onAddToAttack,
    onDoAction,
  ])

  useEffect(() => {
    if (playingColor === Color.none || playingColor === Color.both) return

    if (isTurn === false || hasEnded === true) {
      setMove("None")
      return
    }

    if (expectedMove !== null) {
      switch (expectedMove) {
        case "EndSee":
          if(state?.lastActionResolution === null) return
          if (state?.lastActionResolution.data.position === position) {
            setMove("EndSee")
          }
          else setMove("None")
          break;
        default:
          console.error("Wrong expected move type. " + expectedMove)
          break;
      }
      return
    }

    if (action === undefined) {
      if (hasCard) {
        setMove("Select")
      } else setMove("None")
      return
    }

    switch (action.type) {
      case "Select":
        if (position === action.data.from) {
          if (position[1] === (playingColor === Color.red ? "7" : "1")) {
            setMove("Passing")
          }
          else if (isHidden === true) setMove("StartSee")
          else setMove("Cancel")
        } else if (adjacentTo(position, action.data["from"] as string)) {
          setMove(hasCard ? "Target" : "Move")
        } else setMove("Cancel")
        break
      case "Attack":
        if (position === action.data.to) setMove("Confirm")
        else if (
          hasCard &&
          adjacentTo(position, action.data.to as string) &&
          (action.data["from"] as string[]).includes(position) === false
        )
          setMove("Add")
        else setMove("Cancel")
        break
      default:
        console.error("Wrong action type.")
        break
    }
  }, [isTurn, hasEnded, isHidden, action, playingColor, hasCard, expectedMove, state, setMove])

  const moveIcon: string = tileMoveIcons[move]

  return (
    <button
      className="Tile"
      onClick={() => onClick()}
    >
      { move }
      {
        hasCard ? Card(value ?? null) : <></>
      }
      {
        action === undefined || moveIcon === undefined
          ? null
          : <img className="Tile-Icon" src={moveIcon} alt="" />
      }
    </button>
  )
}

export default Tile