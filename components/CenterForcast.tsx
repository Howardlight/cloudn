import Image from 'next/image';
import React from 'react';
import { WeatherResponse } from '../types';
import { Box, CircularProgress, Typography } from '@mui/material';
import { getForcastIcon } from '../utils';

export const CenterForcast = ({ data }: { data: WeatherResponse; }) => {
    return (
        <Box className="flex flex-col gap-3">
            <Image src={getForcastIcon(data.list[0])} alt={"Forecast Icon"} layout="responsive" width={250} height={250} />
            <Box sx={{ display: "flex", flexDirection: "column" }} className="text-white">
                <Box sx={{ display: "inline-flex", flexDirection: "row", justifyContent: "center" }}>
                    <Typography className="text-6xl md:text-9xl">{data ? Math.round(data.list[0].main.temp - 273.15) : <CircularProgress />}</Typography>
                    <Typography className="text-xl md:text-3xl italic" sx={{ alignSelf: "flex-end", mb: "5%" }}>{data ? "°C" : null}</Typography>
                </Box>
                <Box sx={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography className="text-2xl md:text-6xl">{data.list[0].weather[0].main}</Typography>
                    <Typography sx={{ alignSelf: "center" }}>{data.city.name}</Typography>
                </Box>
            </Box>
        </Box>
    );
};
