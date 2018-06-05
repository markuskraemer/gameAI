import { FormatterService } from './utils/Formatter.service';
import { TickService } from './tick.service';
import { DialogService } from './ui/dialogs/dialog.service';
import { StorageService } from './storage/storage.service';
import { KeyboardService } from './game/Keyboard.service';
import { GameService } from './game/game.service';
import { MapService } from './game/map.service';
import { Component } from '@angular/core';
import * as Stats from 'stats.js';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

    private stats:Stats;

    constructor (
        public gameService:GameService,
        public mapService:MapService,
        public keyboardService:KeyboardService,
        public storageService:StorageService,
        public dialogService:DialogService,
        public tickService:TickService,
        public formatterService:FormatterService
    ){
    }

    private initStats ():void {
        this.stats = new Stats ();
        document.body.appendChild(this.stats.dom);
        this.stats.dom.style.left = 'auto';
        this.stats.dom.style.right = '0';
        this.stats.dom.style.top = 'auto';
        this.stats.dom.style.bottom = '0';
        this.updateStats ();
    }

    private updateStats ():void {
        this.stats.end ();
        this.stats.begin ();
        requestAnimationFrame(()=>this.updateStats());
    }

}
