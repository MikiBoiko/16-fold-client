import { IonChip } from "@ionic/react"
import { useEffect, useState } from "react"

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
    turnCount: number,
    timeLeft: number,
    timeStamp: Date
}

const PlayerTimer = ({ color, turn, turnCount, timeLeft, timeStamp }: TimerProps) => {
    const [time, setTime] = useState<number>(timeLeft)

    const timestampEnd: number = timeStamp.getTime() + timeLeft
    const isTurn = color === turn

    useEffect(() => {
        if (!isTurn || turnCount < 2) return

        const interval = setInterval(() => {
            setTime(timestampEnd - Date.now())
        }, 100)

        return () => clearInterval(interval)
    }, [timestampEnd, isTurn, turnCount])

    return (
        <IonChip style={{ backgroundColor: '#00000088' }} slot="end" color="red" disabled={!isTurn}>
            {parsePlayerTime(time)}
        </IonChip>
    )
}

export default PlayerTimer