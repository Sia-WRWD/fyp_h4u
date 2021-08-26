import { Injectable } from '@angular/core';
import { contactInfo } from '../models/contactInfo';

@Injectable({
  providedIn: 'root'
})
export class ContactInfoService {

  contactInfoData: Array<contactInfo> = ([
    {
      email: 'chinojen7@gmail.com',
      phone_number: '123456789'
    }
  ])

  constructor() { }

  getContactInfo() {
    return this.contactInfoData;
  }
}
