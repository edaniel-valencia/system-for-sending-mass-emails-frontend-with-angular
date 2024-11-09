import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private router: Router,
    private toastr: ToastrService,

  ) { }

  getToken(): string | null {
    return localStorage.getItem('myToken');

  }

  canDeactivate(): boolean {
    const token = this.getToken()
    if (!token) {
      this.router.navigate(['/'])
      return false;
    }
    return true;
  }


  getUserData(): { Aname: string | null; Alastname: string | null; Aid: number | null; Aemail: string | null } | null {
    const token = this.getToken()
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return {
          Aname: decoded.Aname || null,
          Alastname: decoded.Alastname || null,
          Aid: decoded.Aid || null,
          Aemail: decoded.Aemail || null
        }
      } catch (error) {
        console.log("Error al decodificar el token", error);
        return null

      }
    }
    return null
  }
}
