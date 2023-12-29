import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonLoading,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import { chevronDownCircleOutline } from "ionicons/icons";
import "./Liste.css";
const fetchData = async (setData, setLoading) => {
  try {
    const response = await fetch(
      "https://deploiement-spring-boot-production.up.railway.app/books"
    );
    if (!response.ok) {
      throw new Error("Réponse réseau incorrecte");
    }
    const data = await response.json();
    console.log(data);
    setData(data.data);
  } catch (error) {
    console.error("Erreur lors de la récupération des données API:", error);
  } finally {
    setLoading(false);
  }
};

function Liste() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  useEffect(() => {
    fetchData(setData, setLoading);
  }, []); // Le tableau vide [] en tant que deuxième argument signifie que cela ne s'exécutera qu'une seule fois lors du montage du composant

  const handleInput = (ev: Event) => {
    let query = "";
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) {
      query = target.value!.toLowerCase();
    }

    setResults(
      data.filter(
        (d) =>
          d["bookName"].toLowerCase().indexOf(query) > -1 || d["id"].toString().indexOf(query) > -1
      )
    );
  };

  function handleRefresh(event) {
    setTimeout(() => {
      fetchData(
        setData,
        (currentLoading: boolean | ((prevState: boolean) => boolean)) => {
          // Ne change l'état de loading que si la fonction n'est pas appelée lors du rafraîchissement
          if (!event.detail) {
            setLoading(currentLoading);
          }
        }
      );
      if (event.detail) {
        event.detail.complete();
      }
    }, 2000);
    setResults([...data]);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Liste</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            debounce={300}
            onIonInput={(ev) => handleInput(ev)}
            placeholder="Search"
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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
              <IonCol size="3">Id</IonCol>
              <IonCol size="9">Name</IonCol>
            </IonRow>
            {results.map((item, index) => (
              <IonRow key={index}>
                <IonCol size="3">{item["id"]}</IonCol>
                <IonCol size="9">{item["bookName"]}</IonCol>
              </IonRow>
            ))}
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
}

export default Liste;
