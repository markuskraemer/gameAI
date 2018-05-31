import { TickService } from './../tick.service';
import { KeyboardService } from './Keyboard.service';
import { MapService } from './map.service';
import { Character } from './Character';
import { Alias } from './../Alias';
import { Injectable } from '@angular/core';
import { Key } from 'ts-keycode-enum';

@Injectable()
export class GameService {

    private _character:Character;

   

    public get character ():Character {
        return this._character;
    }

    constructor(
        private mapService:MapService,
        private keyboardService:KeyboardService,
        private tickService:TickService
    ) {
        Alias.gameService = this;
        this.createPlayer ();
        this.tickService.tick.subscribe (()=>{
            this.tick ();
        })
     }

     private createPlayer ():void {
        this._character = new Character (this, this.mapService);
        this._character.x = 37.5;
        this._character.y = 120;
     }

     private tick ():void {
         if(this.keyboardService.isPressed(Key.W)){
             this._character.moveForward ();
         }

        if(this.keyboardService.isPressed(Key.A)){
             this._character.rotateLeft ();
         }

        if(this.keyboardService.isPressed(Key.D)){
             this._character.rotateRight ();
         }

     }

   

}