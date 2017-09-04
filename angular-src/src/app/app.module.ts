import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ArhivaComponent } from './components/arhiva/arhiva.component';
import { MagacinComponent } from './components/magacin/magacin.component';
import { NavigacijaComponent } from './components/navigacija/navigacija.component';
import { IzlazComponent } from './components/izlaz/izlaz.component';
import { UlazComponent } from './components/ulaz/ulaz.component';

const appRoutes: Routes = [
{path: '', component: HomeComponent},
{path: 'login', component: LogInComponent},
{path: 'fakture', component: DashboardComponent},
{path: 'arhiva', component: ArhivaComponent},
{path: 'magacin', component: MagacinComponent},
{path: 'ulaz', component: UlazComponent},
{path: 'izlaz', component: IzlazComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    LogInComponent,
    DashboardComponent,
    ArhivaComponent,
    MagacinComponent,
    NavigacijaComponent,
    IzlazComponent,
    UlazComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
