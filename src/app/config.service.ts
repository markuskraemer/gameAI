import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ConfigService {

    public readonly tileSize:number = 40;
    public readonly radPerRotation:number = 4;
    public readonly speed:number = 2;

}