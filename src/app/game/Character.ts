import { MapService } from './map.service';
import { GameService } from './game.service';
import { ConfigService } from './../config.service';
import { MathUtils } from './../utils/MathUtils';
export class Character {
    public x:number = 0;
    public y:number = 0;
    public width:number = this.mapService.tileSize / 4;
    public height:number = this.mapService.tileSize / 2;
    public viewAngle:number = 0;

    constructor (private gameService:GameService, private mapService:MapService, private configService:ConfigService){

    }

    public moveForward ():void {

        const newX:number = this.x + Math.sin(this.viewAngle) * this.configService.speed;
        const newY:number = this.y - Math.cos(this.viewAngle) * this.configService.speed;

        if(this.checkPoints (newX, newY, this.viewAngle)){
            this.x = newX;
            this.y = newY;
        }

    }

    public rotateLeft ():void {
        this.viewAngle -= Math.PI / 180 * this.configService.radPerRotation;
    }

    public rotateRight ():void {
        this.viewAngle += Math.PI / 180 * this.configService.radPerRotation;
    }

    private checkPoints (x:number, y:number, viewAngle:number):boolean {
        const TL:{x:number, y:number} = MathUtils.rotateXY (-this.width/2, -this.height/2, viewAngle, 0, 0);
        const TR:{x:number, y:number} = MathUtils.rotateXY ( this.width/2, -this.height/2, viewAngle, 0, 0);
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
