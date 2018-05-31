import { GameService } from './../game.service';
import { Alias } from './../../Alias';
import { IMapData } from '../IMapData';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
 private backbufferContext:CanvasRenderingContext2D;

    @ViewChild ('canvas')
    public canvas:ElementRef;

    private _mapData:IMapData;
    private forceDrawAll:boolean;

    @Input('mapData')
    public set mapData (value:IMapData){
        this._mapData = value;
        requestAnimationFrame(()=>this.draw());
    }


    constructor(
        private elementRef:ElementRef,
        public gameService:GameService
    ) { }

    ngOnInit() {
    }

    ngOnDestroy () {
    }

    private draw ():void {
        const tiles:number[] = this._mapData.data;
        let context:CanvasRenderingContext2D = this.canvas.nativeElement.getContext ('2d'); 
        for(let i:number = 0; i < tiles.length; ++i){
            const tile:number = tiles[i];
           
            const x:number = i % this._mapData.width * this.gameService.tileSize;
            const y:number = Math.floor(i / this._mapData.width) * this.gameService.tileSize;
            context.fillStyle = this.getBackgroundColor(tile);
            context.fillRect (x, y, this.gameService.tileSize, this.gameService.tileSize);
        }
    }

    public getBackgroundColor (tile:number):string {
        switch(tile) {            
            case 0:
                return 'grey';

            default:
                return 'white';
        }
    }


}
