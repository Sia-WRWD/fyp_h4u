import { Injectable } from '@angular/core';
import { basicInfo } from '../models/basicInfo';

@Injectable({
  providedIn: 'root'
})
export class BasicInfoService {

  basicInfoData: Array<basicInfo> = ([
    {
      username: 'JcN@69',
      first_name: 'Sia',
      last_name: 'Chee Zhen',
      gender: 'm',
      birthday: 'Thu Aug 26 2021 14:36:53 GMT+0800 (Singapore Standard Time)'
    }
  ]);

  constructor() { }

  getBasicInfo() {
    return this.basicInfoData;
  }
}
