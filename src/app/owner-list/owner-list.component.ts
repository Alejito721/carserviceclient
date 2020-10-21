import { Component, OnInit } from '@angular/core';
import { OwnerService } from "../shared/owner/owner.service";

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.css']
})
export class OwnerListComponent implements OnInit {
  owners: any[];
  ownerSelected: any[] = [];
  constructor(private ownerService: OwnerService) { }

  ngOnInit() {
    this.getOwners();
  }


  getOwners() {
    this.ownerService.obtenerOwners().subscribe((data) => {
      this.owners = data["_embedded"].owners;
      for (let index = 0; index < this.owners.length; index++) {
        this.ownerSelected[index] = false;
      }
    });
  }
  delete() {
    for (let index = 0; index < this.ownerSelected.length; index++) {
      const element = this.ownerSelected[index];
      if (element) {
        let href = this.owners[index]["_links"]["self"]["href"];
        this.ownerService.borrarOwner(href).subscribe((data) => {
          this.owners.splice(index, 1);
        });
      }
    }
  }
  select(i: number) {
    this.ownerSelected[i] = !this.ownerSelected[i];
  }


}
