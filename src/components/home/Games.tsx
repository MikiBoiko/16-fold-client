import { IonButton, IonButtons, IonItem, IonLabel, IonList } from "@ionic/react"
import { useContext, useEffect, useState } from "react"
import appContext, { GameType } from "../../context/appContext"
import ProfileLink from "../ProfileLink"

type GameItemProps = { game: GameType }

const GameItem: React.FC<GameItemProps> = ({ game }) => {
    return (
        <IonItem>
            <ProfileLink username={game.rival} />
            {`(${game.format})`}
            <IonButtons slot="end">
                <IonButton color="primary" fill="outline" href={`/game/${game.tag}`}>
                    Play
                </IonButton>
            </IonButtons>
        </IonItem>
    )
}

const Games: React.FC = () => {
    const { socket, games } = useContext(appContext)

    useEffect(() => {
        if (socket === undefined) return

        socket.emit('fetch-games', {})
    }, [socket])

    const gamesMapped = games.map((game: GameType, index: number) => {
        return (
            <GameItem key={index} game={game} />
        )
    })

    return (
        <IonList inset={true} className="ion-no-padding">
            {
                games.length === 0
                    ? <IonItem className="ion-padding">No current games...</IonItem>
                    : gamesMapped
            }

        </IonList>
    )
}

export default Games