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
        public gameService:GameService
    ) { }

    ngOnInit() {
    }

    private draw ():void {
        let context:CanvasRenderingContext2D = this.canvas.nativeElement.getContext ('2d'); 
        context.fillStyle = 'red';
        context.fillRect (this.character.x - this.character.width/2, 
                            this.character.y - this.character.height/2, 
                            this.character.width, 
                            this.character.height);
        
    }


}
