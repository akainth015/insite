import { Card, CardContent } from "@mui/material";
import { useInput } from "../nodes";

function TextNode() {
    const [textInput, TIHandle] = useInput("Text Input", ["text"]);

    return (
        <Card>
            <CardContent>{textInput}</CardContent>
            {TIHandle}
        </Card>
    );
}

export default TextNode;
