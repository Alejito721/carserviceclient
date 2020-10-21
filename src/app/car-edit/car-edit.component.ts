import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../shared/car/car.service';
import { GiphyService } from '../shared/giphy/giphy.service';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { OwnerService } from '../shared/owner/owner.service';


@Component({
  selector: 'app-car-edit',
  templateUrl: './car-edit.component.html',
  styleUrls: ['./car-edit.component.css']
})
export class CarEditComponent implements OnInit, OnDestroy {
  car: any = {};
  owner: any[];
  sub: Subscription;
  formulario: FormGroup;
  ownerName: string = "Owner";
  ownerIdSelected: string = "";

  constructor(private route: ActivatedRoute,
              private router: Router,
              private carService: CarService,
              private giphyService: GiphyService,
              private ownerService: OwnerService) {
  }

  ngOnInit() {
    this.formulario = new FormGroup({
      href: new FormControl(""),
      name: new FormControl(""),
      ownerDni: new FormControl("")
    })
    this.getOwners();
    this.sub = this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.carService.get(id).subscribe((car: any) => {
          if (car) {
            if (car["ownerDni"] !== null && car["ownerDni"] !== "") {
              this.getOwner(car["ownerDni"]);
            }
            this.car = car;
            this.car.href = car._links.self.href;
            this.giphyService.get(car.name).subscribe(url => car.giphyUrl = url);
          } else {
            console.log(`Car with id '${id}' not found, returning to list`);
            this.gotoList();
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  gotoList() {
    this.router.navigate(['/car-list']);
  }

  save(form: NgForm) {
    if (form["href"] == undefined) {
      this.formulario.setValue({
        name: form.name,
        href: "",
        ownerDni: this.ownerIdSelected,
      });
    } else {
      this.formulario.setValue({
        name: form.name,
        href: form["href"],
        ownerDni: this.ownerIdSelected,
      });
    }
    console.log(this.formulario.value)
    this.carService.save(this.formulario.value).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));
  }

  remove(href) {
    this.carService.remove(href).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));
  }
  getOwners() {
    this.ownerService.obtenerOwners().subscribe((data) => {
      this.owner = data["_embedded"].owners.filter(ele =>{
        return ele.dni;
      });

    });
  }
  getOwner(id: string) {
    if (this.owner != undefined) {
      for (let index = 0; index < this.owner.length; index++) {
        const element = this.owner[index]["dni"];
        if (element == id) {
          this.ownerName = this.owner[index]["name"];
        }
      }
    }
  }

  saveOwner(owner:any){
    this.ownerIdSelected = owner;
    console.log(owner);
  }
}

