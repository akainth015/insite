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
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
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
            spacing={2}
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                ml: "4vw",
            }}
        >
            <Dialog width="100vw" open={open} onClose={handleClose}>
                <DialogTitle id="scroll-dialog-title">Choose which flow to restore</DialogTitle>
                <DialogContent dividers={true}>
                    <DialogContentText id="scroll-dialog-description" tabIndex={-1}></DialogContentText>
                    <TableContainer>
                        <Table sx={{ minWidth: 550 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography>Name</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography>Last Modified</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography>Restore</Typography>
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: "red" }}>
                                        <Typography>Delete Permanently</Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(flows).map((id) => (
                                    <TableRow
                                        key={flows[id].name}
                                        sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {flows[id].name}
                                        </TableCell>
                                        <TableCell align="right">{flows[id].lastModified}</TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={() => {
                                                    onLoadClick(id, flows[id].name);
                                                }}
                                            >
                                                <RestoreIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                onClick={() => {
                                                    deleteFlow(auth, id);
                                                    handleClose();
                                                }}
                                                variant="container"
                                                sx={{
                                                    color: "black",
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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
                            setTimeout(() => {
                                props.onSave(text);
                            }, 30);
                            handleRenameClose();
                        }}
                    >
                        Rename and Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Button
                onClick={() => {
                    handleClickOpen();
                }}
                variant="contained"
                sx={{
                    color: "white",
                    backgroundColor: "black",

                    "&:hover": {
                        backgroundColor: "white",
                        color: "black",
                    },
                }}
            >
                Load
            </Button>
            <Button
                onClick={onSaveClick}
                variant="contained"
                sx={{
                    color: "white",
                    backgroundColor: "black",

                    "&:hover": {
                        backgroundColor: "white",
                        color: "black",
                    },
                }}
            >
                Save
            </Button>
        </Stack>
    );
}
