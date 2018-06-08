import { Alias } from './../Alias';
import { AICharacter } from './AICharacter';
export class CustomAICharacter extends AICharacter {

    protected setInitialConnectionWeights ():void {
        this.brain.setConnectionWeight (1, 0, 0, 0);        
        this.brain.setConnectionWeight (1, 0, 1, 1);        
        this.brain.setConnectionWeight (1, 0, 2, 0);        

        this.brain.setConnectionWeight (1, 1, 0, -1);        
        this.brain.setConnectionWeight (1, 1, 1, 0);        
        this.brain.setConnectionWeight (1, 1, 2, 1);        

        this.brain.outputLayer[0].bias = -.1;

    }

    public _tick ():void{
        this.checkKeyboard ();
        this.updateFeelersAndInputs ();
    }
}
