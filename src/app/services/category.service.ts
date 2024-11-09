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


   PostCategory(category: Category): Observable<any>{
    console.log("User Service For POST: ",category);
    
    return this.http.post(`${this.myAppUrl}${this.myApiUrl}/create`, category)
   }

   PatchCategory(category: Category, idCategory: number): Observable<any>{
    console.log("User Service For Patch: ",category);

    return this.http.patch(`${this.myAppUrl}${this.myApiUrl}/update/${idCategory}`, category)
   }

  //  DeleteUser(idUser: number): Observable<any>{
  //   console.log("User Service For Delete: ", idUser);

  //   return this.http.delete(`${this.myAppUrl}${this.myApiUrl}/delete/${idUser}`)
  //  }

}
