import { Key } from 'ts-keycode-enum';
import { Alias } from './../Alias';
import { Character } from './Character';
export class UserCharacter extends Character {


    public tick ():void {
        if(Alias.keyboardService.isPressed(Key.W)){
             this.moveForward ();
         }

        if(Alias.keyboardService.isPressed(Key.A)){
             this.rotateLeft ();
         }

        if(Alias.keyboardService.isPressed(Key.D)){
             this.rotateRight ();
         }
    }
}
