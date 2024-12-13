import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import HomeDuenio from "./pages/HomeDuenio";
import HomeCliente from "./pages/HomeCliente";
import HomeMozo from "./pages/HomeMozo";
import HomeChef from "./pages/HomeChef";
import HomeBar from "./pages/HomeBar";
import HomeMaitre from "./pages/HomeMaitre";

import { useEffect } from "react";
import { PushNotifications } from "@capacitor/push-notifications";
import Encuestas from "./pages/Encuestas";

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    if (isAndroid()) {
      setupPushNotifications();
      addListeners();
    }
  }, []);

  const isAndroid = () => {
    return /Android/i.test(navigator.userAgent);
  };

  const setupPushNotifications = async () => {
    const permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === "prompt") {
      const newStatus = await PushNotifications.requestPermissions();
      if (newStatus.receive !== "granted") {
        console.error("User denied permissions for push notifications");
        return;
      }
    }

    if (permStatus.receive === "granted") {
      console.log("User granted permissions for push notifications");
    }

    await PushNotifications.register();
  };

  const addListeners = async () => {
    // Listener para el registro del token
    await PushNotifications.addListener("registration", (token) => {
      console.log("Registration token:", token.value);
    });

    // Listener para errores de registro
    await PushNotifications.addListener("registrationError", (err) => {
      console.error("Registration error:", err.error);
    });

    // Listener para notificaciones recibidas en primer plano
    await PushNotifications.addListener("pushNotificationReceived", (notification) => {
      console.log("Push notification received:", notification);
    });

    // Listener para interacción con la notificación
    await PushNotifications.addListener("pushNotificationActionPerformed", (notification) => {
      console.log("Push notification interaction performed:", notification);
    });
  };

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          {/* HOMES */}
          <Route exact path="/homeduenio">
            <HomeDuenio />
          </Route>
          <Route exact path="/homecliente">
            <HomeCliente />
          </Route>
          <Route exact path="/homemozo">
            <HomeMozo />
          </Route>
          <Route exact path="/homechef">
            <HomeChef />
          </Route>
          <Route exact path="/homebar">
            <HomeBar />
          </Route>
          <Route exact path="/homemaitre">
            <HomeMaitre />
          </Route>
          {/* Fin de HOMES */}
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route exact path="/encuestas/:email">
            <Encuestas />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
