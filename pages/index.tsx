import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import useSWR, { SWRResponse } from 'swr'
import { useEffect, useState } from 'react'
import { WeatherResponse, DayForcast } from '../types'
import { Container, LinearProgress, Typography, Box, CircularProgress, Card, CardMedia, CardContent } from '@mui/material'
import { fetcher, filterWeatherListByDay, filterFirstForcast, convertToCelsius } from '../utils'
import { Fragment } from 'react'
import clouds from "../assets/ForcastSVGs/climate-cloud-forecast-2.svg";

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
            <Background>
                <Box className="backdrop-blur-sm" sx={{ minWidth: "100vw", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "125px", color: "white"}}>
                    <Box>
                        <Image src={clouds} width={250} height={250} />
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
                    {/* <Box>
                        {weatherList == undefined ? <CircularProgress /> : weatherList.map((item, index) => {
                            //TODO: Create a nice Component to display info
                            return <Fragment key={index}><WeatherWidget dayForcast={item} /></Fragment>
                        })}
                    </Box> */}
                </Box>
            </Background>
        </Fragment>
    );
}


const WeatherWidgetGroup = ({weatherList}: {weatherList: DayForcast[]| undefined}) => {
    
    
    return(
        <Box sx={{display: "flex", gap: "5px"}}>
            {weatherList == undefined ? <CircularProgress /> : weatherList.map((item, index) => {
                        //TODO: Create a nice Component to display info
                        return <Fragment key={index}><WeatherWidget dayForcast={item} /></Fragment>
            })}
        </Box>
    );
}


const WeatherWidget = ({dayForcast}: {dayForcast: DayForcast}) => {

    return(
        <Card>
            <CardMedia>
                <Image src={clouds}  />
            </CardMedia>
            <CardContent sx={{minHeight: "100px", minWidth: "150px", p: "5%"}}>
                <Typography variant="h5" className="font-bold">{convertToCelsius(dayForcast.average.main.temp)}°</Typography>
                <Typography sx={{display: "flex", wrap: "no-wrap"}} variant="subtitle1">{convertToCelsius(dayForcast.average.main.feels_like)} | {convertToCelsius(dayForcast.average.main.temp_max)} °</Typography>
            </CardContent>

        </Card>
    );
}

export default Home