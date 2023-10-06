import { IonButtons, IonContent, IonHeader, IonMenu, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';

interface NavbarData {
  title: string,
  user: string,
  content: JSX.Element
}

const Navbar = ({ title, user, content }: NavbarData) => {
  return (
    <>
      <IonMenu side="end" contentId="main-content">
        <IonHeader collapse="fade">
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">This is the menu content.</IonContent>
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
        <IonContent className="ion-padding">{content}</IonContent>
      </IonPage>
    </>
  )
}
export default Navbar