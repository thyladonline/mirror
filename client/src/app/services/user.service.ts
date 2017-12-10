import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { User, CityWeather, CityType } from 'app/user';

@Injectable()
export class UserService {
    constructor(private http: Http) {
    }

    private getDefaultUser() {
        return new User('Invité', [new CityWeather('Colmar', CityType.Work)]);
    }

    loadUser(username: string): User {
        let users = {};
        let resultUser: User;

        if (localStorage.getItem('users') !== null) {
            users = JSON.parse(localStorage.getItem('users'));
            resultUser = users[username];
        }

        if (resultUser === undefined) {
            resultUser = this.getDefaultUser();
            // override input username if specified
            if (username !== undefined) {
                resultUser.username = username;
            }
        }

        users[resultUser.username] = resultUser;
        localStorage.setItem('users', JSON.stringify(users));
        return resultUser;
    }

    // const cities: CityWeather[] = [
    //     new CityWeather('Colmar', CityType.Home),
    //     new CityWeather('Strasbourg', CityType.Work)];
    // const user: User = new User('Adeline', cities);

    saveUser(user: User): void {
        let users = {};

        if (localStorage.getItem('users') !== null) {
            users = JSON.parse(localStorage.getItem('users'));
        }
        // Add/Override current user
        users[user.username] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }

    addCity (user: User, newCity: CityWeather) {
        if (user.cityWeathers.filter(x => x.name === newCity.name).length > 0) {
            console.log(`Current city '${newCity.name}' all ready exists in your cities list.`);
        } else {
            user.cityWeathers.push(newCity);
        }
    }
}
