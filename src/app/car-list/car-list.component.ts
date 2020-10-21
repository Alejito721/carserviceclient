import { Component, OnInit } from '@angular/core';
import { CarService } from '../shared/car/car.service';
import { OwnerService } from "../shared/owner/owner.service";
import { GiphyService } from '../shared/giphy/giphy.service';


@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  cars: Array<any>;
  owners: any[] = [];
  owner: any[] = [];

  constructor(private carService: CarService, private giphyService: GiphyService, private ownerService: OwnerService) { }

  ngOnInit() {
    this.ownerService.obtenerOwners().subscribe(data=>{
      this.owners = data["_embedded"].owners;
      console.log(data)
      this.obtenerCars();
    });

  }

  /*searchOwner(id: string) {
    for (let index = 0; index < this.owners.length; index++) {
      const element = this.owners[index]["dni"];
      if (element == id) {
        this.owner.push(this.owners[index]["name"]);
      }
    }
  }*/
  obtenerCars(){
    this.carService.getAll().subscribe(data => {
      this.cars = data;
      for (const [index, car] of this.cars.entries()) {
        this.giphyService.get(car.name).subscribe(url => car.giphyUrl = url);
        if (car.ownerDni == null || car.ownerDni == "") {
          this.owner.push("No Owner");
        } else {
          this.getOwnerName(car.ownerDni,index);

      }
      }
    });
  }

  getOwnerName(ownerDni, i){
    this.ownerService.obtenerOwner(ownerDni).subscribe(data=>{
      console.log(data);
      this.cars[i].owner = data["_embedded"].owners[0];

    })
  }





}
