import { WeatherList, WeatherResponse, DayForcast } from './types';

export const fetcher = (url: string) => fetch(url).then(r => r.json());
function kelvinToCelsius(kelvin: number) {
    return kelvin - 273.15;
}
function convertToCelsius(kelvin: number) {
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
 *  Filters Weather data by Day
 * @param weatherList
 * @returns listDay: listDay
 */
export const filterWeatherListByDay = (weatherList: WeatherList[]): Array<DayForcast> => {

    let forcastList: Array<DayForcast> = [];
    let prevDay: number = -1;

    // Loop over all entries in List
    for (let i = 0; i < weatherList.length; i++) {
        // console.log(`i: ${i} - weatherList Date: ${weatherList[i].dt_txt}`);
        // detect different days and contain them in their own Json entry
        var curDate = new Date(weatherList[i].dt_txt);
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
            forcastList[listDayIndex].list.push(weatherList[i]);
            // console.log(`Added ${weatherList[i].dt_txt} to ${listDay[listDayIndex]} of day: ${curDay}`);
        } else {
            // If there is no entry, we will create one
            forcastList.push({ day: curDay, list: [weatherList[i]] });
        }

        prevDay = curDay;
    }

    // console.log(listDay);
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
