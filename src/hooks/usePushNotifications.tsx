import { useEffect } from "react";
import { PushNotifications, Token } from "@capacitor/push-notifications";

interface usePushNotificationsProps {
  enabled: boolean;
  title: string;
  body: string;
}

const usePushNotifications = ({
  enabled,
  title,
  body,
}: usePushNotificationsProps) => {
  useEffect(() => {
    if (!enabled) return; // Salir si `enabled` es falso

    alert("Registrando notificaciones push...");

    // Solicita permiso para enviar notificaciones
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === "granted") {
        PushNotifications.register();
      } else {
        alert("Permiso denegado para notificaciones");
      }
    });

    // Maneja el token generado
    const handleRegistration = (token: Token) => {
      alert("Token del dispositivo:" + token.value);
      enviarTokenAlServidor({ token: token.value, title, body });
    };

    const handleError = (error: any) => {
      alert("Error en el registro:" + error);
    };

    const handleNotification = (notification: any) => {
      alert("Notificación recibida:" + notification);
    };

    PushNotifications.addListener("registration", handleRegistration);
    PushNotifications.addListener("registrationError", handleError);
    PushNotifications.addListener(
      "pushNotificationReceived",
      handleNotification
    );

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, [enabled, title, body]);

  const enviarTokenAlServidor = async ({
    token,
    title,
    body,
  }: {
    token: string;
    title: string;
    body: string;
  }) => {
    try {
      const response = await fetch(
        "https://comanda-backend.vercel.app/api/notify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, body, token }),
        }
      );
      if (response.ok) {
        alert("Token enviado exitosamente");
      } else {
        alert("Error enviando token al servidor:" + response.status);
        let data = await response.json();
        alert("JSON: " + JSON.stringify(data));
      }
    } catch (error) {
      alert("Error en la solicitud:" + error);
    }
  };
};

export default usePushNotifications;
