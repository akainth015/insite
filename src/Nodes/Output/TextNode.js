import { Card, CardContent } from "@mui/material";
import { useInput } from "../nodes";

function TextNode() {
    const [textInput, TIHandle] = useInput("Text Input", ["text", "boolean"]);

    let text;

    switch (typeof textInput) {
        case "boolean":
            text = textInput ? "true" : "false";
            break;
        default:
            text = textInput;
    }

    return (
        <Card>
            <CardContent>{text}</CardContent>
            {TIHandle}
        </Card>
    );
}

export default TextNode;
