import { Injectable } from '@angular/core';
import { userAddress } from '../models/userAddress';

@Injectable({
  providedIn: 'root'
})
export class UserAddressService {

  userAddressData: Array<userAddress> = ([
    {
      address: "No 23 Jalan Thomas Off Taman Thomas",
      postcode: "41300",
      city: "Sri Ampang",
      state: "Kuala Lumpur"
    }
  ])

  constructor() { }

  getUserAddress() {
    return this.userAddressData;
  }
}
