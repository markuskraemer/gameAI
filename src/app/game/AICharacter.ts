import { Key } from 'ts-keycode-enum';
import { Alias } from './../Alias';
import { Feeler } from './Feeler';
import { WorkingNeuron } from './../network/WorkingNeuron';
import { InputNeuron } from './../network/InputNeuron';
import { NeuralNetwork } from './../network/NeuralNetwork';
import { MathUtils } from './../utils/MathUtils';
import { ConfigService } from './../config.service';
import { MapService } from './map.service';
import { GameService } from './game.service';
import { Character, XY } from './Character';


export enum NeuronIds {
    TL = "TL",
    TR = "TR",
    ML = "ML",
    MR = "MR",
    T = "T",
    Forward = "FORWARD",
    Rotate = "ROTATE",
} 

export class AICharacter extends Character{

    public readonly feelerDist:number = this.width * 3;

    public brain:NeuralNetwork;
    public inTL:InputNeuron;
    public inTR:InputNeuron;
    public inML:InputNeuron;
    public inMR:InputNeuron;
    public inT:InputNeuron;

    public outForward:WorkingNeuron;
    public outRotate:WorkingNeuron;

    public feelerTL:Feeler;
    public feelerTR:Feeler;
    public feelerML:Feeler;
    public feelerMR:Feeler;
    public feelerT:Feeler;

    public walkedTiles:XY[] = [];
    private ticksOnSameTile:number = 0;
    
    constructor (protected gameService:GameService, protected mapService:MapService, protected configService:ConfigService, selfInit:boolean = true){
        super(gameService, mapService, configService);
        this.createBrain ();
        this.createFeelers ();

        if(selfInit){
            this.brain.randomizeWeights ();
        }

    }


    public static fromJSON (json:JSON):AICharacter{
        return null;
    }

    public copy ():AICharacter {
        const other:AICharacter = new AICharacter (this.gameService, this.mapService, this.configService, false);
        other.brain.copyFrom (this.brain);
        return other;
    }

    public reset ():AICharacter {
        this.walkedTiles.length = 0; 
        return this;
    }

    public randomize ():void {
        this.brain.randomizeAnyConnection (.1);
    }

    public hasFeelers ():boolean {
        return true;
    }

    public get grade ():number {
        return this.walkedTiles.length;
    }

    public tick ():void {
        
        // this.updateFeelersAndInputs ();
        
       // this.moveForward (MathUtils.clamp01 (this.outForward.output));
       // this.rotate (MathUtils.clampNegPos (this.outRotate.output));

        this.checkKeyboard ();

        if(!this.checkPoints (this.x, this.y, this.viewAngle)){
       //      this.gameService.removeCharacter(this);
        }

       // this.evaluteWalking ();
    }

    private evaluteWalking ():void {
        const lastTile:XY = this.walkedTiles[this.walkedTiles.length-1];
        const nowCol:number = this.mapService.xToCol(this.x);
        const nowRow:number = this.mapService.yToRow(this.y);
        if(lastTile == null){
            this.walkedTiles.push({x:nowCol, y:nowRow});
        }else{
            if(lastTile.x != nowCol || lastTile.y != nowRow){      
                this.ticksOnSameTile = 0;
                const index:number = this.walkedTiles.findIndex( (value) => {
                    return value.x == nowCol && value.y == nowRow;
                });
                if(index >= 0){
                    this.walkedTiles = this.walkedTiles.slice (0, index+1);
                }else{
                    this.walkedTiles.push({x:nowCol, y:nowRow});
                }
            }else{
                ++this.ticksOnSameTile;
                if(this.ticksOnSameTile == 60){
                    this.gameService.removeCharacter (this);
                }
            }
        }
    }

    private checkKeyboard ():void {
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

    private createBrain ():void {
        this.brain = new NeuralNetwork ();

        this.inTL = new InputNeuron (NeuronIds.TL);
        this.inTR = new InputNeuron (NeuronIds.TR);
        this.inML = new InputNeuron (NeuronIds.ML);
        this.inMR = new InputNeuron (NeuronIds.MR);
        this.inT = new InputNeuron (NeuronIds.T);

        this.brain.addInputNeuron (this.inTL);
        this.brain.addInputNeuron (this.inTR);
        this.brain.addInputNeuron (this.inML);
        this.brain.addInputNeuron (this.inMR);
        this.brain.addInputNeuron (this.inT);


        this.outForward = new WorkingNeuron (NeuronIds.Forward);
        this.outRotate = new WorkingNeuron (NeuronIds.Rotate);

        this.brain.addOutputNeuron (this.outForward);
        this.brain.addOutputNeuron (this.outRotate);

        this.brain.generateMesh ();
        this.brain.setConnectionTargets ();

    }

    private createFeelers ():void {
        this.feelerTL = new Feeler (0, 0, -this.feelerDist, -this.feelerDist);
        this.feelerTR = new Feeler (0, 0, this.feelerDist, -this.feelerDist);
        this.feelerML = new Feeler (0, 0, -this.feelerDist, 0);
        this.feelerMR = new Feeler (0, 0, this.feelerDist, 0);
        this.feelerT = new Feeler (0, 0, 0, -this.feelerDist*1.5);
    }

    private updateFeelersAndInputs ():void {
        
        this.updateFeeler (this.feelerTL);
        this.updateFeeler (this.feelerTR);
        this.updateFeeler (this.feelerML);
        this.updateFeeler (this.feelerMR);
        this.updateFeeler (this.feelerT);

        this.inTL.input = this.feelerTL.freeSpaceValue;
        this.inTR.input = this.feelerTR.freeSpaceValue;
        this.inML.input = this.feelerML.freeSpaceValue;
        this.inMR.input = this.feelerMR.freeSpaceValue;
        this.inT.input = this.feelerT.freeSpaceValue;
    }   

    private updateFeeler (feeler:Feeler):void {
        feeler.freeSpaceValue = 1;
        for(let i:number = 1; i > .2; i -= .1){
            if(this.checkPointIsOnWall (feeler.endX*i, feeler.endY*i)){
                feeler.freeSpaceValue = i;
            }            
        }
    } 

    private checkPointIsOnWall (distX:number, distY:number):boolean {
        const p:XY = MathUtils.rotateXY (distX, distY, this.viewAngle, 0, 0);
        if(this.mapService.getTileAt (this.x + p.x, this.y + p.y) == 0) {
            return true;
        }else{
            return false;
        }
    }

}
