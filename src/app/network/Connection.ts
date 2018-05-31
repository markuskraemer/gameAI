import { Neuron } from './Neuron';

export class Connection
{
    public weight: number;
    public newWeight: number;
    public id: string;
    public fromNeuron:Neuron;
    
    public static fromJSON (json:any):Connection {
        const connection:Connection = new Connection ();
        connection.weight = json['weight'];
        return connection;
    }
    
    constructor(){

    }

    public updateWeight(): void
    {
        this.weight = this.newWeight;
    }

    public toJSON ():any {
        let { weight } = this;
        return { weight };
    }
}