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

    constructor (protected gameService:GameService, protected mapService:MapService, protected configService:ConfigService){
        super(gameService, mapService, configService);
        this.color = 'red';
        this.createBrain ();
        this.createFeelers ();
    }

    public hasFeelers ():boolean {
        return true;
    }

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

        this.updateFeelers ();
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
        this.brain.randomizeWeights ();
    }

    private createFeelers ():void {
        this.feelerTL = new Feeler (0, 0, -this.feelerDist, -this.feelerDist);
        this.feelerTR = new Feeler (0, 0, this.feelerDist, -this.feelerDist);
        this.feelerML = new Feeler (0, 0, -this.feelerDist, 0);
        this.feelerMR = new Feeler (0, 0, this.feelerDist, 0);
        this.feelerT = new Feeler (0, 0, 0, -this.feelerDist);
    }

    private updateFeelers ():void {
        
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
