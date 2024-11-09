import { Routes } from '@angular/router';
import { CategoryComponent } from './admin/category/category.component';
import {  PageComponent } from './page/page.component';
import { UserComponent } from './admin/user/user.component';
import { CategoryUserComponent } from './admin/category-user/category-user.component';
import { ConfigComponent } from './admin/config/config.component';
import { MarketingComponent } from './admin/marketing/marketing.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './admin/home/home.component';
import { NotPageComponent } from './admin/not-page/not-page.component';
import { tokenGuard } from './guard/token.guard';

export const routes: Routes = [
    {path: '', component: PageComponent},
    {   
        path: 'admin', 
        component: AdminComponent,
        canActivate: [tokenGuard],
        children: [ 
            {path: '',  component: HomeComponent},
            {path: 'user', component: UserComponent},
            {path: 'group',  component: CategoryComponent},
            {path: 'masive', component: MarketingComponent},
            {path: 'setting-server', component: ConfigComponent},
            {path: 'userGroupId/:Cid', component: CategoryUserComponent},
            {path: 'setting-server', component: ConfigComponent},
            {path: 'not-page', component: NotPageComponent},
            {path: '**', redirectTo: 'not-page', pathMatch: 'full'}
        ]
    },
    {path: '**', redirectTo: '/', pathMatch: 'full'}

];



