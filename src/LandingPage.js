import React from "react";
import Topbar from "./Components/Topbar";
import Hero from "./Components/Hero";
import Description from "./Components/Description";
import SignupPrompt from "./Components/SignupPrompt";

export default function LandingPage() {
    return (
        <>
            <Topbar />
            <Hero />
            <Description />
            <SignupPrompt />
        </>
    );
}
