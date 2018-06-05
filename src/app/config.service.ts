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
    public readonly radPerRotation:number = 4;
    public readonly speed:number = 1;
    public readonly fps:number = 120;
    public readonly characterCount:number = 10;

}