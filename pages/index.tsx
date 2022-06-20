import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import useSWR, { SWRResponse } from 'swr'
import { useEffect, useState } from 'react'
import { WeatherResponse, DayForcast } from '../types'
import { Container, LinearProgress, Typography, Box, CircularProgress } from '@mui/material'
import { fetcher, filterWeatherListByDay, filterFirstForcast } from '../utils'


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
                var list = filterWeatherListByDay(data.list);
                list = filterFirstForcast(list, data)

                setWeatherList(list);
            }, 2000);
        }

    }, [data])


    if(error) return <div>{error}</div>
    if(!data) return <LinearProgress/>
    return (
        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minWidth: "100vw", minHeight: "100vh"}}>
            <Box sx={{display: "flex", flexDirection: "row"}}>
                <Typography className="text-9xl">{data ? Math.round(data.list[0].main.temp - 273.15) : <CircularProgress />}</Typography>
                <Typography className="text-3xl" sx={{alignSelf: "flex-end", mb: "5%"}}>{data ? "°C" : null}</Typography>
            </Box>
            <Typography className="text-6xl">{data.list[0].weather[0].main}</Typography>
            <Box>
                <Typography>{data.city.name}</Typography>
            </Box>

            <Box>
                {weatherList == undefined ? <CircularProgress /> : weatherList.map((item, index) => {
                    //TODO: Create a function that displays the mean of  each individual list
                    //TODO: Create a nice Component to display info
                    return <Typography key={item.day}>{item.day}</Typography>;
                })}
            </Box>
        </Box>
    );
}

export default Home