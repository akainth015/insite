import { io } from "socket.io-client";
import { NodeIdContext } from "./Nodes/nodes";
import { useCallback, useContext } from "react";

export const backendUrl = "https://insiteserver.hop.sh/";
export const socket = io(backendUrl);

export function useSocketIoChannel(channelName) {
    const nodeId = useContext(NodeIdContext);

    function emitOnChannel() {
        socket.emit(channelName, nodeId, ...arguments);
    }

    function register(eventHandler) {
        eventHandler._isActive = true;
        socket.on(channelName, function (msgNodeId) {
            if (eventHandler._isActive === true && msgNodeId === nodeId) {
                eventHandler(...[...arguments].slice(1));
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
