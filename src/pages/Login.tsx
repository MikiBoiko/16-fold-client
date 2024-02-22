import { IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonInput, IonItem, IonList, IonTitle } from "@ionic/react";
import { useCallback, useContext, useState } from "react";
import { Center } from "../components/Center";
import axios from "axios";
import appContext, { AppContext } from "../context/appContext";
import Logo from "../components/Logo";
import { HTTP_URL } from "../socket";

const Login: React.FC = () => {
    const [serverMessage, setServerMessage] = useState<string>()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const { onAccess } = useContext<AppContext>(appContext)

    const onSend = useCallback(() => {
        axios.post(`${HTTP_URL}/access/login`, { username, password }, { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
            .then((response) => {
                console.log(response)
                onAccess(response.data.auth)
            })
            .catch((err) => {
                console.log(err.response)
                setServerMessage(err.response.data)
            })
    }, [username, password])

    return (
        <>
            <IonHeader className="ion-no-border">
                <Center>
                    <Logo />
                </Center>
            </IonHeader>
            <Center>
                <IonCard className="Access-card ion-padding">
                    <IonCardHeader>
                        <IonCardTitle>
                            Login.
                        </IonCardTitle>
                    </IonCardHeader>
                    {
                        serverMessage !== undefined
                            ? <IonItem color="warning" fill="outline" lines="none">{serverMessage}</IonItem>
                            : null
                    }
                    <IonList className="ion-no-padding" inset={true} lines="full">
                        <IonItem>
                            <IonInput onIonChange={(e) => setUsername(e.detail.value ?? '')} labelPlacement="floating" label="Username..." />
                        </IonItem>
                        <IonItem>
                            <IonInput onIonChange={(e) => setPassword(e.detail.value ?? '')} type="password" labelPlacement="floating" label="Password..." />
                        </IonItem>
                    </IonList>
                    <IonButton expand="block" onClick={onSend}>Send</IonButton>
                    <IonButton color="tertiary" expand="block" routerLink="/register">Create an account...</IonButton>
                </IonCard>
            </Center>
        </>
    )
};

export default Login;