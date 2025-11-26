import { Component, inject } from '@angular/core';
import { RezervacijaService } from '../app/services/rezervacija.service';
import { Rezervacija } from '../app/models/Rezervacija';
import { AuthService } from '../app/services/auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-moje-rezervacije',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './moje-rezervacije.component.html',
  styleUrl: './moje-rezervacije.component.css'
})
export class MojeRezervacijeComponent {
  rezervacijeService = inject(RezervacijaService)
  rezervacije : Rezervacija[] = []
  authService = inject(AuthService)
  user = ""
  ngOnInit(){
    const user = this.authService.getUser()
    
    if (user){
      this.user = user.username
    }
    this.updatePastRezervacije()
    this.mojeRezervacije()
  }

  sortirajPoDatumuPocetka() {
  this.rezervacije.sort((a, b) => {
    const dateA = new Date(a.datumPocetka);
    const dateB = new Date(b.datumPocetka);
    return dateA.getTime() - dateB.getTime();
  });
}

  mojeRezervacije(){
    this.rezervacijeService.mojeRezervacije(this.user).subscribe(data=>{
      if (data == null){
        alert("Doslo je do greske.")
      }else{
        this.rezervacije = data;
        this.sortirajPoDatumuPocetka();
      }
    })
  }

  constructor(private router: Router) {}

  updatePastRezervacije(){
    this.rezervacijeService.updatePastRezervacije(this.user).subscribe(data=>{
      if (data == null){
        alert("Doslo je do greske.")
      }
    })
  }
  noviKomentar : string [] = []
  novaOcena : number[]= []


  oceniRezervaciju(r: Rezervacija){
    localStorage.setItem('rezervacijaOcena', JSON.stringify(r));
    this.router.navigate(['user/oceniRezervaciju'])

  }
  // posaljiKomentarIOcenu(rezervacija : Rezervacija, index : number){
  //   rezervacija.komentar = this.noviKomentar[index]
  //   rezervacija.ocena = this.novaOcena[index]
  //   this.rezervacijeService.posaljiKomentarIOcenu(rezervacija).subscribe(data=>{
  //     if (data == null){
  //       alert("Doslo je do greske.")
  //     }else{
  //       this.mojeRezervacije()
  //       window.location.reload();
  //       alert("Uspjesno ste poslali ocjenu i komentar.")
  //     }
  //   })
  // }

  setNovaOcena(index: number, rating: number): void {
    this.novaOcena[index] = rating;
  }
  otkaziRez(rezervacija : Rezervacija){
    this.rezervacijeService.otkaziRez(rezervacija).subscribe(data=>{
      if (data == -1){
        alert("Doslo je do greske.")
      }else{
        this.mojeRezervacije()
        window.location.reload();
        alert("Uspjesno ste otkazali rezervaciju.")
      }
    })
  }

}
