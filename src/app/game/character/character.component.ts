import { MathUtils } from './../../utils/MathUtils';
import { Feeler } from './../Feeler';
import { AICharacter } from './../AICharacter';
import { MapService } from './../map.service';
import { TickService } from './../../tick.service';
import { GameService } from './../game.service';
import { Character, XY } from './../Character';
import { Component, OnInit, Input, Output, ViewChild, ElementRef, HostListener, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class CharacterComponent implements OnInit {

    private _characters:Character[];
    private  context:CanvasRenderingContext2D;
    
    @Output('selectCharacter')
    public readonly selectCharacter:EventEmitter<Character> = new EventEmitter ();

    @HostListener('click', ['$event']) 
    private onClick(e:MouseEvent) {
        console.log("onClick: ", e);
        const character:Character = this.findCreatureByPosition (e.offsetX, e.offsetY);
        if(character != null){
            console.log("character _> ", character);
            this.selectCharacter.emit (character);
        }
    }

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

    private findCreatureByPosition (x:number, y:number){
        for(const character of this._characters){
            const local:XY = MathUtils.rotateXY (x, y, -character.viewAngle, character.x, character.y);
            if(local.x >= character.x - character.width / 2 && local.x < character.x + character.width / 2 
            &&  local.y >= character.y - character.height / 2 && local.y < character.y + character.height / 2){
                return character;
            }
        }
        return null;
    }


    protected draw ():void {
        this.context = this.canvas.nativeElement.getContext ('2d'); 
        this.context.clearRect (0, 0, this.mapService.mapWidth, this.mapService.mapHeight);

        for(const character of this._characters){
        this.context.save ();

            this.context.fillStyle = character.color.rgb ().toString ();
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
        for(const feeler of character.feelers){
            this.drawFeeler(feeler);
        }
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
