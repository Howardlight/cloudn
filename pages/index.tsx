import type {NextPage} from 'next'
import Image from 'next/image'
import useSWR, {SWRResponse} from 'swr'
import React, {Fragment, useEffect, useState} from 'react'
import {DayForcast, WeatherResponse} from '../types'
import {Box, CircularProgress, LinearProgress, Typography} from '@mui/material'
import {fetcher, filterWeatherListByDay, getForcastIcon} from '../utils'
import {WeatherWidget} from "../components/weatherWidget";

const Home: NextPage = () => {

    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [weatherList, setWeatherList] = useState<DayForcast[] | undefined>(undefined);
    // console.log("Rendered Home");

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

    const {data, error}: SWRResponse<WeatherResponse, any> = useSWR(longitude !=0 && latitude !=0 ? `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_OWA_API}` : null, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });

    useEffect(() => {
        // Filters weather Data by Day to be displayed under
        if(data) {
            const timeOut = setTimeout(() => {
                console.log("TimeOut Called!");
                var list = filterWeatherListByDay(data);

                setWeatherList(list);
            }, 2000);
        }

    }, [data])


    if(error) return <div>{error}</div>
    if(!data) return <LinearProgress/>
    //TODO: Add Image Loader, Add Lazy Loading
    return (
        <Fragment>
                <Box className="backdrop-blur-sm" sx={{ minWidth: "100vw", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "125px", color: "white"}}>
                    <Box>
                        <Image src={getForcastIcon(data.list[0])} width={250} height={250} />
                        <Box sx={{ display: "flex", flexDirection: "column" }} className="text-white">
                            <Box sx={{ display: "inline-flex", flexDirection: "row", justifyContent: "center" }}>
                                <Typography className="text-9xl">{data ? Math.round(data.list[0].main.temp - 273.15) : <CircularProgress />}</Typography>
                                <Typography className="text-3xl italic" sx={{ alignSelf: "flex-end", mb: "5%" }}>{data ? "°C" : null}</Typography>
                            </Box>
                            <Box sx={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
                                <Typography className="text-6xl">{data.list[0].weather[0].main}</Typography>
                                <Typography sx={{ alignSelf: "center" }}>{data.city.name}</Typography>
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


/**
 * Returns A date in format `Day | Month | Year`
 * @param dayForcast 
 * @returns `string` 
 */
export const fetchDate = (dayForcast: DayForcast): string => {
    const date = new Date(dayForcast.list[0].dt_txt);
    return `${date.getDate()} | ${date.getMonth() + 1} | ${date.getFullYear()}`;
}
export default Home