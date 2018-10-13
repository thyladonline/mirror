import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from 'app/app.component';
import { WeatherComponent } from 'app/weather/weather.component';
import { ListenComponent } from 'app/listen/listen.component';

import { OpenweathermapService } from 'app/services/openweathermap.service';
import { AuthenticationService } from 'app/services/authentication.service';
import { SpeechService } from 'app/services/speech.service';

@NgModule({
  declarations: [
    AppComponent,
    WeatherComponent,
    ListenComponent
  ],
  imports: [
    // CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    OpenweathermapService,
    AuthenticationService,
    SpeechService],
  bootstrap: [AppComponent]
})
export class AppModule { }
