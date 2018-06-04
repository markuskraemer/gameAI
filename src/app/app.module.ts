import { FormatterService } from './utils/Formatter.service';
import { CharacterPreviewComponent } from './ui/character-preview/character-preview.component';
import { CharactersStorageListComponent } from './ui/characters-storage-list/characters-storage-list.component';
import { DialogsComponent } from './ui/dialogs/dialogs.component';
import { DialogService } from './ui/dialogs/dialog.service';
import { StorageService } from './storage/storage.service';
import { NeuralNetworkComponent } from './ui/neuralNetwork/neuralNetwork.component';
import { ConfigService } from './config.service';
import { TickService } from './tick.service';
import { KeyboardService } from './game/Keyboard.service';
import { CharacterComponent } from './game/character/character.component';
import { GameService } from './game/game.service';
import { MapService } from './game/map.service';
import { MapComponent } from './game/map/map.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    CharacterComponent,
    NeuralNetworkComponent,
    DialogsComponent,
    CharactersStorageListComponent,
    CharacterPreviewComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
      MapService,
      GameService,
      KeyboardService,
      TickService,
      ConfigService,
      StorageService,
      DialogService,
      FormatterService
      
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
