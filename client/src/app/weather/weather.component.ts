import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { User } from 'app/user';
import { OpenweathermapService } from 'app/services/openweathermap.service';
import * as OpenweathermapCurrent from 'OpenweathermapCurrent';
import * as OpenweathermapForecast from 'OpenweathermapForecast';

import * as chartlib from 'chart.js';

@Component({
  selector: 'app-weather',
  providers: [OpenweathermapService],
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {
  @Input() city: string;  
  weatherCurrent$: Observable<OpenweathermapCurrent.WeatherCurrent>;
  labels: Array<string> = [];
  dataset: Array<number> = [];

  constructor(private openweathermapService: OpenweathermapService) {
  }
  // constructor(user: User) {
  //   console.log('WeatherComponent ctor...');
  //   this.user = user;
  // }

  ngOnInit() {
    if (this.city === undefined) { return; }
    console.log(`WeatherComponent initialization for city '${this.city}'`);
    this.weatherCurrent$ = this.openweathermapService.getCurrent(this.city);
    this.openweathermapService.getForecast(this.city)
                              .forEach((data) => {
                                  console.log(data);
                                  data.list.map(step => {
                                    this.labels.push(new Date(step.dt_txt).toLocaleTimeString().substring(0, 5));
                                    this.dataset.push(step.main.temp);
                                  });
                                  this.loadChart();
                              });
  }

  loadChart(): void {
    console.log('loadChart...');
    console.log(this.labels);
    console.log(this.dataset);
    chartlib.Chart.defaults.global.defaultFontFamily = 'Segoe UI';
    chartlib.Chart.defaults.global.defaultColor = '#000000';
    new chartlib.Chart(document.getElementById('line-chart_' + this.city), {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
            data: this.dataset,
            title: '',
            display: false,
            // borderColor: '#736F6E',
            // backgroundColor: '#E5E4E2',
            borderColor: '#fff',
            backgroundColor: '#fff',
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        title: { display: false }
      }
    });
  }
}
