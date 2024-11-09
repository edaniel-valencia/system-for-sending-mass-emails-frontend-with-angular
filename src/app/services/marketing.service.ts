import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Email } from '../interfaces/email';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category';
import { Marketing } from '../interfaces/marketing';

@Injectable({
  providedIn: 'root'
})

export class MarketingService {

  private myAppUrl: string
  private myApiUrl: string
  constructor(private http: HttpClient) {
    this.myAppUrl = "http://localhost:3002/"
    this.myApiUrl = "api/marketing"
   }


   ReadAll(page: number = 1, size: number = 10): Observable<Marketing[]>{
    const params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    return this.http.get<Marketing[]>(`${this.myAppUrl}${this.myApiUrl}/readAll`, {params})
   }

   Delete(idMarketing: number): Observable<any>{
    console.log("User Service For Delete: ", idMarketing);

    return this.http.delete(`${this.myAppUrl}${this.myApiUrl}/delete/${idMarketing}`)
   }


}
