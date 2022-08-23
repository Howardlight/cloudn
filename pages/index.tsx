import type {NextPage} from 'next'
import React, {Fragment, useEffect, useState, Suspense} from 'react'
import {DayForcast} from '../types'
import {Box, CircularProgress, LinearProgress, Typography} from '@mui/material'
import {filterWeatherListByDay, useWeatherData} from '../utils'
import {ErrorBoundary} from "react-error-boundary";
import Head from "next/head";
import { CenterForcast } from '../components/CenterForcast'

const Home: NextPage = () => {

    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [weatherList, setWeatherList] = useState<DayForcast[] | undefined>(undefined);


    //TODO: Add breakpoints for Tablets
    //TODO: Improve Manifest Images for the PWA
    useEffect(() => {
        const getGeoLocation = async () => {
            if("geolocation" in navigator) {

                // console.info("Geolocation available");
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        // console.log("Latitude is :", position.coords.longitude);
                        // console.log("longitude is:",position.coords.latitude);
                        
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
                // console.log("TimeOut Called!");
                let list = filterWeatherListByDay(data);

                setWeatherList(list);
            }, 2000);
            return () => clearTimeout(timeOut);
        }

    }, [data])

    if(isLoading) return <LinearProgress/>
    if(isError) return <div>{isError}</div>
    return (
        <Fragment>
            <Head>
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

export default Home;