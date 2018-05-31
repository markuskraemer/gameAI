import { MathUtils } from './../utils/MathUtils';
export class Character {
    public x:number = 0;
    public y:number = 0;
    public width:number = 5;
    public height:number = 10;
    public viewAngle:number = 0;

    constructor (private gameService, private mapService){

    }

    public moveForward ():void {

        const newX:number = this.x + Math.sin(this.viewAngle);
        const newY:number = this.y - Math.cos(this.viewAngle);

        if(this.checkPoints (newX, newY, this.viewAngle)){
            this.x = newX;
            this.y = newY;
        }

    }

    public rotateLeft ():void {
        this.viewAngle -= Math.PI / 180 * 4;
    }

    public rotateRight ():void {
        this.viewAngle += Math.PI / 180 * 4;
    }

    private checkPoints (x:number, y:number, viewAngle:number):boolean {
        const TL:{x:number, y:number} = MathUtils.rotateXY (-this.width/2, -this.height/2, viewAngle, 0, 0);
        const TR:{x:number, y:number} = MathUtils.rotateXY ( this.width/2, -this.height/2, viewAngle, 0, 0);
        const BR:{x:number, y:number} = MathUtils.rotateXY ( this.width/2,  this.height/2, viewAngle, 0, 0);
        const BL:{x:number, y:number} = MathUtils.rotateXY (-this.width/2,  this.height/2, viewAngle, 0, 0);

        if(this.mapService.getTileAt (x + TL.x, y + TL.y) == 0 ||
                this.mapService.getTileAt (x + TR.x, y + TR.y) == 0 
               // this.mapService.getTileAt (x + BR.x, y + BR.y) == 0 ||
               // this.mapService.getTileAt (x + BL.x, y + BL.y) == 0
               ){
                return false;
            }
        return true;

    }

}
