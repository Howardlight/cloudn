import React from 'react';
import bg from "../assets/bg.jpg";

//TODO: Find a type for this, check Cheatsheet

const Background = (props: any) => {
    return <div className="bg-scroll bg-auto bg-center" style={{ backgroundImage: `url("${bg.src}")`, height: "100vh", width: "100vw" }}>{props.children}</div>;
};

export default Background;
