import { useContext, useEffect, useState } from "react"
import gameContext from "../../../context/gameContext"
import { GameContext } from "../../../types/game"

const parsePlayerTime = (time: number) => {
    const timeClamped = time > 0 ? time : 0

    const hours = Math.floor(timeClamped / 3600000)
        .toString()
        .padStart(2, "0")
    const minutes = Math.floor((timeClamped / 60000) % 60)
        .toString()
        .padStart(2, "0")
    const seconds = Math.floor((timeClamped / 1000) % 60)
        .toString()
        .padStart(2, "0")
    const miliseconds = Math.floor(timeClamped % 1000)
        .toString()
        .padStart(3, "0")

    return `${hours === "00" ? "" : `${hours}:`
        }${minutes}:${seconds}.${miliseconds}`
}

interface TimerProps {
    color: number,
    turn: number,
    timeLeft: number,
    timeStamp: number | undefined
}

const PlayerTimer = ({ color, turn, timeLeft, timeStamp }: TimerProps) => {
    const [time, setTime] = useState<number>(timeLeft)

    const isTurn = color === turn
    const timestampEnd = (timeStamp ?? Date.now()) + time

    useEffect(() => {
        if(timeStamp === undefined) {
            console.log(timeLeft)
            setTime(timeLeft)
            return    
        }

        const interval = setInterval(() => {
            if (isTurn) {
                console.log(timestampEnd)
                setTime(timestampEnd - Date.now())
            }
            else {

            }
        }, 100)

        return () => clearInterval(interval)

    }, [turn, timeStamp, timeLeft])

    return (
        <div>
            {parsePlayerTime(time)}
            {isTurn ? '(*)' : ''}
        </div>
    )
}

export default PlayerTimer