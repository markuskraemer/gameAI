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
import * as Color from 'color';


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
    public inT:InputNeuron;

    public outForward:WorkingNeuron;
    public outRotate:WorkingNeuron;

    public feelerTL:Feeler;
    public feelerTR:Feeler;
    public feelerT:Feeler;

    public feelers:Feeler[] = [];

    public walkedTiles:XY[] = [];
    private ticksOnSameTile:number = 0;
    
    constructor (selfInit:boolean = true){
        super();
        if(selfInit) {
         //   this.createNeurons ();
            this.createBrain ();
            this.brain.randomizeWeights ();
        }
        this.createFeelers ();
    }


    public static fromJSON (json:JSON):AICharacter{
        const character:AICharacter = new AICharacter (false);
        character.color = new Color(json['color'].color);
        
        character.createBrain ();
        character.brain.copyWeightsFrom (json['brain']);;

        return character;
    }

    private createBrainFromJSON (json:any):void {

    }


    public copy ():AICharacter {
        const other:AICharacter = new AICharacter (false);
       // other.createNeurons ();
        other.createBrain ();
        other.brain.copyWeightsFrom (this.brain);

        other.walkedTiles = this.walkedTiles.slice (this.walkedTiles.length-4);
        other.viewAngle = this.viewAngle;
        
        return other;
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
        
        this.updateFeelersAndInputs ();
        
        const outForward:WorkingNeuron = this.brain.outputLayer[0];
        const outRotate:WorkingNeuron = this.brain.outputLayer[1];

        this.moveForward (MathUtils.clamp01 (outForward.output));
        this.rotate (MathUtils.clampNegPos (outRotate.output));

        this.checkKeyboard ();

        if(!this.checkPoints (this.x, this.y, this.viewAngle)){
             Alias.gameService.removeCharacter(this);
        }

        this.evaluteWalking ();
    }

    public goBack (steps:number):void {
        steps = Math.min(this.walkedTiles.length, steps);
        while(steps-- > 0){
            this.walkedTiles.pop ();
        }
        if(this.walkedTiles.length > 0){
            const tileXY:XY = this.walkedTiles[this.walkedTiles.length-1];
            this.x = (tileXY.x + .5) * Alias.configService.tileSize;
            this.y = (tileXY.y + .5) * Alias.configService.tileSize;
        }
    }

    private evaluteWalking ():void {
        const lastTile:XY = this.walkedTiles[this.walkedTiles.length-1];
        const nowCol:number = Alias.mapService.xToCol(this.x);
        const nowRow:number = Alias.mapService.yToRow(this.y);
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
                    Alias.gameService.removeCharacter (this);
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

        this.brain = new NeuralNetwork (3,4,2);
        /*
        this.brain.addInputNeuron (this.inTL);
        this.brain.addInputNeuron (this.inTR);
        this.brain.addInputNeuron (this.inT);

        this.brain.addOutputNeuron (this.outForward);
        this.brain.addOutputNeuron (this.outRotate);

        this.brain.setHiddenNeuronCount (4);
        */
    }

/*
    private createNeurons ():void {
        this.inTL = new InputNeuron (NeuronIds.TL);
        this.inTR = new InputNeuron (NeuronIds.TR);
        //this.inML = new InputNeuron (NeuronIds.ML);
        //this.inMR = new InputNeuron (NeuronIds.MR);
        this.inT = new InputNeuron (NeuronIds.T);
        this.outForward = new WorkingNeuron (NeuronIds.Forward);
        this.outRotate = new WorkingNeuron (NeuronIds.Rotate);
    }
*/
    private createFeelers ():void {
        this.feelerT = new Feeler (0, 0, 0, -this.feelerDist*1.5);
        this.feelerTL = new Feeler (0, 0, -this.feelerDist, -this.feelerDist);
        this.feelerTR = new Feeler (0, 0, this.feelerDist, -this.feelerDist);
        
        this.feelers.push (this.feelerT, this.feelerTL, this.feelerTR);
    }

    private updateFeelersAndInputs ():void {
        
        for(const feeler of this.feelers){
            this.updateFeeler(feeler);
        }

        const inTL:InputNeuron = this.brain.inputLayer[0];
        const inTR:InputNeuron = this.brain.inputLayer[1];
        const inT:InputNeuron = this.brain.inputLayer[2];

        inTL.input = this.feelerTL.freeSpaceValue;
        inTR.input = this.feelerTR.freeSpaceValue;
        inT.input = this.feelerT.freeSpaceValue;
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
        if(Alias.mapService.getTileAt (this.x + p.x, this.y + p.y) == 0) {
            return true;
        }else{
            return false;
        }
    }

}
