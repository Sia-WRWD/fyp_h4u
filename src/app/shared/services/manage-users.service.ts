import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { registerUsers } from '../models/registerUsers';
import { Observable } from 'rxjs';
import { manageUsers } from '../models/manageUsers';
import { userInfo } from '../models/userInfo';
import { updateUser } from '../models/updateUser';

@Injectable({
  providedIn: 'root'
})
export class ManageUsersService {

  constructor(private _http: HttpClient) { }

  //Fetch All Data
  getAllUserData(): Observable<manageUsers[]> {
    return this._http.get<manageUsers[]>(`http://localhost:3000/getAllUserData`);
  }

  //Fetch One User Data
  getUserData(user_id: number): Observable<userInfo[]> {
    return this._http.get<userInfo[]>(`http://localhost:3000/getUserData`+`/`+user_id);
  }

  //Register
  saveUserData(registerData: registerUsers) {
    return this._http.post<any>(`http://localhost:3000/saveUserData`, registerData).pipe(map(res=> {
      return res;
    }));
  }

  //Save User Info
  updateUserInfo(user_id: number, updateUserData: updateUser) {
    return this._http.post<any>(`http://localhost:3000/updateUserInfo`+`/`+user_id, updateUserData).pipe(map(res => {
      return res;
    }));
  }

  //Delete User Info
  deleteUserData(user_id: number) {
    return this._http.delete<any>(`http://localhost:3000/deleteUserData`+`/`+user_id).pipe(map(res => {
      return res;
    }));
  }
}
