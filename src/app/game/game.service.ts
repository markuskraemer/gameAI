import { UserCharacter } from './UserCharacter';
import { AICharacter } from './AICharacter';
import { ConfigService } from './../config.service';
import { TickService } from './../tick.service';
import { KeyboardService } from './Keyboard.service';
import { MapService } from './map.service';
import { Character } from './Character';
import { Injectable } from '@angular/core';
import { Key } from 'ts-keycode-enum';

@Injectable()
export class GameService {

    private _characters:Character[] = [];

    public get characters ():Character[] {
        return this._characters;
    }


    constructor(
        private mapService:MapService,
        private keyboardService:KeyboardService,
        private tickService:TickService,
        private configService:ConfigService
    ) {
        this.createCharacters ();
        this.tickService.tick.subscribe (()=>{
            this.tick ();
        })
     }

     private createCharacters ():void {

        const character:Character = new UserCharacter (this, this.mapService, this.configService);
        character.color = 'blue';
        character.x = 1.5 * this.mapService.tileSize;
        character.y = 3 * this.mapService.tileSize;
       // this._characters.push(character);

        const aiCharacter = new AICharacter (this, this.mapService, this.configService);
        aiCharacter.x = 1.5 * this.mapService.tileSize;
        aiCharacter.y = 3 * this.mapService.tileSize;
        this._characters.push(aiCharacter);
     }


     private tick ():void {
         for(const character of this._characters){
             character.tick ();
         }
     }

   

}