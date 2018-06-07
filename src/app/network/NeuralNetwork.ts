import { Connection } from './Connection';
import { WorkingNeuron } from './WorkingNeuron';
import { InputNeuron } from './InputNeuron';
import { Neuron } from './Neuron';

export class NeuralNetwork {

    private _layers:Neuron[][];

    public get inputLayer ():InputNeuron[] {
        return this._layers[0] as InputNeuron[];
    }

    public get outputLayer ():WorkingNeuron[] {
        return this._layers[this._layers.length-1] as WorkingNeuron[];
    }

    public get hiddenLayer ():WorkingNeuron[] {
        return this._layers.length == 3 ? this._layers[1] as WorkingNeuron [] : null;
    }

    public get layers ():Neuron[][]{
        return this._layers;
    }

    constructor (inputLayerCount:number, hiddenLayerCount:number, outputLayerCount:number)
    constructor (inputLayerCount:number, outputLayerCount:number)
    constructor (...args){
        this.createNeurons (args);
        this.connectAll ();
        this.setConnectionFromNeurons ();
    }

    private createNeurons (args){
        this._layers = [];
        for(let i:number = 0; i < args.length; ++i){
            this._layers[i] = [];
            for(let j:number = 0; j < args[i]; ++j){
                if(i == 0){
                    this._layers[i][j] = new InputNeuron ('input_' + j);
                }else if(i == args.length-1) {
                    this._layers[i][j] = new WorkingNeuron ('output_' + j);
                }else{
                    this._layers[i][j] = new WorkingNeuron ('hidden_' + i + '_' + j);                    
                }

            }
        }
    }


    public connectAll ():void {
        for(let layerIndex:number = this._layers.length-1; layerIndex >= 1; --layerIndex){
            const layer:WorkingNeuron[] = <WorkingNeuron[]> this._layers[layerIndex];
            const prevLayer:WorkingNeuron[] = <WorkingNeuron[]> this._layers[layerIndex-1];
            this.generateMeshOfLayer(layer, prevLayer);                
        }
    }

    private generateMeshOfLayer (layer:WorkingNeuron[], prevLayer:Neuron[]){
        for(let i:number = 0; i < layer.length; ++i){
            const curNeuron:WorkingNeuron = layer[i];
            for(let j:number = 0; j < prevLayer.length; ++j){
                const prevNeuron:Neuron = prevLayer[j];
                const connection:Connection = new Connection ();
                curNeuron.addConnection (connection);
                connection.id = curNeuron.id + "_" + prevNeuron.id;
            }
        }     
    }


    public addInputNeuron (inputNeuron:InputNeuron):void {
        this.inputLayer.push(inputNeuron);
    }

    public addHiddentNeuron (hiddenNeuron:WorkingNeuron):void {
        this.hiddenLayer.push (hiddenNeuron);
    }

    public setHiddenNeuronCount (count:number):void {
        if(this._layers.length == 2){
            this._layers.splice (1, 0, []);
        }
        while(count-- > 0){
            const hiddenNeuron:WorkingNeuron = new WorkingNeuron ('hidden_' + this.hiddenLayer.length);
            this.addHiddentNeuron(hiddenNeuron);
        }
    }

    public addOutputNeuron (outputNeuron:WorkingNeuron):void {
        this.outputLayer.push (outputNeuron);
    }

    public setConnectionFromNeurons ():void {
        for(let layerIndex:number = this._layers.length-1; layerIndex >= 1; --layerIndex){
            const layer:WorkingNeuron[] = <WorkingNeuron[]> this._layers[layerIndex];
            const prevLayer:WorkingNeuron[] = <WorkingNeuron[]> this._layers[layerIndex-1];
            this.setConnectionFromNeuronsOfLayer (layer, prevLayer);
        }
    } 

    private setConnectionFromNeuronsOfLayer (layer:WorkingNeuron[], prevLayer:Neuron[]):void {
        for(let i:number = 0; i < layer.length; ++i){
            const curNeuron:WorkingNeuron = layer[i];
            for(let j:number = 0; j < prevLayer.length; ++j){
                const prevNeuron:Neuron = prevLayer[j];
                curNeuron.connections[j].fromNeuron = prevLayer[j];
            }
        }
    }

    public randomizeWeights ():void {
        for(let layerIndex:number = this._layers.length-1; layerIndex >= 1; --layerIndex){
            const layer:WorkingNeuron[] = <WorkingNeuron[]> this._layers[layerIndex];
            this.randomizeWeightsOfLayer (layer);
        }        
    }

    private randomizeWeightsOfLayer (layer:WorkingNeuron[]):void{
        for(let i:number = 0; i < layer.length; ++i){
            for(const connection of layer[i].connections){
                connection.weight = Math.random () * 2 - 1; 
            }
        }
    }

    public copyWeightsFrom (other:NeuralNetwork):void {
        for(let layerIndex:number = this._layers.length-1; layerIndex >= 1; --layerIndex){
            const layer:WorkingNeuron[] = <WorkingNeuron[]> this._layers[layerIndex];
            const otherLayer:WorkingNeuron[] = <WorkingNeuron[]> other._layers[layerIndex];
            this.copyWeightsFromLayer(otherLayer, layer);
        }
    }

    private copyWeightsFromLayer (otherLayer:WorkingNeuron[], thisLayer:WorkingNeuron[]):void {
        for(let i:number = 0; i < thisLayer.length; ++i){
            for(let j:number = 0; j < thisLayer[i].connections.length; ++j){
                thisLayer[i].connections[j].weight =  otherLayer[i].connections[j].weight;
            }
        }        
    }


    public randomizeAnyConnection (f:number):void {
        const layerIndex:number = 1 + Math.floor (Math.random () * (this._layers.length-1));
        const layer:WorkingNeuron[] = <WorkingNeuron[]> this._layers[layerIndex];

        this.randomizeAnyConnectionLayer (layer);
    }

    private randomizeAnyConnectionLayer (layer:WorkingNeuron[]):void{
        const neuronIndex:number = Math.floor(Math.random() * layer.length);
        const neuron:WorkingNeuron = layer[neuronIndex];

        const connectionIndex:number = Math.floor (Math.random () * neuron.connections.length);
        const connection:Connection = neuron.connections[connectionIndex];

        connection.weight = Math.random () * 2 - 1;
    }


}
