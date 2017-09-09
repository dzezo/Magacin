import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FlashMessagesModule } from 'angular2-flash-messages';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { UlazneFaktureComponent } from './components/ulaznefakture/ulaznefakture.component';
import { ArhivaComponent } from './components/arhiva/arhiva.component';
import { MagacinComponent } from './components/magacin/magacin.component';
import { NavigacijaComponent } from './components/navigacija/navigacija.component';
import { IzlazComponent } from './components/izlaz/izlaz.component';
import { UlazComponent } from './components/ulaz/ulaz.component';
import { IzlazneFaktureComponent } from './components/izlaznefakture/izlaznefakture.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';



const appRoutes: Routes = [
{path: '', component: HomeComponent},
{path: 'login', component: LogInComponent},
{path: 'ulaznefakture', component: UlazneFaktureComponent},
{path: 'arhiva', component: ArhivaComponent},
{path: 'magacin', component: MagacinComponent},
{path: 'ulaz', component: UlazComponent},
{path: 'izlaz', component: IzlazComponent},
{path: 'izlaznefakture', component: IzlazneFaktureComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavBarComponent,
    LogInComponent,
    UlazneFaktureComponent,
    ArhivaComponent,
    MagacinComponent,
    NavigacijaComponent,
    IzlazComponent,
    UlazComponent,
    IzlazneFaktureComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule
  ],
  providers: [
    ValidateService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
