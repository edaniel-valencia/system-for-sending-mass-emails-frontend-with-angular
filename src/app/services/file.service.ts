import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }


  downloadFile(fileUrl: string, fileName: string){
    this.http.get(fileUrl, {responseType: 'blob'}).subscribe((blob) =>{
      saveAs(blob, fileName)
    })
  }
}
