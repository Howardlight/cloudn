import {DayForcast} from "../types";
import {Box, Card, CardContent, CardMedia, Fade, Typography} from "@mui/material";
import Image from "next/image";
import {convertToCelsius, fetchDate, getForcastIcon} from "../utils";
import React, {Fragment} from "react";

const WeatherWidget = ({dayForcast}: { dayForcast: DayForcast }) => {

    return (
        <Card className="bg-transparent rounded-md border-2 border-solid w-48 min-h-fit" sx={{color: "white"}}>
            <CardMedia
                sx={{display: "inline-flex", flexDirection: "row", alignItems: "center", m: "10px", gap: "10px"}}>
                <Image src={getForcastIcon(dayForcast)} alt={"Forecast Icon"} width={50} height={50}/>
                <Typography variant="h5"
                            className="font-bold">{convertToCelsius(dayForcast.average.main.temp)}°</Typography>
            </CardMedia>
            <CardContent sx={{p: "5%"}}>
                <Typography variant="subtitle1">{fetchDate(dayForcast)}</Typography>
                <Typography variant="subtitle1">Min |
                    Max: {convertToCelsius(dayForcast.average.main.temp_min)} | {convertToCelsius(dayForcast.average.main.temp_max)} °</Typography>
                <Typography variant="subtitle1">Feels
                    Like: {Math.round(convertToCelsius(dayForcast.average.main.feels_like))}°</Typography>
                <Typography variant="subtitle1">Precipitation: {Math.round(dayForcast.average.pop * 100)}%</Typography>
            </CardContent>
        </Card>
    );
}
const WeatherWidgetGroup = ({weatherList}: { weatherList: DayForcast[] | undefined }) => {


    return (
        <Fade unmountOnExit in>
            <Box className="scale-90 grid grid-cols-2 justify-items-center align-items-center gap-x-10 gap-y-5">
                {weatherList!.map((item, index) => {
                    return (
                        <Fragment key={index}>
                            <WeatherWidget dayForcast={item}/>
                        </Fragment>
                    )
                })}
            </Box>
        </Fade>
    );
}

export default WeatherWidgetGroup