import { WeatherList, WeatherResponse, DayForcast, DayForcastAv, Weather, Wind, Clouds } from './types';

export const fetcher = (url: string) => fetch(url).then(r => r.json());
function kelvinToCelsius(kelvin: number) {
    return kelvin - 273.15;
}
export function convertToCelsius(kelvin: number) {
    return Math.round(kelvinToCelsius(kelvin));
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
function checkIfInForcastList(cur: number, listDay: Array<DayForcast>, exists: boolean, listDayIndex: number) {

    for (let j = 0; j < listDay.length; j++) {

        // If Item found in the list return the index so it can be appended to THAT list
        if (cur === listDay[j].day) {
            exists = true;
            listDayIndex = j;

            break;
        };
    }

    return [exists, listDayIndex] as const;
}

/**
 *  Takes DayForcast and calculates the average.
 *  Adds all Weather types together
 * @param df 
 * @returns `DayForcast average`
 */
const calDayForcastAv = (df: DayForcast): DayForcastAv => {

    const len = df.list.length;

    let temp: number = 0;
    let feels_like: number = 0;
    let temp_min: number = 0;
    let temp_max: number = 0;
    let pressure: number = 0;
    let sea_level: number = 0;
    let grnd_level: number = 0;
    let humidity: number = 0;
    let temp_kf: number = 0;


    let weather: Weather[] = [];
    let clouds: Clouds = {all: 0};
    let wind: Wind = {speed: 0, deg: 0, gust: 0};
    let visibility: number = 0;
    let pop: number = 0;

    //Loop over All list items
    for(let i = 0; i < df.list.length; i++) {
        
        // get The sum of all of main's values
        temp += df.list[i].main.temp;
        feels_like += df.list[i].main.feels_like;
        temp_min += df.list[i].main.temp_min;
        temp_max += df.list[i].main.temp_max;
        pressure += df.list[i].main.pressure;
        sea_level += df.list[i].main.sea_level;
        grnd_level += df.list[i].main.grnd_level;
        humidity += df.list[i].main.humidity;
        temp_kf += df.list[i].main.temp_kf;

        clouds.all += df.list[i].clouds.all;
        visibility += df.list[i].visibility;
        pop += df.list[i].pop;

        // Wind
        wind.speed += df.list[i].wind.speed;
        wind.deg += df.list[i].wind.deg;
        wind.gust += df.list[i].wind.gust;



        // if weather length is 0, skip it, else add all weather lists inside to weather
        if(df.list[i].weather.length == 0) continue;
        else for(let j = 0; j < df.list[i].weather.length; j++) {weather.push(df.list[i].weather[j])};

    }

    // Divide main's values by length of list, which gives us the mean
    temp = temp / len;
    feels_like = feels_like / len;
    temp_min = temp_min / len;
    temp_max = temp_max / len;
    pressure = pressure / len;
    sea_level = sea_level / len;
    grnd_level = grnd_level / len;
    humidity = humidity / len;
    temp_kf = temp_kf / len;

    clouds.all = clouds.all / len;
    visibility = visibility / len;
    pop = pop / len;

    // Wind
    wind.speed = wind.speed / len;
    wind.deg = wind.deg / len;
    wind.gust = wind.gust / len;


    // create MainClass
    const main = {
        temp       : temp,
        feels_like : feels_like,
        temp_min   : temp_min,
        temp_max   : temp_max, 
        pressure   : pressure,
        sea_level  : sea_level,
        grnd_level : grnd_level,
        humidity   : humidity,
        temp_kf    : temp_kf,
    }

    return {
        main: main,
        clouds: clouds,
        wind: wind,
        pop: pop,
        visibility: visibility,
        weather: weather,
    }
}

/**
 *  Filters Weather data by Day
 * @param weatherList
 * @returns listDay: listDay
 */
export const filterWeatherListByDay = (weatherList: WeatherResponse): Array<DayForcast> => {

    let forcastList: Array<DayForcast> = [];
    let prevDay: number = -1;

    let placeholderAv = {
        main: {
            temp : 0,
            feels_like : 0,
            temp_min : 0,
            temp_max : 0,
            pressure : 0,
            sea_level : 0,
            grnd_level : 0,
            humidity : 0,
            temp_kf : 0,
        },
        clouds: {
            all: 0
        },
        wind: {
            speed: 0,
            deg: 0,
            gust: 0
        },
        pop: 0,
        visibility: 0,
        weather: [],
    }

    // Loop over all entries in List
    for (let i = 0; i < weatherList.list.length; i++) {

        // detect different days and contain them in their own Json entry
        var curDate = new Date(weatherList.list[i].dt_txt);
        var curDay = curDate.getDate();


        var exists: boolean = false;
        var listDayIndex: number = -1;

        // Check if current entry has the same day as the one before
        if (curDay === prevDay) {
            exists = true;
        };

        // Check if an entry of same sade has already been added to listDay
        [exists, listDayIndex] = checkIfInForcastList(curDay, forcastList, exists, listDayIndex);


        // If there is an entry already, push it to that entry
        if (exists) {
            forcastList[listDayIndex].list.push(weatherList.list[i]);
            // console.log(`Added ${weatherList[i].dt_txt} to ${listDay[listDayIndex]} of day: ${curDay}`);
        } else {
            // If there is no entry, we will create one
            forcastList.push({ day: curDay, list: [weatherList.list[i]], average: placeholderAv });
        }

        prevDay = curDay;
    }

    forcastList = filterFirstForcast(forcastList, weatherList);

    for(let i = 0; i < forcastList.length; i++) {
        forcastList[i].average = calDayForcastAv(forcastList[i]);
        // console.log(forcastList[i].average);
    }

    // console.log(forcastList);
    return forcastList;
};
/**
 * Removes Current Day Forcast from the List
 * @param dayForcast
 * @param weatherData
 * @returns `dayForcast`
 */
export function filterFirstForcast(dayForcast: DayForcast[], weatherData: WeatherResponse) {

    if (dayForcast[0].list[0].dt_txt === weatherData.list[0].dt_txt) {
        console.log(`Current Weather day detected in DayForcast[] of day ${dayForcast[0].day}`);
        dayForcast.shift();
    }

    return dayForcast;
}

export const weatherIconMap = [
    
    // Few Clouds
    {
        code: "02d",
        svg: "sunny-cloud-forcast.svg"
    },
    {
        code: "02n",
        svg: "sunny-cloud-forcast.svg"
    },

    // Clear
    {
        code: "01d",
        svg: "forcast-sun-sunrise.svg"
    },
    {
        code: "01n",
        svg: "forcast-moon-night.svg"
    },

    // Lighting
    {
        code: "11d",
        svg: "energy-forecast-lightning.svg"
    },
    {
        code: "11n",
        svg: "energy-forecast-lightning.svg"
    },

    // Cloudy
    {
        code: "03d",
        svg: "cloud-cloudy-forcast.svg"
    },
    {
        code: "03n",
        svg: "cloud-cloudy-forcast.svg"
    },

    // Cloud Lightning
    {
        code: "11d",
        svg: "cloud-forcast-lightning.svg"
    },
    {
        code: "11n",
        svg: "cloud-forcast-lightning.svg"
    },
    

    // Cloudy Rain
    {
        code: "09d",
        svg: "climate-forcast-rain.svg"
    },
    {
        code: "09n",
        svg: "climate-forcast-night.svg"
    },

    {
        code: "10d",
        svg: "climate-forcast-rain.svg"
    },
    {
        code: "10n",
        svg: "climate-forcast-night.svg"
    },

    // Snow
    {
        code: "13d",
        svg: "forecast-snowflakes.svg"
    },
    {
        code: "13n",
        svg: "forecast-snowflakes.svg"
    },


    // Mist
    {
        code: "50d",
        svg: "blowing-climate-forcast.svg"
    },
    {
        code: "50n",
        svg: "blowing-climate-forcast.svg"
    },
]
