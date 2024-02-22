import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonCard } from "@ionic/react"
import boardIcon from "../../images/game/navegation/board.svg"
import chatIcon from "../../images/game/navegation/chat.svg"
import { Redirect, Route, useParams } from "react-router"

type GameLayoutProps = {
    game: JSX.Element
    chat: JSX.Element
}

const CardLayout = ({ game, chat }: GameLayoutProps) => {
    return (
        <IonCard id="chat" className="ion-padding">

        </IonCard>
    )
}

const TabLayout = ({ game, chat }: GameLayoutProps) => {
    const { tag } = useParams<{ tag: string }>()

    return (
        <IonTabs>
            <IonRouterOutlet>
                <Redirect from={`/game/:tag`} to={`/game/${tag}/board`} />
                <Route exact path="/game/:tag/board/">
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <div
                            style={{
                                aspectRatio: "4/6.5",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                maxHeight: "100%",
                                maxWidth: "calc(100% - .5rem)"
                            }}
                        >
                            {game}
                        </div>
                    </div>
                </Route>
                <Route exact path="/game/:tag/chat/">
                    {chat}
                </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
                <IonTabButton tab="board" href={`/game/${tag}/board`}>
                    <IonIcon icon={boardIcon} />
                    <IonLabel>Board</IonLabel>
                </IonTabButton>
                <IonTabButton tab="chat" href={`/game/${tag}/chat`}>
                    <IonIcon icon={chatIcon} />
                    <IonLabel>Chat</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    )
}

export { TabLayout }