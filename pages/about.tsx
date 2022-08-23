import { NextPage } from "next/types";
import * as React from "react";
import {Box, Typography} from "@mui/material";
import Head from "next/head";

const About: NextPage = () => {
    return(
        <React.Fragment>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </Head>
            <Box className="flex justify-center items-center text-white z-2 backdrop-blur-0" sx={{height: '90vh', width: "auto"}}>
                <Typography className="text-3xl md:text-5xl">
                    About Page
                </Typography>
            </Box>
        </React.Fragment>
    );
}

export default About;