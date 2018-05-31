import { IMapData } from './IMapData';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MapService {

    private mapJSON:any;
    private _loaded:boolean;

    public get loaded ():boolean {
        return this._loaded;
    }


    constructor(
         private http: Http
    ) {
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

}