import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRow,
  IonCol,
  IonGrid,
  IonSearchbar,
  IonLoading,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import "./Liste.css";
import { useState, useEffect } from "react";
import { chevronDownCircleOutline } from "ionicons/icons";

function Liste() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://datausa.io/api/data?drilldowns=Nation&measures=Population"
        );
        if (!response.ok) {
          throw new Error("Réponse réseau incorrecte");
        }
        const data = await response.json();
        setData(data.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Le tableau vide [] en tant que deuxième argument signifie que cela ne s'exécutera qu'une seule fois lors du montage du composant
  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    setTimeout(() => {
      // Any calls to load data go here
      event.detail.complete();
    }, 2000);
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Liste</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar placeholder="Search"></IonSearchbar>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            pullingText="Pull to refresh"
            refreshingSpinner="circles"
            refreshingText="Refreshing..."
          ></IonRefresherContent>
        </IonRefresher>

        {loading ? (
          <IonLoading isOpen={loading} message="Chargement des données..." />
        ) : (
          <IonGrid>
            <IonRow className="head">
              <IonCol size="5">Nation</IonCol>
              <IonCol size="3">Population</IonCol>
              <IonCol size="4">Slug-Nations</IonCol>
            </IonRow>
            {data.map((item) => (
              <IonRow>
                <IonCol size="5">{item["Nation"]}</IonCol>
                <IonCol size="3">{item["Population"]}</IonCol>
                <IonCol size="4">{item["Slug Nation"]}</IonCol>
              </IonRow>
            ))}
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
}
export default Liste;
