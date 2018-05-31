import { Connection } from './Connection';
import { WorkingNeuron } from './WorkingNeuron';
import { InputNeuron } from './InputNeuron';
export class NeuralNetwork {

    private _inputLayer:InputNeuron[] = [];
    private _outputLayer:WorkingNeuron[] = [];

    public get inputLayer ():InputNeuron[] {
        return this._inputLayer;
    }

    public get outputLayer ():WorkingNeuron[] {
        return this._outputLayer;
    }

    public addInputNeuron (inputNeuron:InputNeuron):void {
        this._inputLayer.push(inputNeuron);
    }

    public addOutputNeuron (outputNeuron:WorkingNeuron):void {
        this._outputLayer.push (outputNeuron);
    }

    public generateMesh ():void {
        for(const outputNeuron of this._outputLayer){
            for(const inputNeuron of this._inputLayer){
                const connection:Connection = new Connection ();
                outputNeuron.addConnection (connection);
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

    public randomizeAnyConnection (f:number):void {
        const index1:number = Math.floor (Math.random () * this.outputLayer.length);
        const neuron:WorkingNeuron = this.outputLayer[index1];
        const index2:number = Math.floor (Math.random () * neuron.connections.length);
        const connection:Connection = neuron.connections[index2];
        connection.weight += Math.random () * f * 2 - f;
    }


}
