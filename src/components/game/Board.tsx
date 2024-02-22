import { useCallback, useContext, useState } from "react"
import gameContext from "../../context/gameContext"
import boardContext from "../../context/boardContext"
import { Action, GameContext } from "../../types/game"
import { Color, letters, numbers } from "./misc"
import Tile from "./board/Tile"
import "./Board.css"

const Board = () => {
  const { connection, state, viewColor } = useContext<GameContext>(gameContext)

  const board = state?.boardState

  //#region Moves
  const [action, setAction] = useState<Action | undefined>()

  const onCancel = useCallback(() => {
    setAction(undefined)
  }, [setAction])

  const onSelect = useCallback(
    (from: string) => {
      setAction({
        type: "Select",
        data: {
          from
        }
      })
    },
    [setAction]
  )

  const onAttack = useCallback(
    (to: string) => {
      if (action === undefined) return

      const attackAction: Action = {
        type: "Attack",
        data: {
          from: [action.data["from"]],
          to,
        },
      }

      setAction(attackAction)
    },
    [action]
  )

  const onAddToAttack = useCallback(
    (from: string) => {
      if (action === undefined) return

      setAction({
        ...action,
        data: {
          ...action.data,
          from: [...action.data["from"] as [], from],
        }
      })
    },
    [action]
  )

  const onDoAction = useCallback(
    (actionRequest: Action) => {
      if (connection === undefined) return

      connection.invoke("DoAction", actionRequest)
      onCancel()
    },
    [connection, onCancel]
  )
  //#endregion

  return (
    <boardContext.Provider
      value={{
        action,
        onCancel,
        onSelect,
        onAttack,
        onAddToAttack,
        onDoAction,
      }}
    >
      <div
        className="Board"
        style={{
          flexDirection: viewColor === Color.red
            ? "column"
            : "column-reverse"
        }}
      >
        {
          numbers.map((number, row) => {
            return (
              <div
                key={row}
                className="Board-row"
                style={{
                  flexDirection: viewColor === Color.red
                    ? "row"
                    : "row-reverse"
                }}
              >
                {
                  letters.map((letter, column) => {
                    const position = letter + number
                    const value = board !== undefined && position in (board || {})
                      ? (board || {})[position]
                      : undefined
                    const index = row * 7 + column

                    return (
                      <div
                        key={column}
                        className="Board-column"
                        style={{
                          backgroundColor: index % 2 === 0
                            ? "var(--ion-color-tertiary)"
                            : "var(--ion-color-tertiary-tint)"
                        }}>
                        <Tile
                          position={position}
                          value={value}
                        />
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    </boardContext.Provider>
  )
}

export default Board