export class NetworkHistory
{
    private _history: JSON[] = [];

    public clear(): void
    {
        this._history.length = 0;
    }

    public add(json: JSON)
    {
        this._history.push(json);
    }

    public get history(): JSON[]
    {
        return this._history;
    } 

    public get length ():number {
        return this._history.length;
    }

    public getNeuronIds(hideInputNeurons:boolean = true, hideHiddenNeurons:boolean = true): string[]
    {
        var result: string[] = [];
        if (this._history.length > 0)
        {
            var layers: any[] = this._history[0]['neurons'];
            for (let i: number = 0; i < layers.length; ++i)
            {
                var isInputNeuron: boolean = i == 0;
                var isHiddenNeuron: boolean = i > 0 && i != layers.length - 1;
                if ((isInputNeuron && hideInputNeurons) || (isHiddenNeuron && hideHiddenNeurons))
                    continue;

                let layer: any[] = layers[i];
                for (let j: number = 0; j < layer.length; ++j)
                {
                    let neuron: any = layer[j];
                    result.push(neuron.id);
                }
            }
        }
        return result;
    }


    public getConnectionIds(): string[]
    {
        var result: string[] = [];
        if (this._history.length > 0)
        {
            var layers: any[] = this._history[0]['neurons'];
            for (let i: number = 0; i < layers.length; ++i)
            {
                let layer: any[] = layers[i];
                for (let j: number = 0; j < layer.length; ++j)
                {
                    let neuron: any = layer[j];
                    if (neuron.connections == null)
                        continue;

                    for (let k: number = 0; k < neuron.connections.length; ++k)
                    {
                        let connection: any = neuron.connections[k];
                        result.push(connection.id);
                    }

                }
            }
        }
        return result;
    }


    public getConnectionHistory(id: string, indicies: number[]): number[]
    {
        var result: number[] = [];
        for (let i: number = 0; i < indicies.length; i ++)
        {
            var layers: any[] = this._history[indicies[i]]['neurons'];
            for (let j: number = 0; j < layers.length; ++j)
            {
                let layer: any = layers[j];

                for (let k: number = 0; k < layer.length; ++k)
                {
                    let neuron: any = layer[k];               
                    if (neuron.connections != null)
                    {
                        var connection = neuron.connections.filter((value: any, index: number, obj: any[]) => { return value.id == id });
                        //console.log(i + " " + j + k + " connection " + connection + " id: " + id);

                        if (connection.length > 0)
                            result.push(connection[0].weight);
                    }
                }
            }
        }
        return result;
    }

    public getNeuronAtIndex(id: string, index: number): any
    {
        var layer: any[] = this._history[index]['neurons'];
        for (let j: number = 0; j < layer.length; ++j)
        {
            var neuron = layer[j].filter((value: any, index: number, obj: any[]) => { return value.id == id });
            if (neuron.length > 0)
                return (neuron[0]);
        }
    }


    public getNeuronPropAtIndicies (id: string, indicies: number[], prop:string): number[]
    {

        var result: number[] = [];
        for (let i: number = 0; i < indicies.length; i++)
        {
            let neuron: number = this.getNeuronAtIndex(id, indicies[i]);
            if (neuron != undefined)
                result.push(neuron[prop]);
        }
        return result;
    }    

    public getNeuronDeltaAtIndicies(id: string, indicies: number[]): number[]
    {
        return this.getNeuronPropAtIndicies(id, indicies, 'delta');
    }    

    public getNeuronOutputAtIndicies (id: string, indicies:number[]): number[]
    {
        return this.getNeuronPropAtIndicies(id, indicies, 'output');       
    }    

    public getNeuronTargetAtIndicies (id: string, indicies:number[]): number[]
    {
        return this.getNeuronPropAtIndicies(id, indicies, 'target');       
    }    


    public getSquaredErrorsHistory(indicies: number []): number[]
    {
        var result: number[] = [];
        for (let i: number = 0; i < indicies.length; i ++)
        {
            if(this.history[indicies[i]]){            
                result.push(this._history[indicies[i]]['squaredErrors'])
            }else{
                console.log("wtf? ", indicies[i]);
            }
        }
        return result;
    }
}