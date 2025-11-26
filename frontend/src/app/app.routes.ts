import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { AdminpageComponent } from './adminpage/adminpage.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { UserloginComponent } from './userlogin/userlogin.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfilComponent } from './profil/profil.component';
import { DodajVikendicuComponent } from './dodaj-vikendicu/dodaj-vikendicu.component';
import { MojeVikendiceComponent } from './moje-vikendice/moje-vikendice.component';
import { UpdateVikendicaComponent } from './update-vikendica/update-vikendica.component';
import { TuristaVikendiceComponent } from './turista-vikendice/turista-vikendice.component';
import { VikendicaPregledComponent } from './vikendica-pregled/vikendica-pregled.component';
import { IznajmljivanjeComponent } from './iznajmljivanje/iznajmljivanje.component';
import { MojeRezervacijeComponent } from '../moje-rezervacije/moje-rezervacije.component';
import { RezervacijeVlasnikComponent } from '../rezervacije-vlasnik/rezervacije-vlasnik.component';
import { OceniRezervacijuComponent } from './oceni-rezervaciju/oceni-rezervaciju.component';
import { UrediKorisnikaComponent } from './uredi-korisnika/uredi-korisnika.component';

export const routes: Routes = [

    { path: "", component: HomeComponent },
    { path: "user/register", component: UserComponent },
    { path: "user/adminlogin", component: AdminloginComponent },
    { path: "user/adminpage", component: AdminpageComponent },
    { path: "user/changePassword", component: ChangepasswordComponent },
    { path: "user/login", component: UserloginComponent },
    { path: "user/profil", component: ProfilComponent },
    { path: "user/vikendice", component: TuristaVikendiceComponent },
    { path: "vikendica/dodajVikendicu", component: DodajVikendicuComponent },
    { path: "vikendica/mojeVikendice", component: MojeVikendiceComponent },
    { path: "vikendica/updateVikendica/:naziv", component: UpdateVikendicaComponent },
    { path: "vikendica/vikendicaPregled/:naziv", component: VikendicaPregledComponent },
    { path: "vikendica/iznajmljivanje/:naziv", component: IznajmljivanjeComponent },
    { path: "user/mojeRezervacije", component: MojeRezervacijeComponent },
    { path: "user/rezervacijeVlasnik", component: RezervacijeVlasnikComponent },
    { path: "user/oceniRezervaciju", component: OceniRezervacijuComponent },
    { path: "user/uredi", component: UrediKorisnikaComponent}

];
