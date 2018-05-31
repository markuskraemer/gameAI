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
    CharacterComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [
      MapService,
      GameService
      
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
