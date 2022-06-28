import type {NextPage} from 'next'
import Image from 'next/image'
import React, {Fragment, useEffect, useState, Suspense} from 'react'
import {DayForcast, WeatherResponse} from '../types'
import {Box, CircularProgress, LinearProgress, Typography} from '@mui/material'
import {filterWeatherListByDay, getForcastIcon, useWeatherData} from '../utils'
import {ErrorBoundary} from "react-error-boundary";
import Head from "next/head";

const Home: NextPage = () => {

    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [weatherList, setWeatherList] = useState<DayForcast[] | undefined>(undefined);

    useEffect(() => {
        const getGeoLocation = async () => {
            if("geolocation" in navigator) {

                console.info("Geolocation available");
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        console.log("Latitude is :", position.coords.longitude);
                        console.log("longitude is:",position.coords.latitude);
                        
                        setLongitude(position.coords.longitude);
                        setLatitude(position.coords.latitude);
                    },
                    function(error) {
                        //TODO: Find a fallback method to get location when navigator fails
                        console.error("Navigator returned Error:", error.code, "\n", error.message);
                        
                    }
                );

            } else console.error("Geolocation NOT available");
        }
        getGeoLocation().catch(console.error);
    }, []);

    const {data, isLoading, isError} = useWeatherData(longitude, latitude);

    // lazy load WeatherWidgetGroup
    const WeatherWidgetGroup = React.lazy(() => import("../components/weatherWidget"));

    useEffect(() => {
        // Filters weather Data by Day to be displayed under
        if(data) {
            const timeOut = setTimeout(() => {
                console.log("TimeOut Called!");
                let list = filterWeatherListByDay(data);

                setWeatherList(list);
            }, 2000);
            return () => clearTimeout(timeOut);
        }

    }, [data])

    if(isLoading) return <LinearProgress/>
    if(isError) return <div>{isError}</div>
    //TODO: Add Image Loader, Add Lazy Loading
    return (
        <Fragment>
            <Head>
                <title>Cloudn</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            </Head>
                <Box className="scale-75 gap-y-10 md:scale-100 md:gap-y-40 md:mt-16" sx={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white"}}>
                    
                    {data ? <CenterForcast data={data}/> : <LinearProgress />}

                    <ErrorBoundary fallback={<Typography className="flex justify-center align-center">Could not load remaining Forecasts.</Typography>}>
                        <Suspense fallback={<CircularProgress className="flex justify-center align-center" />}>
                            {weatherList != undefined ? <WeatherWidgetGroup weatherList={weatherList} /> : <CircularProgress />}
                        </Suspense>
                    </ErrorBoundary>
                </Box>
        </Fragment>
    );
}

const CenterForcast = ({data}: {data: WeatherResponse}) => {
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
}


export default Home;