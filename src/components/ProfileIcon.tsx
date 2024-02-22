import { IonAvatar } from "@ionic/react"
import profile from "../images/profile.png"

const ProfileIcon = ({className = ""}: {className: string}) => {
    return (
        <IonAvatar style={{ width: "2rem", height: "2rem" }}>
            <img className={className} src={profile} alt="" />
        </IonAvatar>
    )
}

export default ProfileIcon