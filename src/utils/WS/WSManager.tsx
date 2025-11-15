import { WSclass } from "../../../components/hooks/ws/WS_Class";
import {
  addInstance,
  addInstanceStateHandlingMessage,
  removeInstance,
} from "../../reducers/WS_Reducer";
import { store } from "../../store/reduxStore";

export function getWSInstance(baseUrl, url, onMessageCallback) {
  if (!baseUrl || !url) {
    throw new Error("baseUrl and url are required");
  }

  const wsInstances = store.getState().ws?.wsInstances || [];

  let instance = wsInstances.find((inst) => inst.key === baseUrl);

  const isClosed =
    !instance ||
    instance.ws.readyState === WebSocket.CLOSING ||
    instance.ws.readyState === WebSocket.CLOSED ||
    instance.url !== url;

  if (isClosed) {
    if (instance && instance.url !== url) {
      disconnectWS(baseUrl, true); // Force disconnect
    }
    const wsInstance = new WSclass(url);

    try {
      const removeHandler = wsInstance.connect(() => {
        if (typeof onMessageCallback === "function") {
          return wsInstance.addMessageHandler(onMessageCallback);
        }
      });

      store.dispatch(removeInstance({ key: baseUrl }));
      store.dispatch(
        addInstance({
          key: baseUrl,
          url,
          ws: wsInstance,
          handlingMessages:
            typeof onMessageCallback === "function" ? [onMessageCallback] : [],
          connected: true,
        })
      );

      return { instance: wsInstance, removeHandler };
    } catch (error) {
      console.error("Failed to create WebSocket instance:", error);
      throw error;
    }
  } else {
    if (!(instance.ws instanceof WSclass)) {
      console.error("Invalid ws instance: not a WSclass object", instance.ws);
      disconnectWS(baseUrl, true); // Force disconnect
      const wsInstance = new WSclass(url);

      try {
        const removeHandler = wsInstance.connect(() => {
          if (typeof onMessageCallback === "function") {
            return wsInstance.addMessageHandler(onMessageCallback);
          }
        });

        store.dispatch(removeInstance({ key: baseUrl }));
        store.dispatch(
          addInstance({
            key: baseUrl,
            url,
            ws: wsInstance,
            handlingMessages:
              typeof onMessageCallback === "function"
                ? [onMessageCallback]
                : [],
            connected: true,
          })
        );

        return { instance: wsInstance, removeHandler };
      } catch (error) {
        console.error("Failed to recover WebSocket instance:", error);
        throw error;
      }
    }

    if (typeof onMessageCallback === "function") {
      if (!instance.handlingMessages.includes(onMessageCallback)) {
        try {
          const removeHandler =
            instance.ws.addMessageHandler(onMessageCallback);
          store.dispatch(
            addInstanceStateHandlingMessage({
              key: baseUrl,
              handlingMessage: onMessageCallback,
            })
          );
          return { instance: instance.ws, removeHandler };
        } catch (error) {
          console.error("Failed to add message handler:", error);
          throw error;
        }
      } else {
      }
    }

    if (instance.ws.readyState !== WebSocket.OPEN) {
      try {
        instance.ws.connect();
      } catch (error) {
        console.error("Failed to reconnect WebSocket:", error);
        throw error;
      }
    }

    return { instance: instance.ws };
  }
}

export function disconnectWS(baseUrl, force = false) {
  if (!baseUrl) {
    console.warn("No baseUrl provided for disconnectWS");
    return;
  }

  const wsInstances = store.getState().ws?.wsInstances || [];
  const instance = wsInstances.find((inst) => inst.key === baseUrl);

  if (instance) {
    if (force || instance.handlingMessages.length === 0) {
      try {
        instance.ws.disconnect();
        store.dispatch(removeInstance({ key: baseUrl }));
      } catch (error) {
        console.error("Failed to disconnect WebSocket:", error);
      }
    } else {
    }
  } else {
  }
}

export function isWSConnected(baseUrl) {
  const wsInstances = store.getState().ws?.wsInstances || [];
  const instance = wsInstances.find((inst) => inst.key === baseUrl);
  return instance?.ws?.readyState === WebSocket.OPEN || false;
}
