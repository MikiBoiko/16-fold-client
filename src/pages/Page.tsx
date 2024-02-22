import { IonPage, IonContent } from "@ionic/react"
import { PropsWithChildren } from "react"

const Page: React.FC = ({ children }: PropsWithChildren) => {
    return (
        <IonPage id="main-content">
            <IonContent className="ion-padding">{children}</IonContent>
        </IonPage>
    )
}

export default Page