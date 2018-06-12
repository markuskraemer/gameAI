import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/selectmenu.js';


@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.scss']
})
export class DropDownComponent implements OnInit {

    private _list:any[];

    @Input('list')
    public set list (value:any[]){
        console.log("list: ", value);

        if(this._list != value){
            this._list = value;
            requestAnimationFrame ( () => {
                //const $selectmenu = $(this.select.nativeElement).selectmenu ();
                //console.log("selectmenu: ", $selectmenu);
            })

        }
        
    }

    public get list ():any[]{
        return this._list;
    }


    @ViewChild('select')
    public select:ElementRef;

    @Output ('change')
    public readonly change:EventEmitter<number> = new EventEmitter ();

    constructor() { }

    ngOnInit() {
        console.log("init");
    }
    
    public handleSelect (event):void {
        console.log("handleSelect ", event);
        // this.change.emit(event.target.selectedIndex);
    }   

}
