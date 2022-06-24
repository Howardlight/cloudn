import React from 'react';
import bg from "../assets/bg.jpg";

//TODO: Find a type for this, check Cheatsheet

const Background = (props: any) => {
    return <div className="bg-fixed" style={{ backgroundImage: `url("${bg.src}")` }}>{props.children}</div>;
};

export default Background;
