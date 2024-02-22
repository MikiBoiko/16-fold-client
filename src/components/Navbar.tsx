import { IonButtons, IonContent, IonFooter, IonHeader, IonItem, IonList, IonMenu, IonMenuButton, IonNavLink, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useContext } from 'react';
import appContext from '../context/appContext';

interface NavbarData extends React.PropsWithChildren {
  title: string | JSX.Element,
  children: JSX.Element | React.ReactNode
}

const Navbar = ({ title, children }: NavbarData) => {
  const { user } = useContext(appContext)

  return (
    <>
      <IonMenu side="end" contentId="main-content">
        <IonHeader collapse="fade">
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem routerLink='/home'>
              Home
            </IonItem>
            <IonItem routerLink={`/profile/${user?.username}`}>
              {user?.username}
            </IonItem>
          </IonList>
        </IonContent>
        <IonFooter><div style={{ fontSize: '0.7rem', padding: '0.25rem' }}>Created by Luis Vizán and Miguel Montero.</div></IonFooter>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot='end'>
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">{children}</IonContent>
      </IonPage>
    </>
  )
}
export default Navbar