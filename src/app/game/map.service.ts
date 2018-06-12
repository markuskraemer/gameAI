import { Alias } from './../Alias';
import { ConfigService } from './../config.service';
import { IMapData } from './IMapData';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MapService {

    public get tileSize ():number {
        return this.configService.tileSize;
    }
    
    private mapJSON:any;
    private _loaded:boolean;
    public maps:any[] = [];

    public get loaded ():boolean {
        return this._loaded;
    }

    constructor(
         private http: Http,
         private configService:ConfigService
    ) {
        Alias.mapService = this;
        this.loadConfig ();
    }

  private loadConfig(): void {
        this._loaded = false;
        this.http
            .get('assets/maps/map2.json')
            .map((res: Response) => res.json())
            .subscribe((data: any) => {
                this.mapJSON = data;
                this.createMaps ();
                this._loaded = true;             
            });
    }

    private createMaps ():void {
        console.log("createMaps: ", this.mapJSON.layers);
        console.log("createMaps: ", this.mapJSON.layers.length);
        for(let i:number = 0; i < this.mapJSON.layers.length; ++i){
            const layer:any = this.mapJSON.layers[i];
            console.log(i + " -> ", layer);
            this.maps.push({title:layer.name});
        }
    }

    public get currentMap ():IMapData {
        return this.mapJSON ? this.mapJSON.layers[1] : null;
    }

    public get mapWidth ():number {
         if(!this.loaded){
             return 0;
         }
         return this.currentMap.width * this.tileSize;
     }

     public get mapHeight ():number {
         if(!this.loaded){
             return 0;
         }
         return this.currentMap.height * this.tileSize;
     }

     public getTileAt (x:number, y:number):number {
         const index:number = this.yToRow(y) * this.currentMap.width + this.xToCol(x);;
         return this.currentMap.data[index];
     }

     public xToCol (x:number):number {
        return Math.floor(x / this.tileSize);
     }

     public yToRow (y:number):number {
        return Math.floor(y / this.tileSize);
     }


}