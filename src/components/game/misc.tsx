import { BoardPositions } from "../../types/game"

enum Color { red = 0, black = 1, none = 2, both = 3 }
const colorNames = ["red", "black", "none", "both"]

const numbers = ["7", "6", "5", "4", "3", "2", "1"]
const letters = ["a", "b", "c", "d"]

const values = [
  "Jk",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
]

type ColorDictionary<T extends number, U> = {
  [K in T]: U
}

const symbols: ColorDictionary<Color, string[]> = {
  [Color.red]: ["♥", "♦"],
  [Color.black]: ["♣", "♠"],
  [Color.none]: [],
  [Color.both]: []
}

function valueToCard(value: number, color: Color) {
  if(value === 0) return "Jk"
  return values[Math.floor((value / 2) - 1)] + (value > 0 ? symbols[color][value % 2] : "")
}

function adjacentTo(a: string, b: string) {
  if (a === b) return false

  const xa = letters.indexOf(a[0]),
    xb = letters.indexOf(b[0])

  const ya = numbers.indexOf(a[1]),
    yb = numbers.indexOf(b[1])

  return Math.abs(xa - xb) <= 1 && Math.abs(ya - yb) <= 1
}

const initialBoardState: BoardPositions = {
  "a1": null,
  "a3": null,
  "a5": null,
  "a7": null,
  "b1": null,
  "b3": null,
  "b5": null,
  "b7": null,
  "c1": null,
  "c3": null,
  "c5": null,
  "c7": null,
  "d1": null,
  "d3": null,
  "d5": null,
  "d7": null,
}

export { Color, colorNames, valueToCard, adjacentTo, numbers, letters, initialBoardState }