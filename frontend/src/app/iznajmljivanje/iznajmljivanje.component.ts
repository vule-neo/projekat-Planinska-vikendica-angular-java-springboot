import { Component, inject } from '@angular/core';
import { Rezervacija } from '../models/Rezervacija';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RezervacijaService } from '../services/rezervacija.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { VikendicaService } from '../services/vikendica.service';
import { User } from '../models/User';



@Component({
  selector: 'app-iznajmljivanje',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './iznajmljivanje.component.html',
  styleUrl: './iznajmljivanje.component.css'
})



export class IznajmljivanjeComponent {
  rezervacija : Rezervacija = new Rezervacija()
  vikendica = ""
  cijena : Number = 0
  user : User = new User()
  authService = inject(AuthService)
  
  rezervacijaService = inject(RezervacijaService)
  vikendicaService = inject(VikendicaService)

  constructor(private route : ActivatedRoute){}
  ngOnInit() {
    const naziv = this.route.snapshot.paramMap.get('naziv');
    if (naziv){
      this.vikendica = naziv;
      this.rezervacija.vikendica = naziv;
    }
  
    this.rezervacija.vikendica = this.vikendica;
    const user = this.authService.getUser();
    if (user){
      this.user = user;
      this.rezervacija.korisnik = user.username;
      this.rezervacija.brojKartice = user.creditCardNumber
    }
    
  }
  step = 1

  goToStep2() {
      if (!this.rezervacija.datumPocetka || !this.rezervacija.datumKraja) {
        alert('Morate uneti datume!');
        return;
      }
      if (this.rezervacija.datumKraja < this.rezervacija.datumPocetka) {
        alert('Datum kraja ne može biti pre datuma početka!');
        return;
      }
      if ((this.rezervacija.brojOdraslih < 0 || this.rezervacija.brojDece < 0) ||(this.rezervacija.brojDece==0 && this.rezervacija.brojOdraslih==0)) {
        alert('Broj osoba nije odgovarajuc!');
        return;
      }
      this.racunajCijenu();
      this.step = 2;
    }

    submit() {
      if (this.rezervacija.opis.length > 500) {
        alert('Opis ne može biti duži od 500 karaktera!');
        return;
      }

      this.rezervacijaService.provjeriDatum(this.rezervacija.datumPocetka, this.rezervacija.datumKraja, this.rezervacija.vikendica).subscribe(data=>{
        if (data == -1){
          alert("Izabran datum nije dostupan.")
          return
        }
      })

      this.rezervacijaService.dodajRezervaciju(this.rezervacija).subscribe(data => {
        if (data == -1){
          alert('Došlo je do greške prilikom slanja rezervacije!');
        }else{
          alert("Rezervacija poslata!")
        }
      })

      
      
    }

    racunajCijenu(){
      this.vikendicaService.racunajCijenu(this.rezervacija).subscribe(data=>{
        if (data == -1){
          alert("Doslo je do greske prilikom racunanja cijene.")
        }else {
          this.cijena = data;
          this.rezervacija.cena = data.valueOf();

        }
      })
    }


}
