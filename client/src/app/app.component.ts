import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { User, CityWeather } from 'app/user';

import { AuthenticationService } from 'app/services/authentication.service';
import { SpeechService } from 'app/services/speech.service';

@Component({
  selector: 'app-root',
  providers: [AuthenticationService, SpeechService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string;
  weathers: Array<CityWeather> = [];
  hourLabel: string;
  dayLabel: string;
  dateLabel: string;

  user: User;

  // Rafraichir l'heure toutes les
  // timer$ = Observable.interval(1000); // secondes
  timer$ = Observable.interval(60000);  // minutes

  constructor(private speech: SpeechService, private authService: AuthenticationService) {
  }

  ngOnInit() {
    this.loadUser();
    this.setToday();
    // this.setLiteralToday();
    this.timer$.subscribe((x) => { this.setToday(); });
  }

  loadUser(): void {
    this.authService.getCurrentUser().subscribe(
      (value) => {
        this.user = value;
        this.title = `Bonjour ${this.user.username}`;
        this.speech.sayText(this.title);
        if (!this.authService.isLoggedIn()) {
          this.speech.sayText(`Pour connaître les commandes vocales disponibles, dîtes "${this.speech.helpCommand}"`);
        }
        this.weathers = value.cityWeathers;
      },
      (error) => {
        console.log(error);
      });
  }

  formatNumber(value: number) { return ('0' + value).slice(-2); }

  setToday() {
    const now: Date = new Date();
    // this.hourLabel = `${this.formatNumber(now.getHours())}:${this.formatNumber(now.getMinutes())}:${this.formatNumber(now.getSeconds())}`;
    this.hourLabel = `${this.formatNumber(now.getHours())}:${this.formatNumber(now.getMinutes())}`;
    this.dateLabel = `${this.formatNumber(now.getDay())}/${this.formatNumber(now.getMonth())}/${now.getFullYear()}`;
  }

  setLiteralToday() {
    const now: Date = new Date();
    this.hourLabel = `${this.formatNumber(now.getHours())}:${this.formatNumber(now.getMinutes())}`;
    switch (now.getDay()) {
      case 0: this.dayLabel = 'Dimanche'; break;
      case 1: this.dayLabel = 'Lundi'; break;
      case 2: this.dayLabel = 'Mardi'; break;
      case 3: this.dayLabel = 'Mercredi'; break;
      case 4: this.dayLabel = 'Jeudi'; break;
      case 5: this.dayLabel = 'Vendredi'; break;
      case 6: this.dayLabel = 'Samedi'; break;
      default: this.dayLabel = '';
    }
    let monthLabel: string;
    switch (now.getMonth()) {
      case 0: monthLabel = 'Janvier'; break;
      case 1: monthLabel = 'Février'; break;
      case 2: monthLabel = 'Mars'; break;
      case 3: monthLabel = 'Avril'; break;
      case 4: monthLabel = 'Mai'; break;
      case 5: monthLabel = 'Juin'; break;
      case 6: monthLabel = 'Juillet'; break;
      case 7: monthLabel = 'Août'; break;
      case 8: monthLabel = 'Septembre'; break;
      case 9: monthLabel = 'Octobre'; break;
      case 10: monthLabel = 'Novembre'; break;
      case 11: monthLabel = 'Décembre'; break;
    }
    this.dateLabel = `${now.getDate()} ${monthLabel}`;
  }
}
