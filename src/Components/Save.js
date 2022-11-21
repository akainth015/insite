import React, { useState, useEffect, useRef } from "react";
import { useAuthUser } from "../Firebase/Auth";
import {
    Button,
    Stack,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
    TextField,
} from "@mui/material";
import { deleteFlow, getAllFlows } from "../Firebase/firestore";

export default function Save(props) {
    const auth = useAuthUser();
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [flows, setFlows] = useState([]);
    const [text, setText] = useState(null);

    const onSaveClick = () => {
        if (auth) {
            if (!props.name) {
                setOpen2(true);
                return;
            }
            props.onSave();
        }
    };

    const onLoadClick = async (id, name) => {
        if (auth) {
            handleClose();
            props.onRestore(id, name);
        }
    };

    const handleClickOpen = async () => {
        const flows = await getAllFlows(auth);
        setFlows(flows);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleRenameClose = () => {
        setOpen2(false);
    };

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={4}
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                paddingLeft: "2vw",
            }}
        >
            <Dialog width="100vw" open={open} onClose={handleClose} scroll={"paper"}>
                <DialogTitle id="scroll-dialog-title">Choose which flow to restore</DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText id="scroll-dialog-description" tabIndex={-1}></DialogContentText>
                    {Object.keys(flows).map((id) => (
                        <Stack key={id} direction="row" alignItems="center" justifyContent="space-between">
                            <Typography>{flows[id].name}</Typography>
                            <Typography>{flows[id].lastModified}</Typography>
                            <Button
                                onClick={() => {
                                    onLoadClick(id, flows[id].name);
                                }}
                            >
                                Restore
                            </Button>
                            <Button
                                onClick={() => {
                                    deleteFlow(auth, id);
                                    handleClose();
                                }}
                            >
                                Permanent Delete
                            </Button>
                        </Stack>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={open2} onClose={handleRenameClose}>
                <DialogTitle>Set Name</DialogTitle>
                <DialogContent>
                    <DialogContentText>To save this flow, please enter a name for this flow.</DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Name"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setText(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRenameClose}>Cancel</Button>
                    <Button
                        onClick={() => {
                            props.setName(text);
                            handleRenameClose();
                        }}
                    >
                        Rename
                    </Button>
                </DialogActions>
            </Dialog>
            <Button
                onClick={() => {
                    handleClickOpen();
                }}
                variant="contained"
            >
                Load
            </Button>
            <Button onClick={onSaveClick} variant="contained">
                Save
            </Button>
        </Stack>
    );
}
