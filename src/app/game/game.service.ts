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
    public bestGrade:number = 2;
    public bestGradeCharacter:AICharacter;
    public inspectedCharacter:AICharacter;

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

     public loadAndAddCharacter (id:string):void {
         console.log("loadAndAddCharacter: ", id);
     }

     private createCharacters ():void {

        const character:Character = new UserCharacter ();
        character.x = 1.5 * this.mapService.tileSize;
        character.y = 3 * this.mapService.tileSize;
       // this._characters.push(character);
       let n:number = this.configService.characterCount;
       while(n-- > 0){
            const aiCharacter = this.createAICharacter ();
            this.placeAtAllowedPoint (aiCharacter); 
       }
     }

     private generateRandomColor (seed:number):number {
         const c0:number = (seed * 50) % 255;
         const c1:number = 255;
         const c2:number = 255;
         if(seed % 3 == 0)  
             return c0 << 16 | c1 << 8 | c2;
        
        if(seed % 3 == 1)  
            return c1 << 16 | c0 << 8 | c2;

        if(seed % 3 == 2)  
            return c2 << 16 | c0 << 8 | c1;


     }

     private createAICharacter ():AICharacter {
        const aiCharacter = new AICharacter ();
        this.addCharacter(aiCharacter);
        return aiCharacter;
     }

     private placeAtAllowedPoint(character:Character){
        character.x = 1.5 * this.mapService.tileSize;
        character.y = (8 + this.characters.length % 4) * this.mapService.tileSize;
       // character.color = '#' + this.generateRandomColor (this.characters.length).toString (16);
        
     }

     private addCharacter (character:Character):void {
        this._characters.push(character);
     }
 

     private isGoodGrade (grade:number):boolean { 
         let best:number = 0;
         for(const character of this._characters){
             if((<AICharacter> character).grade > best){
                 best = (<AICharacter> character).grade;
             }
         }
         return grade >= best;
     }

     private updateBestGrade ():void {
         let best:number = this.bestGrade;
         let bestCharacter:AICharacter;
         for(const character of this._characters){
             if((<AICharacter> character).grade >= best){
                 best = (<AICharacter> character).grade;
                 bestCharacter = <AICharacter> character;
             }
         }
         this.bestGrade = best;
         this.bestGradeCharacter = bestCharacter || this.bestGradeCharacter;
    }

     public removeCharacter (character:AICharacter):void {
        // console.log("removeCharacter : ", character);

         const index:number = this._characters.indexOf(character);
         this._characters.splice(index, 1);
         this.updateBestGrade ();
        if(Math.random () > .2 && this.bestGradeCharacter != undefined){

            const newCharacter2:AICharacter = this.bestGradeCharacter.copy ();
            newCharacter2.randomize ();
            this.addCharacter (newCharacter2);
            this.placeAtAllowedPoint (newCharacter2);
         }else{
            if(this._characters.length < this.configService.characterCount){
                const newCharacter = this.createAICharacter ();
                this.placeAtAllowedPoint (newCharacter);
            }
         }
     }

     private tick ():void {
         for(const character of this._characters){
             character.tick ();
         }
     }

   

}