
import { AICharacter } from './AICharacter';

describe ('creature test', () => {
    let seedCharacter:AICharacter;
    beforeAll (() => {
        seedCharacter = new AICharacter ();        
    })




 

    it('#creature copy test', () => {       
        const copy:AICharacter = seedCharacter.copy ();

        expect(seedCharacter.brain).not.toBe(copy.brain);
        expect(seedCharacter.brain.inputLayer[0]).not.toBe(copy.brain.inputLayer[0]);
        expect(seedCharacter.brain.outputLayer[0]).not.toBe(copy.brain.outputLayer[0]);
        expect(seedCharacter.brain.outputLayer[0].connections[0].weight).toEqual(copy.brain.outputLayer[0].connections[0].weight);
        expect(seedCharacter.brain.outputLayer[1].connections[1].weight).toEqual(copy.brain.outputLayer[1].connections[1].weight);


    })

    it('#creature to-from-json test', () => {
        const seedJsonStr:string = JSON.stringify(seedCharacter);
        console.log("seedJsonStr: ", JSON.parse(seedJsonStr));
        const copy:AICharacter = AICharacter.fromJSON(JSON.parse(seedJsonStr));
        const copyJsonStr:string = JSON.stringify(copy);
        console.log("copyJsonStr: ", JSON.parse(copyJsonStr));

        expect (seedCharacter.brain).toEqual(copy.brain);

    });

})