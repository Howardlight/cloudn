import {NextPage} from "next";
import {Fragment} from "react";
import {Typography, Container} from "@mui/material";


const Offline: NextPage = () => {
    return(
        <Fragment>
            <Container sx={{display: "flex", flexDirection: "Column", justifyContent: "center", alignItems: "center", color: "white", height: "100vh", width: "100vw"}}>
                <Typography variant={"h4"}>You are offline.</Typography>
                <Typography variant={"subtitle1"}>Please check your internet connection and try again.</Typography>
            </Container>
        </Fragment>
    )
}

export default Offline;