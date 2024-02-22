import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonList } from "@ionic/react";
import { Center } from "../components/Center";
import FindUser from "../components/home/FindUser";
import Challenges from "../components/home/Challenges";
import Games from "../components/home/Games";


const Home: React.FC = () => {
  const columnStyle = {display: "grid", gridTemplateColumns: "33% 33% 33%"}
  const verticalStyle = {} 

  return (
    <div style={verticalStyle}>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Find user...</IonCardTitle>
        </IonCardHeader>
        <IonCardContent className="ion-no-padding">
          <FindUser />
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Challenges...</IonCardTitle>
        </IonCardHeader>
        <IonCardContent className="ion-no-padding">
          <Challenges />
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Games...</IonCardTitle>
        </IonCardHeader>
        <IonCardContent className="ion-no-padding">
          <Games />
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default Home;
