import { Card, CardContent } from "@mui/material";
import { useInput } from "../nodes";

function TextNode() {
    const [textInput, TIHandle] = useInput("Text Input", "any");

    const text = JSON.stringify(textInput);

    return (
        <Card>
            <CardContent>{text}</CardContent>
            {TIHandle}
        </Card>
    );
}

export default TextNode;
