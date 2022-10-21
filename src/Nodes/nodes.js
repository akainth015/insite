import WebHookNode from "./Input/WebHookNode";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import ClockNode from "./Output/ClockNode";
import TextNode from "./Output/TextNode";
import { Handle, Position } from "reactflow";
import FiveSTimer from "./Modification/FiveSTimer";
import CSVNode from "./Input/CSVNode";
import TableDisplayNode from "./Output/TableDisplayNode";

export const modificationNodeTypes = {
    "5ST": FiveSTimer,
};

export const inputNodeTypes = {
    "Web Hook": WebHookNode,
    "CSV File": CSVNode,
};

export const outputNodeTypes = {
    "Table Display": TableDisplayNode,
    Clock: ClockNode,
    "Text Display": TextNode,
};

const nodes = {};

const NodeIdContext = createContext(null);

export function createNode(nodeId) {
    nodes[nodeId] = {
        outputs: {},
        backtraces: {},
    };
}

export function onNewConnection({ source, sourceHandle, target, targetHandle }) {
    const backtrace = nodes[target].backtraces[targetHandle];
    backtrace.nodeId = source;
    backtrace.channel = sourceHandle;

    if (backtrace.callback) {
        backtrace.callback();
    }
}

export function useOutput(outputLabel, outputType, initialOutput = null) {
    const nodeId = useContext(NodeIdContext);

    const [output, setOutput] = useState(initialOutput);

    const outputs = nodes[nodeId].outputs;
    if (!outputs[outputLabel]) {
        outputs[outputLabel] = {
            lastValue: null,
            callbacks: new Set(),
        };
    }

    const updateFunction = useCallback(
        (value) => {
            console.debug("The update function is being called");
            setOutput(value);
            outputs[outputLabel].lastValue = value;
            for (const callback of outputs[outputLabel].callbacks) {
                callback(value);
            }
        },
        [outputLabel, outputs]
    );
    return [output, updateFunction, <Handle type={"source"} id={outputLabel} position={Position.Bottom} />];
}

export function useInput(inputLabel, inputTypes) {
    const nodeId = useContext(NodeIdContext);
    const backtraces = nodes[nodeId].backtraces;
    if (!backtraces[inputLabel]) {
        backtraces[inputLabel] = {
            callback: null,
            nodeId: null,
            channel: null,
        };
    }
    const backtrace = backtraces[inputLabel];
    const currentOutputOfISN = backtrace.nodeId ? nodes[backtrace.nodeId].outputs[backtrace.channel].lastValue : null;
    const [input, setInput] = useState(currentOutputOfISN);

    useEffect(() => {
        if (backtrace.nodeId) {
            const onIsnUpdate = () =>
                setInput(backtrace ? nodes[backtrace.nodeId].outputs[backtrace.channel].lastValue : null);
            const backtraceCallbacks = nodes[backtrace.nodeId].outputs[backtrace.channel].callbacks;
            backtraceCallbacks.add(onIsnUpdate);

            return () => backtraceCallbacks.delete(onIsnUpdate);
        } else {
            const onIsnUpdate = () => {
                const backtrace = backtraces[inputLabel];
                setInput(backtrace.nodeId ? nodes[backtrace.nodeId].outputs[backtrace.channel].lastValue : null);
            };
            backtraces[inputLabel] = {
                callback: onIsnUpdate,
            };

            return () => {
                return (backtraces[inputLabel].callback = null);
            };
        }
    }, [backtrace, backtraces, inputLabel, nodeId, backtrace.nodeId, backtrace.channel]);

    return [input, <Handle type={"target"} id={inputLabel} />];
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
