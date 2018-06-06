import { Connection } from './Connection';
import { WorkingNeuron } from './WorkingNeuron';
import { InputNeuron } from './InputNeuron';
import { Neuron } from './Neuron';

export class NeuralNetwork {

    private layers:Neuron[][] = [[],[]];

    public get inputLayer ():InputNeuron[] {
        return this.layers[0] as InputNeuron[];
    }

    public get outputLayer ():WorkingNeuron[] {
        return this.layers[this.layers.length-1] as WorkingNeuron[];
    }

    public get hiddenLayer ():WorkingNeuron[] {
        return this.layers.length == 3 ? this.layers[1] as WorkingNeuron [] : null;
    }

    public addInputNeuron (inputNeuron:InputNeuron):void {
        this.inputLayer.push(inputNeuron);
    }

    public addHiddentNeuron (hiddenNeuron:WorkingNeuron):void {
        this.hiddenLayer.push (hiddenNeuron);
    }

    public setHiddenNeuronCount (count:number):void {
        if(this.layers.length == 2){
            this.layers.splice (0, 0, []);
        }
        while(count-- > 0){
            const hiddenNeuron:WorkingNeuron = new WorkingNeuron ('hidden_' + this.hiddenLayer.length);
            this.addHiddentNeuron(hiddenNeuron);
        }
    }

    public addOutputNeuron (outputNeuron:WorkingNeuron):void {
        this.outputLayer.push (outputNeuron);
    }

    public generateMesh ():void {
        for(let layerIndex:number = this.layers.length-1; layerIndex >= 1; --layerIndex){
            const layer:WorkingNeuron[] = <WorkingNeuron[]> this.layers[layerIndex];
            const prevLayer:WorkingNeuron[] = <WorkingNeuron[]> this.layers[layerIndex-1];
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


    public setConnectionFromNeurons ():void {
        for(let layerIndex:number = this.layers.length-1; layerIndex >= 1; --layerIndex){
            const layer:WorkingNeuron[] = <WorkingNeuron[]> this.layers[layerIndex];
            const prevLayer:WorkingNeuron[] = <WorkingNeuron[]> this.layers[layerIndex-1];
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
        for(let layerIndex:number = this.layers.length-1; layerIndex >= 1; --layerIndex){
            const layer:WorkingNeuron[] = <WorkingNeuron[]> this.layers[layerIndex];
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
        for(let layerIndex:number = this.layers.length-1; layerIndex >= 1; --layerIndex){
            const layer:WorkingNeuron[] = <WorkingNeuron[]> this.layers[layerIndex];
            const otherLayer:WorkingNeuron[] = <WorkingNeuron[]> other.layers[layerIndex];
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
        const layerIndex:number = Math.floor (Math.random () * this.layers.length);
        const layer:WorkingNeuron[] = <WorkingNeuron[]> this.layers[layerIndex];

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
