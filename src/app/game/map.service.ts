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
            .get('assets/maps/map.json')
            .map((res: Response) => res.json())
            .subscribe((data: any) => {
                this.mapJSON = data;   
                this._loaded = true;             
            });
    }

    public get currentMap ():IMapData {
        return this.mapJSON ? this.mapJSON.layers[0] : null;
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
         const r:number = Math.floor(x / this.tileSize);
         const c:number = Math.floor(y / this.tileSize);
         const index:number = c * this.currentMap.width + r;
         return this.currentMap.data[index];
     }

}