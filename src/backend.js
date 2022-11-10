import { io } from "socket.io-client";
import { NodeIdContext } from "./Nodes/nodes";
import { useCallback, useContext } from "react";

let backendUrl = "http://localhost:5000/";
export const socket = io(backendUrl);

export function useSocketIoChannel(channelName) {
    const nodeId = useContext(NodeIdContext);

    function emitOnChannel() {
        socket.emit(channelName, nodeId, ...arguments);
    }

    function register(eventHandler) {
        socket.on(channelName, function (data) {
            if (eventHandler._isActive === true && data.nodeId === nodeId) {
                eventHandler(data);
            }
        });

        return () => (eventHandler._isActive = false);
    }

    return [useCallback(emitOnChannel, [channelName, nodeId]), useCallback(register, [channelName, nodeId])];
}

socket.once("connect", function () {
    console.log(`Successfully connected to the backend at ${backendUrl}`);
});

socket.on("logs", console.log);
