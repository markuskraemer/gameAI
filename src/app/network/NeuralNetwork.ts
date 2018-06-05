import { Connection } from './Connection';
import { WorkingNeuron } from './WorkingNeuron';
import { InputNeuron } from './InputNeuron';
import { Neuron } from './Neuron';

export class NeuralNetwork {

    private layers:Neuron[][] = [[]];

    private _inputLayer:InputNeuron[] = [];
    private _hiddenLayer:WorkingNeuron[] = [];
    private _outputLayer:WorkingNeuron[] = [];

    public get inputLayer ():InputNeuron[] {
        return this._inputLayer;
    }

    public get outputLayer ():WorkingNeuron[] {
        return this._outputLayer;
    }

    public get hiddenLayer ():WorkingNeuron[] {
        return this._hiddenLayer;
    }

    public addInputNeuron (inputNeuron:InputNeuron):void {
        this._inputLayer.push(inputNeuron);
    }

    public addHiddentNeuron (hiddenNeuron:WorkingNeuron):void {
        this._hiddenLayer.push (hiddenNeuron);
    }

    public setHiddenNeuronCount (count:number):void {
        this._hiddenLayer.length = 0;
        while(count-- > 0){
            const hiddenNeuron:WorkingNeuron = new WorkingNeuron ('hidden_' + this._hiddenLayer.length);
            this.addHiddentNeuron(hiddenNeuron);
        }
    }

    public addOutputNeuron (outputNeuron:WorkingNeuron):void {
        this._outputLayer.push (outputNeuron);
    }

    public generateMesh ():void {
        for(const outputNeuron of this._outputLayer){
            for(const inputNeuron of this._inputLayer){
                const connection:Connection = new Connection ();
                outputNeuron.addConnection (connection);
                connection.id = outputNeuron.id + "_" + inputNeuron.id;
            }
        }
    }

    public setConnectionTargets ():void {
        for(const outputNeuron of this._outputLayer){
            for(let i:number = 0; i < outputNeuron.connections.length; ++i){
                const connection:Connection = outputNeuron.connections[i];
                connection.fromNeuron = this._inputLayer[i]; 
            }
        } 
    } 

    public randomizeWeights ():void {
        for(const outputNeuron of this._outputLayer){
            for(const connection of outputNeuron.connections){
                connection.weight = Math.random () * 2 - 1; 
            }
        }        
    }

    public copyWeightsFrom (other:NeuralNetwork):void {


        for(let i:number = 0; i < this._outputLayer.length; ++i){
           for(let j:number = 0; j < this._outputLayer[i].connections.length; ++j){
                const connection:Connection = this._outputLayer[i].connections[j];
                connection.weight = other._outputLayer[i].connections[j].weight; 
            }
        }
    }

    public randomizeAnyConnection (f:number):void {
        const index1:number = Math.floor (Math.random () * this.outputLayer.length);
        const neuron:WorkingNeuron = this.outputLayer[index1];
        const index2:number = Math.floor (Math.random () * neuron.connections.length);
        const connection:Connection = neuron.connections[index2];
        connection.weight = Math.random () * 2 - 1;
    }


}
