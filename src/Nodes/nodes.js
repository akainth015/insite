import WebHookNode from "./Input/WebHookNode";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import ClockNode from "./Input/ClockNode";
import TextNode from "./Output/TextNode";
import { Handle, Position } from "reactflow";
import FiveSTimer from "./Modification/FiveSTimer";
import CSVNode from "./Input/CSVNode";
import TableDisplayNode from "./Output/TableDisplayNode";
import DropNode from "./Modification/DropNode";
import WebhookIcon from "@mui/icons-material/Webhook";
import OneHot from "./Modification/OneHot";
import ConvertFloat from "./Modification/ConvertFloat";
import FillMissing from "./Modification/MissingValue";
import Correlation from "./Output/Correlation";
import FilterNode from "./Modification/Filter";
import JsonNode from "./Input/JsonNode";
import Normalization from "./Modification/Normalization";
import { ButtonNode } from "./Input/ButtonNode";
import Concatenation from "./Modification/Concatenation";
import { Tooltip } from "@mui/material";

export const nodeIcons = {
    "Web Hook": WebhookIcon,
};

export const modificationNodeTypes = {
    Concatenation: Concatenation,
    "Filter Node": FilterNode,
    "5ST": FiveSTimer,
    "OneHot Encoding": OneHot,
    "Convert to Int": ConvertFloat,
    "Fill Missing Values": FillMissing,
    Normalization: Normalization,
    "Drop Columns": DropNode,
};

export const inputNodeTypes = {
    Button: ButtonNode,
    "Web Hook": WebHookNode,
    "CSV File": CSVNode,
    "JSON File": JsonNode,
};

export const outputNodeTypes = {
    "Table Display": TableDisplayNode,
    Clock: ClockNode,
    "Text Display": TextNode,
    Correlation: Correlation,
};

const nodeStates = {};

export const NodeIdContext = createContext(null);

export function createNode(nodeId) {
    nodeStates[nodeId] = {
        backtraces: {}, // the backtrace is a mapping from the input label to the output channel of the node that provides the input
        outputs: {}, // the output dictionary stores the latest output value on each channel
    };
    return () => {
        nodeStates[nodeId] = undefined;
    };
}

export function createConnection({ source, sourceHandle, target, targetHandle }) {
    // store information about the connection for debugging purposes
    nodeStates[target].backtraces[targetHandle].source = source;
    nodeStates[target].backtraces[targetHandle].sourceHandle = sourceHandle;
    // tell the target node about the latest value emitted by the source channel
    const latestValueEmitted = nodeStates[source].outputs[sourceHandle].value;
    nodeStates[target].backtraces[targetHandle].onNewInputAvailable(latestValueEmitted);
    // create a link such that any future updates from the source are propagated to the target
    nodeStates[source].outputs[sourceHandle].listeners.push(
        nodeStates[target].backtraces[targetHandle].onNewInputAvailable
    );

    // Provide a function that can be called to undo this connection
    return () => {
        // If the target node still exists, publish an empty value to it and disconnect the nodes
        if (nodeStates[target]) {
            nodeStates[target].backtraces[targetHandle].source = null;
            nodeStates[target].backtraces[targetHandle].sourceHandle = null;
            nodeStates[target].backtraces[targetHandle].onNewInputAvailable(null);
        }

        // If the source node exists, tell it to stop notifying the target of new values
        if (nodeStates[source]) {
            nodeStates[source].outputs[sourceHandle].listeners = nodeStates[source].outputs[
                sourceHandle
            ].listeners.filter(
                (listener) => listener !== nodeStates[target].backtraces[targetHandle].onNewInputAvailable
            );
        }
    };
}

export function useOutput(label, outputType, initialOutput = null) {
    const nodeId = useContext(NodeIdContext);
    const [output, setOutput] = useState(initialOutput);

    useEffect(() => {
        nodeStates[nodeId].outputs[label] = {
            listeners: [],
            value: initialOutput,
        };
    }, [nodeId, label, initialOutput]);

    const setOutputAndPropagate = useCallback(
        (newValue) => {
            setOutput(newValue);
            nodeStates[nodeId].outputs[label].value = newValue;
            nodeStates[nodeId].outputs[label].listeners.forEach((listener) => listener(newValue));
        },
        [nodeId, label]
    );

    const rightOffset = Object.keys(nodeStates[nodeId].outputs).indexOf(label);
    const handle = (
        <>
            <Tooltip title={label}>
                <Handle
                    type={"source"}
                    id={label}
                    position={Position.Bottom}
                    style={{
                        left: `calc(100% - 20px - ${30 * rightOffset}px`,
                    }}
                />
            </Tooltip>
        </>
    );
    return [output, setOutputAndPropagate, handle];
}

export function useInput(label, inputTypes) {
    const nodeId = useContext(NodeIdContext);
    const [input, setInput] = useState(null);

    useEffect(() => {
        nodeStates[nodeId].backtraces[label] = {
            onNewInputAvailable: setInput,
        };
    }, [nodeId, label]);

    const leftOffset = Object.keys(nodeStates[nodeId].backtraces).indexOf(label);
    const handle = (
        <>
            <Tooltip title={label}>
                <Handle
                    type={"target"}
                    id={label}
                    style={{
                        left: 20 + 30 * leftOffset,
                    }}
                />
            </Tooltip>
        </>
    );
    return [input, handle];
}

// The following code allows the Node ID to be implicitly captured by our hook above
// without needing to be explicitly threaded through the various hooks and functions
// that get called

function NodeWrapper(InnerComponent) {
    return function (props) {
        return (
            <NodeIdContext.Provider value={props.id}>
                <InnerComponent {...props} />
            </NodeIdContext.Provider>
        );
    };
}

for (const nodeType in modificationNodeTypes) {
    modificationNodeTypes[nodeType] = NodeWrapper(modificationNodeTypes[nodeType]);
}

for (const nodeType in inputNodeTypes) {
    inputNodeTypes[nodeType] = NodeWrapper(inputNodeTypes[nodeType]);
}

for (const nodeType in outputNodeTypes) {
    outputNodeTypes[nodeType] = NodeWrapper(outputNodeTypes[nodeType]);
}
