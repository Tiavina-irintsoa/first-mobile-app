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
  useIonActionSheet,
  IonActionSheet,
  IonIcon,
  IonButton,
} from "@ionic/react";
import {
  chevronDownCircleOutline,
  ellipsisHorizontalOutline,
  logoIonic,
} from "ionicons/icons";
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
  const [present] = useIonActionSheet();
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
          d["bookName"].toLowerCase().indexOf(query) > -1 ||
          d["id"].toString().indexOf(query) > -1
      )
    );
  };

  const handleSubmit = async (action, item) => {
    switch (action) {
      case "delete":
        // setData((data) => data.filter((d) => item.id != d.id));
        let newData = (data) => data.filter((d) => item.id != d.id);
        setResults(newData);
        setData(newData);
        await fetch(
          `https://deploiement-spring-boot-production.up.railway.app/books/${item["id"]}`,
          {
            method: "DELETE",
          }
        );
        break;
      default:
        console.log("Unknown action:", action);
    }
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
      setResults([...data]);
    }, 1000);
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
          <IonLoading isOpen={loading} message="Loading data..." />
        ) : (
          <IonGrid>
            <IonRow className="head">
              <IonCol size="3">Id</IonCol>
              <IonCol size="7">Name</IonCol>
              <IonCol size="2"></IonCol>
            </IonRow>
            {results.map((item, index) => (
              <IonRow key={index}>
                <IonCol size="3">{item["id"]}</IonCol>
                <IonCol size="7">{item["bookName"]}</IonCol>
                <IonCol size="2">
                  <IonIcon
                    icon={ellipsisHorizontalOutline}
                    onClick={() =>
                      present({
                        header: item["bookName"],
                        buttons: [
                          {
                            text: "Delete",
                            role: "destructive",
                            handler: () => {
                              handleSubmit("delete", item); // Envoyer des données avec l'action "delete"
                            },
                          },
                          {
                            text: "Share",
                            handler: () => {
                              handleSubmit("share", item); // Envoyer des données avec l'action "share"
                            },
                          },
                          {
                            text: "Cancel",
                            role: "cancel",
                            handler: () => {
                              handleSubmit("cancel", item); // Envoyer des données avec l'action "cancel"
                            },
                          },
                        ],
                      })
                    }
                  ></IonIcon>
                </IonCol>
              </IonRow>
            ))}
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
}

export default Liste;
