import { IonButton, IonCard, IonCardHeader, IonCardTitle, IonHeader, IonInput, IonItem, IonList, IonTitle } from "@ionic/react";
import { useCallback, useContext, useState } from "react";
import { Center } from "../components/Center";
import axios from "axios";
import appContext, { AppContext } from "../context/appContext";
import Logo from "../components/Logo";
import { HTTP_URL } from "../socket";

const Register: React.FC = () => {
    const [serverMessage, setServerMessage] = useState<string>()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [email, setEmail] = useState("")

    const { onAccess } = useContext<AppContext>(appContext)

    const onSend = useCallback(() => {
        console.log({
            username,
            password,
            password2,
            email
        })

        if (password !== password2) {
            setServerMessage("Passwords do not match.")
            return
        }
        axios.post(`${HTTP_URL}/access/register`, { username, password, email }, { headers: { 'content-type': 'application/x-www-form-urlencoded' } })
            .then((response) => {
                console.log(response)
                onAccess(response.data.auth)
            })
            .catch((err) => {
                console.log(err.response)
                setServerMessage(err.response.data)
            })
    }, [username, password, password2, email])

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
                            Register.
                        </IonCardTitle>
                    </IonCardHeader>
                    {
                        serverMessage !== undefined
                            ? <IonItem color="primary" fill="solid" lines="none">{serverMessage}</IonItem>
                            : null
                    }
                    <IonList className="ion-no-padding" inset={true} lines="full">
                        <IonItem>
                            <IonInput onIonInput={(e) => setUsername((e.target as HTMLIonInputElement).value as string ?? '')} labelPlacement="floating" label="Username..." />
                        </IonItem>
                        <IonItem>
                            <IonInput onIonInput={(e) => setPassword((e.target as HTMLIonInputElement).value as string ?? '')} type="password" labelPlacement="floating" label="Password..." />
                        </IonItem>
                        <IonItem>
                            <IonInput onIonInput={(e) => setPassword2((e.target as HTMLIonInputElement).value as string ?? '')} type="password" labelPlacement="floating" label="Repeat password..." />
                        </IonItem>
                        <IonItem>
                            <IonInput onIonInput={(e) => setEmail((e.target as HTMLIonInputElement).value as string ?? '')} type="email" labelPlacement="floating" label="Email..." />
                        </IonItem>
                    </IonList>
                    <IonButton expand="block" onClick={onSend}>Send</IonButton>
                    <IonButton color="tertiary" expand="block" routerLink="/login">Already have an account...</IonButton>
                </IonCard>
            </Center>
        </>
    )
};

export default Register;