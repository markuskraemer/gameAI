import { Key } from 'ts-keycode-enum';
import { IStorageDescribtion } from './IStorageDescribtion';
import { IStorable } from './IStorable';
import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

    private key:string = 'characters';

    constructor() { }

    public load (id:string):string {
        const list = JSON.parse(localStorage.getItem(this.key));
        return list[id];
    }

    public delete (id:string):void {
        const list = JSON.parse(localStorage.getItem(this.key));
        list[id] = null;
        localStorage.setItem(this.key, JSON.stringify(list));
    }

    public save (o:IStorable):void {
        const list = JSON.parse(localStorage.getItem(this.key));
        list[o.id] = JSON.stringify(o);
        localStorage.setItem(this.key, JSON.stringify(list));
    }

    public getFileDescribtions ():IStorageDescribtion []{
        return [];
    }
}