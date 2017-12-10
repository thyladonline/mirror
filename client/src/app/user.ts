export enum CityType {
    None = 0,
    Home = 1,
    Work = 2
}

export class CityWeather {
    constructor(
        public name: string,
        public type: CityType) {
    }
}

export class User {
    constructor(
        public username: string = 'Invité',
        public cityWeathers: CityWeather[]) {
    }
}
