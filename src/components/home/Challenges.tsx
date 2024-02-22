import { IonList, IonItem, IonLabel, IonButtons, IonButton, IonIcon } from "@ionic/react"
import { useCallback, useContext, useEffect } from "react"
import appContext, { Challenge } from "../../context/appContext"
import ProfileLink from "../ProfileLink"
import { checkmark, close } from "ionicons/icons"

const ChallengeItem = (
    { challenge, index }: {
        challenge: Challenge
        index: number
    }
) => {
    const { socket } = useContext(appContext)

    const { username, format } = challenge

    function cancelChallenge() {
        console.log('cancel')
        socket?.emit('cancel-challenge', index)
    }

    function challengeUser() {
        console.log('accept')
        socket?.emit('accept-challenge', username, format)
    }

    return (
        <IonItem>
            <ProfileLink username={username} />
            ({format})
            <IonButtons slot="end">
                <IonButton shape="round" color="success" onClick={() => { challengeUser() }}><IonIcon icon={checkmark} /></IonButton>
                <IonButton shape="round" color="danger" onClick={() => { cancelChallenge() }}><IonIcon icon={close} /></IonButton>
            </IonButtons>
        </IonItem>
    )
}

const Challenges: React.FC = () => {
    const { challenges } = useContext(appContext)

    const challengesMapped = challenges.map((challenge, index) => {
        return (
            <ChallengeItem key={index} index={index} challenge={challenge} />
        )
    })

    return (
        <>
            <IonList inset={true} className="ion-no-padding">
                {
                    challenges.length === 0
                        ? <IonItem className="ion-padding">No current challenges...</IonItem>
                        : challengesMapped
                }
            </IonList>
        </>
    )
}

export default Challenges