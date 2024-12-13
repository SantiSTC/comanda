import { useEffect } from "react";
import { PushNotifications, Token } from "@capacitor/push-notifications";

interface usePushNotificationsProps {
  enabled: boolean;
  title: string;
  body: string;
}

const usePushNotifications = ({ enabled, title, body }: usePushNotificationsProps) => {
  useEffect(() => {
    if (!enabled) return; // Si no está habilitado, no hacer nada

    alert("Iniciando notificaciones push");

    // Solicita permiso para enviar notificaciones
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === "granted") {
        PushNotifications.register();
      } else {
        console.error("Permiso denegado para notificaciones");
      }
    });

    // Maneja el token generado
    PushNotifications.addListener("registration", (token: Token) => {
      alert("Token del dispositivo:" + token.value);
      enviarTokenAlServidor({ token: token.value, title, body }); // Función para enviar el token al servidor
    });

    // Maneja errores durante el registro
    PushNotifications.addListener("registrationError", (error) => {
      alert("Error en el registro:" + error);
    });

    // Maneja la recepción de una notificación
    PushNotifications.addListener("pushNotificationReceived", (notification) => {
      alert("Notificación recibida:" + notification);
    });

    // Maneja la interacción con una notificación
    PushNotifications.addListener("pushNotificationActionPerformed", (notification) => {
      alert("Notificación interactuada:" + notification);
    });
  }, [enabled]);

  const enviarTokenAlServidor = async ({ token, title, body }: { token: string; title: string; body: string }) => {
    try {
      const response = await fetch("https://comanda-backend.vercel.app/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body, token }),
      });
      if (response.ok) {
        alert("Token enviado exitosamente");
      } else {
        alert("Error enviando token al servidor:" + response.status);
      }
    } catch (error) {
      alert("Error en la solicitud:" + error);
    }
  };
};

export default usePushNotifications;
