import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Toast, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private router: Router,
    private toastr: ToastrService,

  ) { }

  canDeactivate(): boolean {
    const token = localStorage.getItem('myToken');
    if(!token){
      this.router.navigate(['/'])
      return false;
    }
    return true;
  }
}
