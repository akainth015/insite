export default function Node(props) {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };
    return (
        <div
            key={props.nodeType}
            className={"dndnode"}
            onDragStart={(event) => onDragStart(event, props.nodeType)}
            draggable={"true"}
        >
            {props.nodeType}
        </div>
    );
}
