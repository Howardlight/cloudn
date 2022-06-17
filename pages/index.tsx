import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import useSWR from 'swr'
import { useEffect, useState } from 'react'

const fetcher = (url: string) => fetch(url).then(r => r.json());

const Home: NextPage = () => {

    const [longitude, setLongitude] = useState(0);
    const [latitude, setLatitude] = useState(0);

    useEffect(()=> {
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

    }, []);

    const {data, error} = useSWR(longitude !=0 && latitude !=0 ? `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${process.env.NEXT_PUBLIC_OWA_API}` : null, fetcher);

    console.log(data);
    if(error) return <div>{error}</div>
    if(!data) return <div>No data</div>
    return <div></div>
}

export default Home