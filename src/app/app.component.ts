import { KeyboardService } from './game/Keyboard.service';
import { GameService } from './game/game.service';
import { MapService } from './game/map.service';
import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor (
        public gameService:GameService,
        public mapService:MapService,
        public keyboardService:KeyboardService
    ){
    }

}
