import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ievents } from '../../../core/models/ievents';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-events',
  imports: [RouterLink],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class Events {
events_images:string[]=[];
@Input() event:Ievents|any;
@Output() myAdd = new EventEmitter<string>() //send msg to parent component
  addToCart(){
    this.myAdd.emit("added");
  }
  i:number=0
  constructor(){
    for(this.i;this.i<7;this.i++){
      this.events_images.push(`/assets/events/${this.i+1}.jpg`)
    }
  }
  randomImg(){
    const random = Math.floor(Math.random() * this.events_images.length);
    return this.events_images[random];
  }
}
