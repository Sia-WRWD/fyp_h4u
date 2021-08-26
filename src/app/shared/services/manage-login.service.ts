import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { login } from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class ManageLoginService {

  constructor(private _http: HttpClient) { }

  verifyGrabUser(loginDetails: login) {
    return this._http.post<any>(`http://localhost:3000/verifyGrabUser`, loginDetails).pipe(map(res => {
      return res;
    }));
  }
}
