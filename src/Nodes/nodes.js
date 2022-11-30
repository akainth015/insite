import WebHookNode from "./Input/WebHookNode";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import AnalysisNode from "./Modification/AnalysisNode";
import ClockNode from "./Input/ClockNode";
import TextNode from "./Output/TextNode";
import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import FiveSTimer from "./Modification/FiveSTimer";
import CsvNode from "./Input/CsvNode";
import TableDisplayNode from "./Output/TableDisplayNode";
import FilterColumnsNode from "./Modification/FilterColumnsNode";
import OneHot from "./Modification/OneHot";
import ConvertToNumberNode from "./Modification/ConvertToNumberNode";
import FillMissing from "./Modification/MissingValue";
import Correlation from "./Output/Correlation";
import FilterValuesNode from "./Modification/FilterValuesNode";
import JsonNode from "./Input/JsonNode";
import Normalization from "./Modification/MinMaxNormalization";
import { ButtonNode } from "./Input/ButtonNode";
import { Code, DataObject, Webhook } from "@mui/icons-material";
import MergeNode from "./Modification/MergeNode";
import EdgeDetectionNode from "./Modification/EdgeDetectionNode";
import TextTokenization from "./Modification/TextTokenization";
import TextInputNode from "./Input/TextInputNode";
import HistogramChart from "./Output/HistogramChart";
import LineChart from "./Output/LineChart";
import WordCloudChart from "./Output/WordCloudNode";
import { Tooltip } from "@mui/material";
import AggregateNode from "./Modification/AggregateNode";
import PieChart from "./Output/PieChart";
import JSONParser from "./Modification/JsonParser.js";
import JQNode from "./Modification/JQNode.js";
import StringArrayBuilderNode from "./Modification/StringArrayBuilderNode";
import NumberArrayBuilderNode from "./Modification/NumberArrayBuilderNode";
import BooleanArrayBuilderNode from "./Modification/BooleanArrayBuilderNode";

export const nodeIcons = {
    "CSV File": Code,
    "JSON File": DataObject,
    "Web Hook": Webhook,
};

export const modificationNodeTypes = {
    "Natural Language Analysis": AnalysisNode,
    "Merge Values": MergeNode,
    "Change Detector": EdgeDetectionNode,
    Aggregator: AggregateNode,
    "Filter Values": FilterValuesNode,
    "5ST": FiveSTimer,
    "OneHot Encoding": OneHot,
    "Convert to Int": ConvertToNumberNode,
    "Handle Missing Values": FillMissing,
    Normalization: Normalization,
    "Filter Columns": FilterColumnsNode,
    "Drop Columns": FilterColumnsNode,
    "Text Tokenization": TextTokenization,
    "Json Parse Node": JSONParser,
    "JQ Node": JQNode,
    "String Array Builder": StringArrayBuilderNode,
    "Number Array Builder": NumberArrayBuilderNode,
    "Boolean Array Builder": BooleanArrayBuilderNode,
};

export const inputNodeTypes = {
    Button: ButtonNode,
    "Web Hook": WebHookNode,
    "CSV File": CsvNode,
    "JSON File": JsonNode,
    "Text File": TextInputNode,
};

export const outputNodeTypes = {
    "Table Display": TableDisplayNode,
    Clock: ClockNode,
    "Text Display": TextNode,
    Correlation: Correlation,
    "Histogram Chart Display": HistogramChart,
    "Line Chart Display": LineChart,
    "Word Cloud Display": WordCloudChart,
    "Pie Chart": PieChart,
};

let nodeStates = {};

export function setNodesState(state) {
    nodeStates = state;
}

export function setNodeValues(state) {
    for (const source of Object.keys(state)) {
        for (const sourceHandle of Object.keys(state[source])) {
            nodeStates[source].outputs[sourceHandle].value = state[source][sourceHandle];
        }
    }
}

export const NodeIdContext = createContext(null);

export function createNode(nodeId) {
    nodeStates[nodeId] = nodeStates[nodeId] || {
        backtraces: {}, // the backtrace is a mapping from the input label to the output channel of the node that provides the input
        outputs: {}, // the output dictionary stores the latest output value on each channel
        settings: {}, // the serializable settings for nodes
    };
    return () => {
        delete nodeStates[nodeId];
    };
}

export function getAllCurrentValues() {
    const returnObject = {};
    for (const source of Object.keys(nodeStates)) {
        for (const sourceHandle of Object.keys(nodeStates[source].outputs)) {
            returnObject[source] = {};
            returnObject[source][sourceHandle] = nodeStates[source].outputs[sourceHandle].value;
        }
    }
    return returnObject;
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
    const updateNodeInternals = useUpdateNodeInternals();
    const [output, setOutput] = useState(initialOutput);

    useEffect(() => {
        nodeStates[nodeId].outputs[label] = nodeStates[nodeId].outputs[label] || {
            listeners: [],
            value: initialOutput,
        };
        nodeStates[nodeId].outputs[label].outputType = outputType;
        setTimeout(updateNodeInternals, 15, nodeId);
    }, [nodeId, label, initialOutput, updateNodeInternals, outputType]);

    useEffect(() => {
        nodeStates[nodeId].outputs[label].value = output;
        nodeStates[nodeId].outputs[label].listeners.forEach((listener) => listener(output));
    }, [label, nodeId, output]);

    const setOutputAndPropagate = useCallback((newValue) => {
        setOutput(newValue);
    }, []);

    function isValidConnection({ target, targetHandle }) {
        const inputTypes = nodeStates[target].backtraces[targetHandle].inputTypes;
        return inputTypes === "any" || outputType === "any" || inputTypes.indexOf(outputType) > -1;
    }

    const rightOffset = Object.keys(nodeStates[nodeId].outputs).indexOf(label);
    const handle = (
        <>
            <Tooltip title={label}>
                <Handle
                    type={"source"}
                    id={label}
                    isValidConnection={isValidConnection}
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
    const updateNodeInternals = useUpdateNodeInternals();
    const [input, setInput] = useState(null);

    useEffect(() => {
        nodeStates[nodeId].backtraces[label] = nodeStates[nodeId].backtraces[label] || {
            onNewInputAvailable: (newInput) => {
                setInput(structuredClone(newInput));
            },
        };
        nodeStates[nodeId].backtraces[label].inputTypes = inputTypes;

        setTimeout(updateNodeInternals, 30, nodeId);
    }, [nodeId, label, updateNodeInternals, inputTypes]);

    const { source, sourceHandle } = nodeStates[nodeId].backtraces[label] || {
        source: null,
        sourceHandle: null,
    };

    let inputType = null;
    let niceName = sourceHandle;
    if (source && sourceHandle) {
        inputType = nodeStates[source].outputs[sourceHandle].outputType;
    }

    function isValidConnection({ source, sourceHandle }) {
        const oType = nodeStates[source].outputs[sourceHandle].outputType;
        return inputTypes === "any" || oType === "any" || inputTypes.indexOf(oType) > -1;
    }

    const leftOffset = Object.keys(nodeStates[nodeId].backtraces).indexOf(label);
    const handle = (
        <>
            <Tooltip title={label}>
                <Handle
                    type={"target"}
                    id={label}
                    isValidConnection={isValidConnection}
                    style={{
                        left: 20 + 30 * leftOffset,
                    }}
                />
            </Tooltip>
        </>
    );
    return [input, handle, inputType, niceName];
}

// A strict input can be used to run a function every time an output is published,
// even when the value is not changed.
export function useStrictInput(label, inputTypes) {
    const nodeId = useContext(NodeIdContext);
    const updateNodeInternals = useUpdateNodeInternals();
    const listeners = useRef([]);
    const [inputType, setInputType] = useState(null);
    const [niceName, setNiceName] = useState(null);

    useEffect(() => {
        nodeStates[nodeId].backtraces[label] = nodeStates[nodeId].backtraces[label] || {
            onNewInputAvailable(newValue) {
                const { source, sourceHandle } = nodeStates[nodeId].backtraces[label] || {
                    source: null,
                    sourceHandle: null,
                };

                let inputType = null;
                let niceName = sourceHandle;
                if (source && sourceHandle) {
                    inputType = nodeStates[source].outputs[sourceHandle].outputType;
                }
                setInputType(inputType);
                setNiceName(niceName);

                listeners.current.forEach((listener) => {
                    listener(structuredClone(newValue));
                });
            },
        };
        nodeStates[nodeId].backtraces[label].inputTypes = inputTypes;
        setTimeout(updateNodeInternals, 15, nodeId);
    }, [nodeId, label, updateNodeInternals, inputTypes]);

    const subscribeChanges = useCallback(
        (listener) => {
            listeners.current.push(listener);

            const { source, sourceHandle } = nodeStates[nodeId].backtraces[label] || {
                source: null,
                sourceHandle: null,
            };
            if (source && sourceHandle) {
                listener(nodeStates[source].outputs[sourceHandle].value);
            }

            return () => {
                listeners.current = listeners.current.filter((it) => it !== listener);
            };
        },
        [label, nodeId]
    );

    function isValidConnection({ source, sourceHandle }) {
        const oType = nodeStates[source].outputs[sourceHandle].outputType;
        return inputTypes === "any" || oType === "any" || inputTypes.indexOf(oType) > -1;
    }

    const leftOffset = Object.keys(nodeStates[nodeId].backtraces).indexOf(label);
    const handle = (
        <>
            <Tooltip title={label}>
                <Handle
                    type={"target"}
                    id={label}
                    isValidConnection={isValidConnection}
                    style={{
                        left: 20 + 30 * leftOffset,
                    }}
                />
            </Tooltip>
        </>
    );
    return [subscribeChanges, handle, inputType, niceName];
}

export function useSetting(settingName, defaultValue) {
    const nodeId = useContext(NodeIdContext);
    const [setting, setSetting] = useState(defaultValue);

    useEffect(() => {
        nodeStates[nodeId].settings[settingName] = nodeStates[nodeId].settings[settingName] || {
            onUpdate: setSetting,
            value: defaultValue,
        };
    }, [nodeId, defaultValue, settingName]);

    useEffect(() => {
        nodeStates[nodeId].settings[settingName].value = setting;
    }, [nodeId, setting, settingName]);

    return [setting, setSetting];
}

// The following code allows the Node ID to be implicitly captured by our hook above
// without needing to be explicitly threaded through the various hooks and functions
// that get called

function NodeWrapper(InnerComponent) {
    return function Node(props) {
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
