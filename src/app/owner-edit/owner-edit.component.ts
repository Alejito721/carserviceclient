import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";
import { OwnerService } from "../shared/owner/owner.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-owner-edit',
  templateUrl: './owner-edit.component.html',
  styleUrls: ['./owner-edit.component.css']
})
export class OwnerEditComponent implements OnInit {

  owner: FormGroup;
  dni: string;
  href: string;
  creation: boolean = true;

  constructor( private ownerService: OwnerService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.owner = new FormGroup({
      name: new FormControl(),
      dni: new FormControl(),
      profession: new FormControl(),
    });
    this.route.paramMap.subscribe((params) => {
      this.dni = params.get("id");
      if (this.dni) {
        this.creation = false;
        this.ownerService.obtenerOwner(this.dni).subscribe((data) => {
          this.href = data["_embedded"]["owners"][0]["_links"]["self"]["href"];
          this.owner.setValue({
            name: data["_embedded"]["owners"][0]["name"],
            profession: data["_embedded"]["owners"][0]["profession"],
            dni: data["_embedded"]["owners"][0]["dni"],
          });
        });
      }
    });
  }

  create() {
    this.ownerService.crearOwner(this.owner.value).subscribe((data) => {
      this.router.navigateByUrl("/owner-list");
    });
  }
  save() {
    this.ownerService
      .editarOwner(this.owner.value, this.href)
      .subscribe((data) => {
        this.router.navigateByUrl("/owner-list");
      });
  }

}
