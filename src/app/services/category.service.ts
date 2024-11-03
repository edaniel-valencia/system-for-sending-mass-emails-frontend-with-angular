import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Email } from '../interfaces/email';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})

export class CategoryService {

  private myAppUrl: string
  private myApiUrl: string
  constructor(private http: HttpClient) {
    this.myAppUrl = "http://localhost:3002/"
    this.myApiUrl = "api/category"
   }

   
   ReadAll(): Observable<Category[]>{
    
    return this.http.get<Category[]>(`${this.myAppUrl}${this.myApiUrl}/readAll`)
   }



}
