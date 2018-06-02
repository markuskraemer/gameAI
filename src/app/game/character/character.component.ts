import { Feeler } from './../Feeler';
import { AICharacter } from './../AICharacter';
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

    private _characters:Character[];
    private  context:CanvasRenderingContext2D;
    @ViewChild ('canvas')
    public canvas:ElementRef;


    @Input ('characters')
    public set characters (value:Character[]){
        this._characters = value;
        this.draw ();
        requestAnimationFrame(()=>this.draw());
    }

    public get characters ():Character[] {
        return this._characters;
    }

    constructor(
        public gameService:GameService,
        public mapService:MapService,
        public tickService:TickService
    ) { }

    ngOnInit() {

        this.tickService.draw.subscribe ( () => {
            this.draw ();
        })
    }

    protected draw ():void {
        this.context = this.canvas.nativeElement.getContext ('2d'); 
        this.context.clearRect (0, 0, this.mapService.mapWidth, this.mapService.mapHeight);

        for(const character of this._characters){
        this.context.save ();

            this.context.fillStyle = character.color;

            this.context.translate (character.x, character.y);
            this.context.rotate (character.viewAngle);
            this.context.fillRect (-character.width/2, 
                                - character.height/2, 
                                character.width, 
                                character.height);

            if(character.hasFeelers ()){
                this.drawFeelers (<AICharacter> character);
            }
                    this.context.restore ();

        }

    }


    private drawFeelers (character:AICharacter):void {
        this.drawFeeler (character.feelerTL);
        this.drawFeeler (character.feelerTR);
        this.drawFeeler (character.feelerML);
        this.drawFeeler (character.feelerMR);
        this.drawFeeler (character.feelerT);
    }

    private drawFeeler (feeler:Feeler):void {
        const distX:number = feeler.endX - feeler.startX;
        const distY:number = feeler.endY - feeler.startY;
        
        this.context.lineWidth = 2;
        this.context.strokeStyle = 'green';
 
        this.context.beginPath ();        
        this.context.moveTo (feeler.startX, feeler.startY);
        this.context.lineTo (feeler.startX + distX * feeler.freeSpaceValue, feeler.startY + distY * feeler.freeSpaceValue);
        this.context.stroke ();

        this.context.beginPath ();        
        this.context.strokeStyle = 'yellow';
        this.context.moveTo (feeler.startX + distX * feeler.freeSpaceValue, feeler.startY + distY * feeler.freeSpaceValue);
        this.context.lineTo (feeler.endX, feeler.endY);
        this.context.stroke ();
        
    }

}
