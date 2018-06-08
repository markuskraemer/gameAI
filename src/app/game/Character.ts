import { Alias } from './../Alias';

import { MapService } from './map.service';
import { GameService } from './game.service';
import { ConfigService } from './../config.service';
import { MathUtils } from './../utils/MathUtils';
import * as Color from 'color';

export interface XY {
    x:number;
    y:number;
}

export class Character {

    protected static colorHueRotation:number = 0;

    public x:number = 0;
    public y:number = 0;
    public width:number = Alias.configService ? Alias.configService.tileSize / 4 : 10;
    public height:number = Alias.configService ? Alias.configService.tileSize / 2 : 20;
    public viewAngle:number = 0;
    public color:Color;
    public id:number;

    constructor (){
        this.id = new Date().getTime ();
        this.color = new Color (0xff0000);
        this.color = this.color.rotate (Character.colorHueRotation);
        Character.colorHueRotation += 37;
    }


    public tick ():void {

    }

    public hasFeelers ():boolean {
        return false;
    }

    public moveForward (factor:number = 1):void {
        //console.log("mf: " , factor);
        const newX:number = this.x + Math.sin(this.viewAngle) * Alias.configService.speed * factor;
        const newY:number = this.y - Math.cos(this.viewAngle) * Alias.configService.speed * factor;
        this.x = newX;
        this.y = newY;
    }

    public rotateLeft (factor:number = 1):void {
        this.rotate(-1);
    }

    public rotateRight (factor:number=1):void {
        this.rotate(1);
    }

    public rotate (factor:number){
        this.viewAngle += Math.PI / 180 * Alias.configService.radPerRotation * factor;
    }

    protected checkPoints (x:number, y:number, viewAngle:number):boolean {
        const TL:XY = MathUtils.rotateXY (-this.width/2, -this.height/2, viewAngle, 0, 0);
        const TR:XY = MathUtils.rotateXY ( this.width/2, -this.height/2, viewAngle, 0, 0);
    //    const BR:{x:number, y:number} = MathUtils.rotateXY ( this.width/2,  this.height/2, viewAngle, 0, 0);
    //    const BL:{x:number, y:number} = MathUtils.rotateXY (-this.width/2,  this.height/2, viewAngle, 0, 0);

        if(Alias.mapService.getTileAt (x + TL.x, y + TL.y) == 0
                || Alias.mapService.getTileAt (x + TR.x, y + TR.y) == 0
//                || this.mapService.getTileAt (x + BR.x, y + BR.y) == 0
  //              || this.mapService.getTileAt (x + BL.x, y + BL.y) == 0
               ){
                return false;
            }
        return true;

    }

}
