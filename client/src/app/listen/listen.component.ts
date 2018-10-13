import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpeechService } from 'app/services/speech.service';
import { AuthenticationService } from 'app/services/authentication.service';
import { User } from 'app/user';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.scss']
})
export class ListenComponent implements OnInit, OnDestroy {
  globalCommands: string[] = ['listCommands'];
  userCommands: string[] = ['addUser', 'loadUser', 'removeUser'];
  cityCommands: string[] = ['addCity', 'removeCity'];
  globalSub: Subscription;
  usersSub: Subscription;
  citiesSub: Subscription;
  errorsSub: Subscription;
  errorMsg: string = null;

  constructor(public speech: SpeechService, public authService: AuthenticationService) {
  }

  ngOnInit() {
    this.speech.init();
    this._listenGlobal();
    this._listenUsers();
    this._listenCities();
    this._listenErrors();
    this.speech.startListening();
  }

  get btnLabel(): string {
    return this.speech.listening ? 'Listening...' : 'Listen';
  }

  private _listenGlobal() {
    this.errorMsg = null;
    this.usersSub = this.speech.words$
      .filter(obj => this.globalCommands.some(x => obj.type === x))
      .map(obj => obj)
      .subscribe(
        obj => {
          const action: string = obj.type;
          console.log('** debug _listenGlobal');
          console.log(`action:'${action}'`);
          switch (action) {
            case 'listCommands':
              this.speech.sayCommandsDescription();
              break;
            default:
              this._setError(`Action '${action}' isn\'t implemented`);
              break;
          }
        }
      );
  }

  private _listenUsers() {
    this.usersSub = this.speech.words$
    .filter(obj => this.userCommands.some(x => obj.type === x))
      .map(obj => obj)
      .subscribe(
        obj => {
          const action: string = obj.type;
          const username: string = obj.word;
          // console.log('** debug _listenUsers');
          // console.log(`action:'${action}', username:'${username}'`);
          switch (action) {
            case 'addUser':
              this.authService.addUser(username);
              this.authService.login(username);
              this.speech.sayText(`Vous êtes connecté en tant que ${username}`);
              break;

            case 'loadUser':
              this.authService.login(username);
              this.speech.sayText(`Vous êtes connecté en tant que ${username}`);
              break;

            case 'removeUser':
              this.authService.removeUser(username);
              this.speech.sayText(`L'utilisateur ${username} a été supprimé`);
              break;

            default:
              this._setError(`Action '${action}' isn\'t implemented`);
          }
        }
      );
  }

  private _listenCities() {
    this.citiesSub = this.speech.words$
      .filter(obj => this.cityCommands.some(x => obj.type === x))
      .map(obj => obj)
      .subscribe(
        obj => {
          const action: string = obj.type;
          const cityname: string = obj.word;
          // console.log('** debug _listenCities');
          // console.log(`action:'${action}', cityname:'${cityname}'`);
          switch (action) {
            case 'addCity':
              this.authService.addCity(cityname);
              this.speech.sayText(`La météo de la ville ${cityname} est disponible`);
              break;
            case 'removeCity':
            this.authService.removeCity(cityname);
              this.speech.sayText(`La météo de la ville ${cityname} n'est plus disponible`);
              break;
            default:
              this._setError(`Action '${action}' isn\'t implemented`);
              break;
          }
        }
      );
  }

  private _listenErrors() {
    this.errorsSub = this.speech.errors$
      .subscribe(err => this._setError(err));
  }

  private _setError(err?: any) {
    if (err) {
      console.log('Speech Recognition:', err);
      this.errorMsg = err.message;
    } else {
      this.errorMsg = null;
    }
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
    this.citiesSub.unsubscribe();
    this.errorsSub.unsubscribe();
    this.speech.abort();
  }
}

