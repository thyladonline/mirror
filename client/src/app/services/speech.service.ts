import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Subject } from 'rxjs/Subject';

// TypeScript declaration for annyang
declare var annyang: any;

@Injectable()
export class SpeechService {
    words$ = new Subject<{[key: string]: string}>();
    errors$ = new Subject<{[key: string]: any}>();
    listening = false;
    helpCommand = 'lister les commandes vocales';
    commandsDescription: string = 'Les commandes vocales disponibles sont : ' +
      '"ajouter utilisateur [prénom]", ' +
      '"supprimer utilisateur [prénom]", ' +
      '"se connecter en tant que utilisateur [prénom]", ' +
      '"ajouter météo [nom de la ville]" ' +
      'OU "supprimer météo [nom de la ville]".';

    constructor(private http: Http) {
    }

    sayCommandsDescription() {
      this.sayText(this.commandsDescription);
    }

    sayText(text) {
      if (!window.speechSynthesis) {
        console.log('Speech synthesis isn\'t available');
        return;
      }
      const msg = new SpeechSynthesisUtterance();
      const voices = window.speechSynthesis.getVoices();
      msg.voice = voices[0];
      msg.volume = 1;
      msg.rate = 1;
      msg.pitch = 1;
      msg.text = text;
      window.speechSynthesis.speak(msg);
    }

    get speechSupported(): boolean {
      return !!annyang;
    }

    init() {
      const commands = {
        'lister les commandes vocales': () => {
          this.words$.next({type: 'listCommands'});
        },
        'ajouter utilisateur *username': (username) => {
            this.words$.next({type: 'addUser', 'word': username});
        },
        'supprimer utilisateur *username': (username) => {
            this.words$.next({type: 'removeUser', 'word': username});
        },
        'se connecter en tant que *username': (username) => {
          this.words$.next({type: 'loadUser', 'word': username});
        },
        'ajouter météo *cityname': (cityname) => {
          this.words$.next({type: 'addCity', 'word': cityname});
        },
        'supprimer météo *cityname': (cityname) => {
          this.words$.next({type: 'removeCity', 'word': cityname});
        },
        'dis-moi qui est la plus :qualif': () => {
          this.sayText('C\'est sans conteste vous!');
        }
      };
      annyang.debug(true);
      annyang.setLanguage('fr-FR');
      annyang.addCommands(commands);

      // Log anything the user says and what speech recognition thinks it might be
      // annyang.addCallback('result', (userSaid) => {
      //   console.log('User may have said:', userSaid);
      // });
      annyang.addCallback('errorNetwork', (err) => {
        this._handleError('network', 'A network error occurred.', err);
      });
      annyang.addCallback('errorPermissionBlocked', (err) => {
        this._handleError('blocked', 'Browser blocked microphone permissions.', err);
      });
      annyang.addCallback('errorPermissionDenied', (err) => {
        this._handleError('denied', 'User denied microphone permissions.', err);
      });
      // annyang.addCallback('resultMatch', (userSaid, commandText, phrases) => {
      //   console.log('** debug resultMatch');
      //   console.log(userSaid);
      //   console.log(commandText);
      //   console.log(phrases);
      // });
      annyang.addCallback('resultNoMatch', (userSaid) => {
        this._handleError(
          'pas de correspondance trouvée',
          `La commande vocale n\'est pas reconnue. Dîtes "${this.helpCommand}"`,
          { results: userSaid });
      });
    }

    private _handleError(error, msg, errObj) {
        this.errors$.next({
          error: error,
          message: msg,
          obj: errObj
        });
    }

    startListening() {
      annyang.start();
      this.listening = true;
    }

    abort() {
      annyang.abort();
      this.listening = false;
    }
}
