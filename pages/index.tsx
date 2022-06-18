import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import useSWR, { SWRResponse } from 'swr'
import { useEffect, useState } from 'react'
import { List, WeatherResponse } from '../types'
import { Container, LinearProgress, Typography, Box, CircularProgress } from '@mui/material'


const fetcher = (url: string) => fetch(url).then(r => r.json());

function kelvinToCelsius(kelvin: number) {
    return kelvin - 273.15;
}

function convertToCelsius(kelvin: number) {
    return Math.round(kelvinToCelsius(kelvin));
}

interface ListDay {
    day: number;
    list: List[];
}

/**
 *  
 * Loops over listDay, to find out if cur day already exists in it
 * 
 * @param cur : number
 * @param listDay : Array<listDay>
 * @param exists : boolean
 * @param listDayIndex : number
 * @returns `[exists, listDayIndex]`
 */
function checkIfInListDay(cur: number, listDay: Array<ListDay>, exists: boolean, listDayIndex: number) {

    for(let j = 0; j < listDay.length ; j++) {

        // If Item found in the list return the index so it can be appended to THAT list
        if(cur === listDay[j].day) {
            exists = true;
            listDayIndex = j;

            break;
        };
    }

    return [exists, listDayIndex] as const;
}

//TODO: Process list to split dataset by days
/**
 *  Filters Weather data by Day
 * @param weatherList 
 * @returns listDay: listDay
 */
const filterWeatherListByDay = (weatherList: List[]) => {

    let listDay: Array<ListDay> = []; 
    let prevDay: number = -1;

    // Loop over all entries in List
    for(let i = 0; i < weatherList.length; i++) {
        console.log(`i: ${i} - weatherList Date: ${weatherList[i].dt_txt}`);

        // detect different days and contain them in their own Json entry
        var curDate = new Date(weatherList[i].dt_txt);
        var curDay = curDate.getDate();


        var exists: boolean = false;
        var listDayIndex: number = -1;

        // Check if current entry has the same day as the one before
        if(curDay === prevDay) {
            exists = true;
        };

        // Check if an entry of same sade has already been added to listDay
        [exists, listDayIndex] = checkIfInListDay(curDay, listDay, exists, listDayIndex);


        // If there is an entry already, push it to that entry
        if(exists) {
            listDay[listDayIndex].list.push(weatherList[i]);
            console.log(`Added ${weatherList[i].dt_txt} to ${listDay[listDayIndex]} of day: ${curDay}`);
        } else {
            // If there is no entry, we will create one
            listDay.push({day: curDay, list: [weatherList[i]]});
        }

        prevDay = curDay;
    }

    console.log(listDay);
    return listDay;
}



const weatherComponent = (dataEntry: List, index: number) => {
    return (
    <Container key={index}>
        <Typography>{convertToCelsius(dataEntry.main.temp)}° - {dataEntry.dt_txt.toString()}</Typography>
    </Container>
    )
}

const Home: NextPage = () => {

    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);

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

    const {data, error}: SWRResponse<WeatherResponse, any> = useSWR(longitude !=0 && latitude !=0 ? `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_OWA_API}` : null, fetcher);

    // Filters weather Data by Day to be displayed under
    if (data) {
        setTimeout(() => {
            filterWeatherListByDay(data?.list);
        }, 2000);
    }

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
                <Typography>{data.list.length}</Typography>
                {data.list.map((item, index) => {
                    if(index == 0) return null;
                    return weatherComponent(item, index);
                })}
            </Box>
        </Box>
    );
}

export default Home