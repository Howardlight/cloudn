import { WeatherResponse } from "../../types";
import {NextApiResponse, NextApiRequest} from "next";

//TODO: Add TS DOCs, which is first, lon or lat
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { geolocation } = req.query

    let wReq: WeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${geolocation[0]}&lon=${geolocation[1]}&appid=${process.env.OWA_API}`).then(data => data.json());

    //TODO: Make a response for code: 400, message: "wrong latitude"

    res.status(200).json(wReq);
}