import { IonProgressBar } from "@ionic/react"
import { Center } from "./Center"
import Logo from "./Logo"

const LoadingScreen = () => {
    return (
        <>
            <Center>
                <Logo />
            </Center>
            <IonProgressBar type="indeterminate" />
        </>
    )
}

export default LoadingScreen