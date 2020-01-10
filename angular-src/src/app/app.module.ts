import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { ClickOutsideDirective } from './directives/dropdown.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { UlazneFaktureComponent } from './components/ulazneFakture/ulazneFakture.component';
import { ArhivaComponent } from './components/arhiva/arhiva.component';
import { MagacinComponent } from './components/magacin/magacin.component';
import { NavigacijaComponent } from './components/navigacija/navigacija.component';
import { IzlazComponent } from './components/izlaz/izlaz.component';
import { UlazComponent } from './components/ulaz/ulaz.component';
import { IzlazneFaktureComponent } from './components/izlazneFakture/izlazneFakture.component';
import { DobavljaciComponent } from './components/dobavljaci/dobavljaci.component';
import { ArtikalComponent } from './components/artikal/artikal.component';
import { UlaznaFakturaComponent } from './components/ulazna-faktura/ulazna-faktura.component';
import { IzlaznaFakturaComponent } from './components/izlazna-faktura/izlazna-faktura.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { AppGuard } from './guards/app.guard';
import { DateService } from './services/date.service';
import { InvoiceService } from './services/neo4j/invoice.service';
import { ItemService } from './services/neo4j/item.service';
import { SupplierService } from './services/redis/supplier.service';
import { WarehouseService } from './services/redis/warehouse.service';
import { DataService } from './services/data.service';


const appRoutes: Routes = [
{path: '', component: HomeComponent, canActivate: [AppGuard]},
{path: 'login', component: LogInComponent, canActivate: [AppGuard]},
{path: 'ulaznefakture', component: UlazneFaktureComponent, canActivate: [AuthGuard]},
{path: 'arhiva', component: ArhivaComponent, canActivate: [AuthGuard]},
{path: 'magacin', component: MagacinComponent, canActivate: [AuthGuard]},
{path: 'ulaz', component: UlazComponent, canActivate: [AuthGuard]},
{path: 'izlaz', component: IzlazComponent, canActivate: [AuthGuard]},
{path: 'izlaznefakture', component: IzlazneFaktureComponent, canActivate: [AuthGuard]},
{path: 'dobavljaci', component: DobavljaciComponent, canActivate: [AuthGuard]},
{path: 'izlaznafaktura', component: IzlaznaFakturaComponent, canActivate: [AuthGuard]},
{path: 'ulaznafaktura', component: UlaznaFakturaComponent, canActivate: [AuthGuard]},
{path: 'artikl', component: ArtikalComponent, canActivate: [AuthGuard]}
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
    IzlazneFaktureComponent,
    DobavljaciComponent,
    ArtikalComponent,
    UlaznaFakturaComponent,
    IzlaznaFakturaComponent,
    ClickOutsideDirective
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
    DateService,
    InvoiceService,
    ItemService,
    SupplierService,
    WarehouseService,
    DataService,
    AuthGuard,
    AppGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
