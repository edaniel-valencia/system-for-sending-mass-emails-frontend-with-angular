import { Component, OnInit } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from "./navbar/navbar.component";
import { MarketingComponent } from './marketing/marketing.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [HomeComponent, HeaderComponent, FooterComponent, NavbarComponent, MarketingComponent, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}