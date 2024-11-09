import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  Aname: string | null = null
  Alastname: string | null = null
  Aid: number | null = null
  Aemail: string | null = null

  constructor(
    private router: Router,
    private _tokenServices: TokenService
  ) { }

  ngOnInit(): void {
    this.userData()
  }

  userData(){
  const userData = this._tokenServices.getUserData()
    if (userData) {
      this.Aname = userData.Aname
      this.Alastname = userData.Alastname
      this.Aemail = userData.Aemail
    }
  }
  CerrarSession() {
    localStorage.removeItem('myToken')
    this.router.navigate(['/'])
  }
}
