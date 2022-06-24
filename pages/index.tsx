import type {NextPage} from 'next'
import Image from 'next/image'
import React, {Fragment, useEffect, useState} from 'react'
import {DayForcast} from '../types'
import {Box, CircularProgress, LinearProgress, Typography} from '@mui/material'
import {filterWeatherListByDay, getForcastIcon, useWeatherData} from '../utils'
import {WeatherWidget} from "../components/weatherWidget";

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
                <Box className="backdrop-blur-sm" sx={{ minWidth: "100vw", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "125px", color: "white"}}>
                    <Box>
                        <Image src={getForcastIcon(data!.list[0])} width={250} height={250} />
                        <Box sx={{ display: "flex", flexDirection: "column" }} className="text-white">
                            <Box sx={{ display: "inline-flex", flexDirection: "row", justifyContent: "center" }}>
                                <Typography className="text-9xl">{data ? Math.round(data.list[0].main.temp - 273.15) : <CircularProgress />}</Typography>
                                <Typography className="text-3xl italic" sx={{ alignSelf: "flex-end", mb: "5%" }}>{data ? "°C" : null}</Typography>
                            </Box>
                            <Box sx={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
                                <Typography className="text-6xl">{data!.list[0].weather[0].main}</Typography>
                                <Typography sx={{ alignSelf: "center" }}>{data!.city.name}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* //TODO: Add transition */}
                    <WeatherWidgetGroup weatherList={weatherList} />
                </Box>
        </Fragment>
    );
}

const WeatherWidgetGroup = ({weatherList}: {weatherList: DayForcast[]| undefined}) => {
    
    
    return(
        <Box sx={{display: "flex", gap: "7px"}}>
            {weatherList == undefined ? <CircularProgress /> : weatherList.map((item, index) => {
                        return <Fragment key={index}><WeatherWidget dayForcast={item} /></Fragment>
            })}
        </Box>
    );
}


export default Home