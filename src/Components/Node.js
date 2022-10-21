import { Paper, Stack } from "@mui/material";
import { nodeIcons } from "../Nodes/nodes";
import AbcIcon from '@mui/icons-material/Abc';

export default function Node(props) {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.effectAllowed = "move";
    };
    const Icon = nodeIcons[props.nodeType] || AbcIcon;
    
    return (
        <Paper
            onDragStart={(event) => onDragStart(event, props.nodeType)}
            draggable={"true"}
            elevation={4}
            sx={{
                padding: 1
            }}
        >
            <Stack direction = "column" alignItems="center" justifyContent = "center" spacing={2}>
                <Icon/>
                {props.nodeType}
            </Stack>
        </Paper>
    );
}
