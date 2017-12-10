import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { UserService } from 'app/services/user.service';
import { User, CityWeather, CityType } from 'app/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string;
  hourLabel: string;
  dayLabel: string;
  dateLabel: string;

  user$: Observable<User>;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    console.log('AppComponent init...');
    const user: User = this.userService.loadUser('Adeline');
    // this.userService.addCity(user, new CityWeather('Strasbourg', CityType.Work));
    // this.userService.saveUser(user);
    this.user$ = Observable.create(observer => observer.next(user))
                           .do(value => {
                             this.title = `Bonjour ${value.username}`;
                             console.log(value);
                            });
    this.setTitle(user);
    this.setTodayLabel();
  }

  setTitle(user: User = null) {
    this.title = `Bonjour ${user == null ? 'Invité' : user.username}`;
  }

  formatNumber(value: number) { return ('0' + value).slice(-2); }

  setTodayLabel() {
    const now: Date = new Date();
    this.hourLabel = `${this.formatNumber(now.getHours())}:${this.formatNumber(now.getMinutes())}`;
    switch (now.getDay())
    {
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
    switch (now.getMonth())
    {
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
