import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ievents } from '../../core/models/ievents';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-events',
  imports: [RouterLink],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class Events {
@Input() event:Ievents|any;
@Output() myAdd = new EventEmitter<string>() //send msg to parent component
  addToCart(){
    this.myAdd.emit("added");
  }

  constructor(){
    console.log(this.event);
  }
}
