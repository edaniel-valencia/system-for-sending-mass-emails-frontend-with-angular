import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CategoryService } from '../../services/category.service';
import { MarketingService } from '../../services/marketing.service';
import { ConfigService } from '../../services/config.service';

@Component({
    selector: 'app-home',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  totalUsers: number = 0;
  totalCategories: number = 0;
  totalMarketing: number = 0;
  totalServers: number = 0;

  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private marketingService: MarketingService,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userService.ReadAll(1, 100000).subscribe(data => { this.totalUsers = data.length; this.cdr.detectChanges(); });
    this.categoryService.ReadAll().subscribe(data => { this.totalCategories = data.length; this.cdr.detectChanges(); });
    this.marketingService.ReadAll(1, 100000).subscribe(data => { this.totalMarketing = data.length; this.cdr.detectChanges(); });
    this.configService.GetServerEmail().subscribe(data => { this.totalServers = data.length; this.cdr.detectChanges(); });
  }
}
