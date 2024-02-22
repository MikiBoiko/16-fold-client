import { IonIcon, IonItem, IonLabel, IonTitle } from "@ionic/react"
import logoIcon from "../images/logo.svg"

const Logo = () => {
    return (
        <IonItem lines="none" className="ion-padding">
            <IonIcon size="large" icon={logoIcon} />
            <IonLabel style={{paddingLeft: "0.5rem", fontSize: "1.5rem", color: "var(--ion-color-dark)"}}>
                16fold.com
            </IonLabel>
        </IonItem>
    )
}

export default Logo