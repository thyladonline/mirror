import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//import { ApiKey } from 'angular-apikeys';

import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';

import { UserService } from 'app/services/user.service';
import { OpenweathermapService } from './services/openweathermap.service';

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    OpenweathermapService,
    UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
