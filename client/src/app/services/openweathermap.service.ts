// https://openweathermap.org/current

// Units format
// For temperature in Celsius use units=metric
// api.openweathermap.org/data/2.5/find?q=London&units=metric

// Multilingual support
// http://api.openweathermap.org/data/2.5/forecast/daily?id=524901&lang=fr

// http://api.openweathermap.org/data/2.5/weather?q=Colmar&cnt=1&appid=489f7f54c9476cf6622d2e9bb5ecbc2e&units=metric&lang=fr

import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import {Observable} from 'rxjs/Rx';
// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as OpenweathermapCurrent from 'OpenweathermapCurrent';
import * as OpenweathermapForecast from 'OpenweathermapForecast';
import { environment } from 'environments/environment';

const MAX_RETRIES: Number = 4;
const APP_ID: String = environment.apikeyWeather;

@Injectable()
export class OpenweathermapService {
  constructor(private http: Http) {
  }

  getCurrent(city): Observable<OpenweathermapCurrent.WeatherCurrent> {
    const cityName = `${city},fr`;
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&cnt=1&units=metric&lang=fr&appid=${APP_ID}`;
    console.log(url);
    return this.http
      .get(url)
      .map((res) => res.json() as OpenweathermapCurrent.WeatherCurrent)
      // .do(value => console.log(value))
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  getForecast(city): Observable<OpenweathermapForecast.WeatherForecast> {
    const cityName = `${city},fr`;
    const url = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&cnt=10&units=metric&lang=fr&appid=${APP_ID}`;
    console.log(url);
    return this.http
      .get(url)
      .map((res) => res.json() as OpenweathermapForecast.WeatherForecast)
      // .do(value => console.log(value))
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }
}
