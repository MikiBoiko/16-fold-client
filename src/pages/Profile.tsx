import { useContext, useEffect, useState } from "react"
import appContext from "../context/appContext"
import { useParams } from "react-router"
import { IonAvatar, IonButton, IonImg, IonProgressBar } from "@ionic/react"
import axios from "axios"
import { HTTP_URL } from "../socket"
import ProfileIcon from "../components/ProfileIcon"

const Profile: React.FC = () => {
    const { user, onAccess } = useContext(appContext)
    const { of } = useParams<{ of: string }>()

    console.log(of)

    const [userProfile, setUserProfile] = useState<{ username: string }>()

    useEffect(() => {
        axios.get(`${HTTP_URL}/users/profile`, { params: { username: of } })
            .then((response: any) => {
                const { data } = response
                setUserProfile(data)
            })
            .catch((err: string) => {
                console.error(err)
            })
    }, [of])

    if (userProfile === undefined) {
        return <IonProgressBar type="indeterminate" />
    }

    const isLocal = user?.username === userProfile.username

    return (
        <>
            <ProfileIcon className="" />
            <h1>
                {userProfile.username}
            </h1>
            {
                isLocal === true
                    ? <IonButton onClick={() => { onAccess(null) }}>Log Out</IonButton>
                    : null
            }
        </>
    )
}

export default Profile