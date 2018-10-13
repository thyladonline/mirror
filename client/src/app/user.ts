export class CityWeather {
    constructor(public name: string) {
    }
}

export class User {
    constructor(
        public username = 'Invité',
        public cityWeathers: Array<CityWeather> = []) {
    }
}
