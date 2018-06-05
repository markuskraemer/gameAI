import { AICharacter } from './../../game/AICharacter';
import { StorageService } from './../../storage/storage.service';
import { Character } from './../../game/Character';
import { GameService } from './../../game/game.service';

import { FormatterService } from './../../utils/Formatter.service';
import { DialogService } from '../dialogs/dialog.service';
import { IStorageDescribtion } from '../../storage/IStorageDescribtion';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/dialog.js';

@Component({
  selector: 'app-characters-storage-list',
  templateUrl: './characters-storage-list.component.html',
  styleUrls: ['./characters-storage-list.component.css']
})
export class CharactersStorageListComponent implements OnInit {

    @Input ('items')
    public items:IStorageDescribtion[];

    @ViewChild ('dialog')
    private dialog:ElementRef;

    constructor(
        private gameService:GameService,
        private storageService:StorageService,
        private dialogService:DialogService,
        public formatterService:FormatterService
    ) { }

    ngOnInit() {
        $(this.dialog.nativeElement).dialog ({
            close: () => this.dialogService.closeStorageList (),
            width:500
        })
    }

    public handleLoadClick (item:IStorageDescribtion):void {
        this.gameService.loadAndAddCharacter(item.id);
    }

    public handleDeleteClick(item:IStorageDescribtion):void {
        this.storageService.delete(item.id);
    } 

    public handlePreviewClick (json:JSON) {
         this.gameService.inspectedCharacter = this.getCharacter(json);
    }

    public getCharacter (json:JSON){
        return AICharacter.fromJSON (json);
    }
}
