import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent{

  constructor(private router: Router,
    private _fileService: FileService
  ){}

  settingServer(){
    this.router.navigate([`admin/setting-server`])

  }

  downloadFile(){
    const fileUrl = 'assets/matriz-tse.xlsx';
    const fileName  = 'Plantilla para la carga de listas de usuaurios en el sistema.xlsx';
    this._fileService.downloadFile(fileUrl, fileName)
  }
}
