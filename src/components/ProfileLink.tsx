import { IonButton } from "@ionic/react"

type ProfileLinkProps = {
    username: string
}

const ProfileLink = ({ username }: ProfileLinkProps) => {
    return (
        <IonButton
            color="dark"
            fill="clear"
            className="ion-no-padding"
            style={{
                fontFamily: "PlayfairDisplay",
                fontSize: ".9rem"
            }}
            routerLink={`/profile/${username}`}
        >
            {username}
        </IonButton>
    )
}

export default ProfileLink