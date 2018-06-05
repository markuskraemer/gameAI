import { TickService } from './../../tick.service';
import { MathUtils } from './../../utils/MathUtils';
import { Connection } from './../../network/Connection';
import { WorkingNeuron } from './../../network/WorkingNeuron';
import { NeuralNetwork } from './../../network/NeuralNetwork';
import { Neuron } from './../../network/Neuron';
import { Component, OnInit, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-neuralNetwork',
  templateUrl: './neuralNetwork.component.html',
  styleUrls: ['./neuralNetwork.component.css']
})
export class NeuralNetworkComponent implements OnInit {

    @Input('network')
    public set network (n:NeuralNetwork) {
        this._network = n;
        // this.infoConnections.length = 0;
        this.determineContext ();
        requestAnimationFrame ( () => this.draw ());
        this.draw (); 
    }

    public get network ():NeuralNetwork {
        return this._network;
    }

    @ViewChild ('canvas')
    public canvas:ElementRef;

    private infoConnectionNames:string [] = [];
    private marginTopBottom:number = 20;
    private context:CanvasRenderingContext2D;
    private width:number;
    private height:number;
    private radius:number;
    private _network:NeuralNetwork;

    constructor(
        private elementRef:ElementRef,
        private tickService:TickService
    ) { }

    ngOnInit() {
        this.determineContext ();
        this.tickService.tick.subscribe ( () => this.draw ());
        this.draw ();
    }

    private determineContext (){
        const canvas:HTMLCanvasElement = this.canvas.nativeElement;
        this.context = canvas.getContext ('2d');        
    }


    public get canvasWidth ():number {
        return this.elementRef.nativeElement.clientWidth;
    }

    public get canvasHeight ():number {
        return this.elementRef.nativeElement.clientHeight;
    }


    private draw ():void {
        this.radius = 10;
        this.width = this.context.canvas.width;
        this.height = this.context.canvas.height;
        this.context.clearRect (0, 0, this.width, this.height);
        
        if(this._network){

            this.context.lineWidth = 1;
            this.context.strokeStyle = 'black';

            this.drawOutputLayer ();
            this.drawInputLayer ();
            this.drawConnections ();
            this.drawOutputs ();
            this.drawInputs ();
        }
    }

    // this is a test func
    private drawSquare ():void {
        this.context.strokeStyle = 'red';
        this.context.strokeRect (10,10,200,100);
    }


    private drawOutputLayer ():void {
        this.context.strokeStyle = 'black';

        for(let i:number = 0; i < this._network.outputLayer.length; ++i){
            const neuron:Neuron = this._network.outputLayer[i];
            this.context.beginPath();
            this.context.arc(this.getOutputNeuronX (i), this.getOutputNeuronY (i), this.radius, 0, 2 * Math.PI, false);
            this.context.stroke();
            this.context.font = '10px Arial';
            this.context.lineWidth = 1;
            this.context.strokeText (neuron.id, this.getOutputNeuronX (i) + this.radius + 10, this.getOutputNeuronY (i) + 5);

            this.context.lineWidth = .5;
            this.context.strokeText (String(MathUtils.round3 (neuron.output)), this.getOutputNeuronX (i) + this.radius + 10, this.getOutputNeuronY (i) + 22);
        }
    }

    private drawInputLayer ():void {
        this.context.strokeStyle = 'black';

        for(let i:number = 0; i < this._network.inputLayer.length; ++i){
            const neuron:Neuron = this._network.inputLayer[i];
            this.context.beginPath();
            this.context.arc(this.getInputNeuronX (i), this.getInputNeuronY (i), this.radius, 0, 2 * Math.PI, false);
            this.context.stroke();

            this.context.font = '10px Arial';
            this.context.lineWidth = 1;
            this.context.strokeText (neuron.id, this.getInputNeuronX (i) - this.radius - 80, this.getInputNeuronY (i) + 5);

            this.context.lineWidth = .5;
            this.context.strokeText (String(MathUtils.round3 (neuron.output)), this.getInputNeuronX (i) - this.radius - 80, this.getInputNeuronY (i) + 22);
        }
    }

    private drawOutputs ():void {
        for(let i:number = 0; i < this._network.outputLayer.length; ++i){
            const neuron:Neuron = this._network.outputLayer[i];
            this.context.beginPath();
            this.context.fillStyle = this.getColor (neuron.output);
            this.context.arc(this.getOutputNeuronX (i), this.getOutputNeuronY (i), Math.abs(neuron.output) * this.radius, 0, 2 * Math.PI, false);
            this.context.fill();
        }
    }

    private drawInputs ():void {
        for(let i:number = 0; i < this._network.inputLayer.length; ++i){
            const neuron:Neuron = this._network.inputLayer[i];
            this.context.beginPath();
            this.context.fillStyle = this.getColor (neuron.output);
            this.context.arc(this.getInputNeuronX (i), this.getInputNeuronY (i), Math.abs(neuron.output) * this.radius, 0, 2 * Math.PI, false);
            this.context.fill();
        }
    }


    private drawConnections ():void {
        for(let i:number = 0; i < this._network.outputLayer.length; ++i){
            const neuron:WorkingNeuron = this._network.outputLayer[i];
            for(let j:number = 0; j < neuron.connections.length; ++j){
                const connection:Connection = neuron.connections[j];
                const startX:number = this.getInputNeuronX (j);
                const startY:number = this.getInputNeuronY (j);

                const endX:number = this.getOutputNeuronX (i);
                const endY:number = this.getOutputNeuronY (i);

                const drawInfo:boolean = this.infoConnectionNames.indexOf (connection.id) >= 0; 

                this.context.lineWidth = drawInfo ? 3 : 1;
            
                this.context.strokeStyle = this.getColor (connection.weight);
                this.context.beginPath ();
                this.context.moveTo (endX, endY);
                this.context.lineTo (startX, startY);
                this.context.stroke ();

                if(drawInfo){
                    this.context.lineWidth = .5;
                    this.context.strokeStyle = 'black';
                    this.context.fillStyle = 'white';
                    this.context.fillRect (startX + (endX - startX) / 2 - 5, 
                                      startY + (endY - startY) / 2 - 20,
                                      35,
                                      20);
                    this.context.strokeText (String(MathUtils.round3(connection.weight)), 
                                                startX + (endX - startX) / 2, 
                                                startY + (endY - startY) / 2 - 5);
                }

            
            }
        }        
    }


    private getColor (n:number):string {

        if(n < 0){
            return 'rgb(' + n * -255 + ',0,0)';
        }else{
            return 'rgb(0,' + n * 255 + ',0)';
        }
    }

    private getOutputNeuronX (index:number):number {
        return this.width - 100 - this.radius;
    }

    private getInputNeuronY (index:number):number {
        return this.getNeuronYByNeuronCount(index, this._network.inputLayer.length);
    }

    private getOutputNeuronY (index:number):number {
        return this.getNeuronYByNeuronCount(index, this._network.outputLayer.length);
    }

    private getNeuronYByNeuronCount (index:number, neuronCount:number):number {
        const offset:number = (this.height - this.radius*2 - this.marginTopBottom*2) / (neuronCount-1);  
        return offset * index + this.radius + this.marginTopBottom;

    }


    private getInputNeuronX (index:number):number {
        return 100 + this.radius;
    }

    public handleClick (event:MouseEvent):void {
        const neuron:WorkingNeuron = this.getOutputNeuronUnderPoint (event.offsetX, event.offsetY);
        this.hideAllConnectionInfos ();
        if(neuron != null){
            for(const connection of neuron.connections){
                this.showConnectionInfo (connection.id);
            }
        }else{
            const connection:Connection = this.getConnetionUnderPoint (event.offsetX, event.offsetY);
            if(connection != null){
                this.showConnectionInfo (connection.id);
            }else{
                
            }
        }
        this.draw ();
    }


    private getConnetionUnderPoint (x:number, y:number):Connection {
        
        for(let outIndex:number = 0; outIndex < this._network.outputLayer.length; ++outIndex){
            const outX:number = this.getOutputNeuronX(outIndex);
            const outY:number = this.getOutputNeuronY(outIndex);
    
            const outNeuron:WorkingNeuron = this._network.outputLayer[outIndex];

            for(let connIndex:number = 0; connIndex < outNeuron.connections.length; ++connIndex){
                const inX:number = this.getInputNeuronX(connIndex);
                const inY:number = this.getInputNeuronY(connIndex);

                const isOnLine:boolean = MathUtils.pointIsOnLine (outX, outY, inX, inY, x, y, .5);

                if(isOnLine){
                    console.log (x, x, isOnLine);
                    return outNeuron.connections[connIndex];
                }
            }
        }
        return null;
    }

    private getOutputNeuronUnderPoint (x:number, y:number):WorkingNeuron {
        
        for(let i:number = 0; i < this._network.outputLayer.length; ++i){
            if(MathUtils.distance (this.getOutputNeuronX (i), this.getOutputNeuronY(i), x, y) < this.radius){
                return this._network.outputLayer[i];
            }
        }
        return null;
    }


    private showConnectionInfo (connectionName:string):void {
        console.log("connectionInfo: ", connectionName);
        if(this.infoConnectionNames.indexOf(connectionName) == -1){
            this.infoConnectionNames.push(connectionName);
        }
    }

    private hideAllConnectionInfos ():void {
        console.log("hideAllConnectionInfos");
        this.infoConnectionNames.length = 0;
    }
}
