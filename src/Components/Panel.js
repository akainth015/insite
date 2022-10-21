import Node from "./Node";
export default function Panel(props) {
    function createDraggableForNodeType(nodeType) {
        return <Node nodeType={nodeType}></Node>;
    }
    return <>{Object.keys(props.nodeTypes).map(createDraggableForNodeType)}</>;
}
