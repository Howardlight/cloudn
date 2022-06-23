export interface WeatherResponse {
    cod:     string;
    message: number;
    cnt:     number;
    list:    WeatherList[];
    city:    City;
}

export interface City {
    id:         number;
    name:       string;
    coord:      Coord;
    country:    string;
    population: number;
    timezone:   number;
    sunrise:    number;
    sunset:     number;
}

export interface Coord {
    lat: number;
    lon: number;
}

export interface WeatherList {
    dt:         number;
    main:       MainClass;
    weather:    Weather[];
    clouds:     Clouds;
    wind:       Wind;
    visibility: number;
    pop:        number;
    sys:        Sys;
    dt_txt:     Date;
}

export interface Clouds {
    all: number;
}

export interface MainClass {
    temp:       number;
    feels_like: number;
    temp_min:   number;
    temp_max:   number;
    pressure:   number;
    sea_level:  number;
    grnd_level: number;
    humidity:   number;
    temp_kf:    number;
}

export interface Sys {
    pod: Pod;
}

export enum Pod {
    D = "d",
    N = "n",
}

export interface Weather {
    id:          number;
    main:        MainEnum;
    description: Description;
    icon:        Icon;
}

export enum Description {
    ClearSky = "clear sky",
    ScatteredClouds = "scattered clouds",
}

export enum Icon {
    The01D = "01d",
    The01N = "01n",
    The02D = "02d",
    The02N = "02N",
    The03D = "03d",
    The03N = "03n",
    The04D = "04d",
    The04N = "04n",
    The09D = "09d",
    The09N = "09n",
    The10D = "10d",
    The10N = "10n",
    The11D = "11d",
    The11N = "11n",
    The13D = "13d",
    The13N = "13n",
    The50D = "50d",
    The50N = "50n",
}

export enum MainEnum {
    Clear = "Clear",
    Clouds = "Clouds",
}

export interface Wind {
    speed: number;
    deg:   number;
    gust:  number;
}

export interface DayForcast {
    day: number;
    list: WeatherList[];
    average: DayForcastAv;
}

export interface DayForcastAv {
    main:       MainClass;
    weather:    Weather[];
    clouds:     Clouds;
    wind:       Wind;
    visibility: number;
    pop:        number;
}