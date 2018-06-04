import { MapService } from './map.service';
import { GameService } from './game.service';
import { ConfigService } from './../config.service';
import { MathUtils } from './../utils/MathUtils';

export interface XY {
    x:number;
    y:number;
}

export class Character {
    public x:number = 0;
    public y:number = 0;
    public width:number = this.mapService.tileSize / 4;
    public height:number = this.mapService.tileSize / 2;
    public viewAngle:number = 0;
    public color:string;
    constructor (protected gameService:GameService, protected mapService:MapService, protected configService:ConfigService){

    }

    public tick ():void {

    }

    public hasFeelers ():boolean {
        return false;
    }

    public moveForward (factor:number = 1):void {

        const newX:number = this.x + Math.sin(this.viewAngle) * this.configService.speed * factor;
        const newY:number = this.y - Math.cos(this.viewAngle) * this.configService.speed * factor;
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
        this.viewAngle += Math.PI / 180 * this.configService.radPerRotation * factor;
    }

    protected checkPoints (x:number, y:number, viewAngle:number):boolean {
        const TL:XY = MathUtils.rotateXY (-this.width/2, -this.height/2, viewAngle, 0, 0);
        const TR:XY = MathUtils.rotateXY ( this.width/2, -this.height/2, viewAngle, 0, 0);
    //    const BR:{x:number, y:number} = MathUtils.rotateXY ( this.width/2,  this.height/2, viewAngle, 0, 0);
    //    const BL:{x:number, y:number} = MathUtils.rotateXY (-this.width/2,  this.height/2, viewAngle, 0, 0);

        if(this.mapService.getTileAt (x + TL.x, y + TL.y) == 0
                || this.mapService.getTileAt (x + TR.x, y + TR.y) == 0
//                || this.mapService.getTileAt (x + BR.x, y + BR.y) == 0
  //              || this.mapService.getTileAt (x + BL.x, y + BL.y) == 0
               ){
                return false;
            }
        return true;

    }

}
