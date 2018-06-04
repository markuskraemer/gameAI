import { AICharacter } from './../../game/AICharacter';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-character-preview',
  templateUrl: './character-preview.component.html',
  styleUrls: ['./character-preview.component.scss']
})
export class CharacterPreviewComponent implements OnInit {

    @Input ('character')
    public character:AICharacter;    

    constructor() { }

    ngOnInit() {
    }

}
