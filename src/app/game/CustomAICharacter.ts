import { AICharacter } from './AICharacter';
export class CustomAICharacter extends AICharacter {

    protected setInitialConnectionWeights ():void {
        this.brain.setConnectionWeight (1, 0, 0, 0);        
        this.brain.setConnectionWeight (1, 0, 1, 1);        
        this.brain.setConnectionWeight (1, 0, 2, 0);        
        this.brain.setConnectionWeight (1, 0, 3, 0);        
        this.brain.setConnectionWeight (1, 0, 4, 0);        


        this.brain.setConnectionWeight (1, 1, 0, -2);        
        this.brain.setConnectionWeight (1, 1, 1, 0);        
        this.brain.setConnectionWeight (1, 1, 2, 2);        
        this.brain.setConnectionWeight (1, 1, 3, 0);        
        this.brain.setConnectionWeight (1, 1, 4, 0);        

    }


}
