import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Owner } from 'src/app/models/owner';


@Injectable({providedIn: 'root'})
export class OwnerService {
  public API = "//thawing-chamber-47973.herokuapp.com";
  public OWNER_API = this.API + "/owners";
  constructor(private http: HttpClient) {}
  obtenerOwners() {
    return this.http.get(this.OWNER_API);
  }
  obtenerOwner(id: string) {
    return this.http.get(this.API + "/owners/search/findByDni/?dni=" + id);
  }
  crearOwner(owner: Owner) {
    return this.http.post(this.OWNER_API, owner);
  }
  editarOwner(owner: Owner, href: string) {
    return this.http.put(href, owner);
  }
  borrarOwner(href: string) {
    return this.http.delete(href);
  }
}
