import { IonList, IonItem, IonInput, IonIcon, IonLabel, IonButtons, IonButton } from "@ionic/react"
import axios from "axios"
import { search } from "ionicons/icons"
import { useCallback, useContext, useEffect, useState } from "react"
import appContext from "../../context/appContext"
import { HTTP_URL } from "../../socket"
import ProfileLink from "../ProfileLink"

type UserFoundType = { username: string, connected: boolean }

const UserFound = ({ username, connected }: UserFoundType) => {
    const { user, socket } = useContext(appContext)

    function challengeUser() {
        socket?.emit('send-challenge', username)
        console.log('challenging ' + username)
    }

    return (
        <IonItem lines="none">
            <ProfileLink username={username} />
            <IonButtons slot="end">
                <IonButton color="primary" fill="outline" onClick={challengeUser} disabled={!connected || username === user?.username}>
                    Challenge
                </IonButton>
            </IonButtons>
        </IonItem>
    )
}

const FindUser = () => {
    const [username, setUsername] = useState<string>()
    const [usersFound, setUsersFound] = useState<UserFoundType[]>()

    const seachUsers = () => {
        axios.get(`${HTTP_URL}/users/search`, { params: { username } })
            .then((response: any) => {
                console.log(response)
                setUsersFound(response.data)
            })
            .catch((err: string) => {
                console.error(err)
            })
    }

    useEffect(() => {
        if (username === undefined || username.length === 0)
            return

        seachUsers()
    }, [username])

    return (
        <>
            <IonList className="ion-no-padding" inset={true}>
                <IonItem>
                    <IonInput onIonChange={(e) => setUsername(e.detail.value ?? '')} labelPlacement="floating" label="Username..." />
                    <IonButton shape="round" fill="clear" onClick={seachUsers}>
                        <IonIcon icon={search} />
                    </IonButton>
                </IonItem>
            </IonList>
            <IonList className="ion-no-padding" inset={true}>
                {
                    usersFound?.map((userFound, index) => {
                        const { connected, username } = userFound
                        return <UserFound key={index} connected={connected} username={username} />
                    })
                }
            </IonList>
        </>
    )
}

export default FindUser