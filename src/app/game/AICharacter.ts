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

    constructor (protected gameService:GameService, protected mapService:MapService, protected configService:ConfigService){
        super(gameService, mapService, configService);
        this.createBrain ();
    }


    private createBrain ():void {
        this.brain = new NeuralNetwork ();
        this.inTL = new InputNeuron (NeuronIds.TL);
        this.inTR = new InputNeuron (NeuronIds.TR);
        this.inML = new InputNeuron (NeuronIds.ML);
        this.inMR = new InputNeuron (NeuronIds.MR);
        this.inT = new InputNeuron (NeuronIds.T);

        this.outForward = new WorkingNeuron (NeuronIds.Forward);
        this.outRotate = new WorkingNeuron (NeuronIds.Rotate);

        this.brain.addInputNeuron (this.inTL);
        this.brain.addInputNeuron (this.inTR);
        this.brain.addInputNeuron (this.inML);
        this.brain.addInputNeuron (this.inMR);
        this.brain.addInputNeuron (this.inT);

        this.brain.addOutputNeuron (this.outForward);
        this.brain.addOutputNeuron (this.outRotate);

        this.brain.generateMesh ();
        this.brain.randomizeWeights ();
    }

    private updateFeelers ():void {
        
        const tl:number = this.checkFeeler(-this.feelerDist, -this.feelerDist);
        const tr:number = this.checkFeeler( this.feelerDist, -this.feelerDist);
        const ml:number = this.checkFeeler( -this.feelerDist, 0);
        const mr:number = this.checkFeeler(  this.feelerDist, 0);
        const t:number = this.checkFeeler( 0, -this.feelerDist);
    
        this.inTL.input = tl;
        this.inTR.input = tr;
        this.inML.input = ml;
        this.inMR.input = mr;
        this.inT.input = t;

    }    

    private checkFeeler (distX:number, distY:number):number {

        for(let i:number = 1; i > .2; i -= .1){
            if(this.checkPointIsOnWay (distX*i, distY*i)){
                return i;
            }            
        }
    }

    private checkPointIsOnWay (distX:number, distY:number):boolean {
        const p:XY = MathUtils.rotateXY (distX, distY, this.viewAngle, 0, 0);
        if(this.mapService.getTileAt (this.x + p.x, this.y + p.y) == 0) {
            return false;
        }
        return true;
    }

}
