import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { User, CityWeather } from 'app/user';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthenticationService {
    _currentUser: BehaviorSubject<User>;

    constructor(private http: Http) {
        const lastConnectedUsername = localStorage.getItem('lastConnectedUsername');
        const defaultUser: User = (lastConnectedUsername != null) ? this.loadUser(lastConnectedUsername) : this.getDefaultUser();
        this._currentUser = new BehaviorSubject<User>(defaultUser);
    }

    login(username: string) {
        const newUsername = this.capitalizeFirstLetter(username);
        this._currentUser.next(this.loadUser(newUsername));
        localStorage.setItem('lastConnectedUsername', newUsername);
    }

    isLoggedIn() {
        return this._currentUser.getValue().username !== this.getDefaultUser().username;
    }

    logout() {
        this._currentUser.next(this.getDefaultUser());
        localStorage.removeItem('lastConnectedUsername');
    }

    getCurrentUser(): Observable<User> {
        return this._currentUser.asObservable();
    }

    addUser (username: string) {
        const newUser: User = new User(this.capitalizeFirstLetter(username), []);
        this.saveUser(newUser);
    }

    removeUser (username: string) {
        this.deleteUser(username);
        if (this._currentUser.getValue().username === this.capitalizeFirstLetter(username)) {
            this.logout();
        }
    }

    addCity (cityname: string) {
        const newCityname: string = this.capitalizeFirstLetter(cityname);
        if (this._currentUser.getValue().cityWeathers.some(x => x.name === newCityname)) {
            console.log(`Current city '${cityname}' already exists in your cities list.`);
        } else {
            this._currentUser.getValue().cityWeathers.push(new CityWeather(newCityname)); // , CityType.None
            this.saveUser(this._currentUser.getValue());
        }
    }

    removeCity (cityname: string) {
        const i: number = this._currentUser.getValue().cityWeathers.findIndex(x => x.name === this.capitalizeFirstLetter(cityname));
        if (i > -1) {
            this._currentUser.getValue().cityWeathers.splice(i, 1);
            this.saveUser(this._currentUser.getValue());
        } else {
            console.log(`Current city '${cityname}' not exists in your cities list.`);
        }
    }

    private getDefaultUser() {
        const defaultUsername = 'Invité';
        const defaultUser: User = this.loadUser(defaultUsername);
        return defaultUser;
    }

    private loadUser(username: string): User {
        let users: Array<User> = [];
        let resultUser: User;

        if (localStorage.getItem('users') !== null) {
            users = JSON.parse(localStorage.getItem('users'));
        }

        resultUser = users.find(x => x.username === username);

        if (resultUser === undefined && username !== undefined) {
            resultUser = new User(username, []);
            this.saveUser(resultUser, users);
        }

        return resultUser;
    }

    private deleteUser(username: string): void {
        if (localStorage.getItem('users') !== null) {
            const users: Array<User> = JSON.parse(localStorage.getItem('users'));
            const i: number = users.findIndex(x => x.username === username);
            if (i > -1) {
                users.splice(i, 1);
                localStorage.setItem('users', JSON.stringify(users));
            }
        }
    }

    private saveUser(user: User, localStorageUsers: Array<User> = null): void {
        let users: Array<User> = [];
        if (localStorageUsers != null) {
            users = localStorageUsers;
        }
        if (localStorageUsers == null && localStorage.getItem('users') !== null) {
            users = JSON.parse(localStorage.getItem('users'));
        }
        // Add/Override user
        const i: number = users.findIndex(x => x.username === user.username);
        if (i > -1) {
            users[i] = user;
        } else {
            users.push(user);
        }
        localStorage.setItem('users', JSON.stringify(users));
    }

    private capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}
