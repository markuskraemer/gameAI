import { MapService } from './../map.service';
import { TickService } from './../../tick.service';
import { GameService } from './../game.service';
import { Character } from './../Character';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {

 private _character:Character;

    @ViewChild ('canvas')
    public canvas:ElementRef;


    @Input ('character')
    public set character (value:Character){
        this._character = value;
        this.draw ();
        requestAnimationFrame(()=>this.draw());
    }

    public get character ():Character {
        return this._character;
    }

    constructor(
        public gameService:GameService,
        public mapService:MapService,
        private tickService:TickService
    ) { }

    ngOnInit() {
        this.tickService.draw.subscribe ( () => {
            this.draw ();
        })
    }

    private draw ():void {
        let context:CanvasRenderingContext2D = this.canvas.nativeElement.getContext ('2d'); 
        context.clearRect (0, 0, this.mapService.mapWidth, this.mapService.mapHeight);
        context.fillStyle = 'red';

        context.save ();
        context.translate (this.character.x, this.character.y);
        context.rotate (this.character.viewAngle);
        context.fillRect (-this.character.width/2, 
                            - this.character.height/2, 
                            this.character.width, 
                            this.character.height);
        context.restore ();
    }


}
