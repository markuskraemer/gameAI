import { MapService } from './map.service';
import { Character } from './Character';
import { Alias } from './../Alias';
import { Injectable } from '@angular/core';

@Injectable()
export class GameService {

    private _player:Character;

    public readonly tileSize:number = 25;

    public get player ():Character {
        return this._player;
    }

    constructor(
        private mapService:MapService
    ) {
        Alias.gameService = this;
        this.createPlayer ();
     }

     private createPlayer ():void {
        this._player = new Character ();
        this._player.x = 45;
        this._player.y = 88;
     }

     public get mapWidth ():number {
         if(!this.mapService.loaded){
             return 0;
         }
         return this.mapService.currentMap.width * this.tileSize;
     }

     public get mapHeight ():number {
         if(!this.mapService.loaded){
             return 0;
         }
         return this.mapService.currentMap.height * this.tileSize;
     }


}