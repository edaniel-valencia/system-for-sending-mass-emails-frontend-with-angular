import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from "./navbar/navbar.component";
import { RouterOutlet } from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
    selector: 'app-admin',
    imports: [HeaderComponent, FooterComponent, NavbarComponent, RouterOutlet],
    templateUrl: './admin.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './admin.component.css'
})
export class AdminComponent {

}