import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { manageConsultation } from '../models/manageConsultation';

@Injectable({
  providedIn: 'root'
})
export class ManageConsultationService {

  constructor(private _http: HttpClient) { }

  //Fetch All Data
  getAllConsultationData(): Observable<manageConsultation[]> {
    return this._http.get<manageConsultation[]>(`http://localhost:3000/getAllConsultationData`);
  }

  //Fetch Single Data
  getConsultationData(consultation_id: number): Observable<manageConsultation[]> {
    return this._http.get<manageConsultation[]>(`http://localhost:3000/getConsultationData`+`/`+consultation_id);
  }

  //Fetch Ongoing Consultation Data
  getOngoingConsultationData(): Observable<manageConsultation[]> {
    return this._http.get<manageConsultation[]>(`http://localhost:3000/getOngoingConsultationData`);
  }

  //Add Consultation Data
  saveConsultationData(consultationData: manageConsultation) {
    return this._http.post<any>(`http://localhost:3000/saveConsultationData`, consultationData).pipe(map(res => {
      return res;
    }));
  }

  //Update Consultation Data
  updateConsultationInfo(consultation_id: number, consultationData: manageConsultation) {
    return this._http.post<any>(`http://localhost:3000/updateConsultationInfo`+`/`+consultation_id, consultationData).pipe(map(res => {
      return res;
    }));
  }

  //Delete Consultation Data
  deleteConsultationData(consultation_id: number) {
    return this._http.delete<any>(`http://localhost:3000/deleteConsultationData`+`/`+consultation_id).pipe(map(res => {
      return res;
    }));
  }
}
