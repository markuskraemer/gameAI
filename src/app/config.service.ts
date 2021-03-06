import { Alias } from './Alias';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ConfigService {

    constructor (){
        Alias.configService = this;
    }

    public readonly tileSize:number = 40;
    public readonly radPerRotation:number = 6;
    public readonly speed:number = 2;
    public readonly fps:number = 90;
    public readonly characterCount:number = 10;

}