import { inject, Injectable } from '@angular/core';
import { Rezervacija } from '../models/Rezervacija';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RezervacijaService {
  provjeriDatum(datumPocetka: string, datumKraja: string, vikendica: string) {
    return this.http.get<Number>(`${this.path}/provjeriDatum/${datumPocetka}/${datumKraja}/${vikendica}`)
  }
  otkaziRez(rezervacija: Rezervacija) {
    return this.http.post<Number>(`${this.path}/otkaziRez`, rezervacija)
  }
  posaljiKomentarIOcenu(rezervacija: Rezervacija) {
    return this.http.post<Number>(`${this.path}/posaljiKomentarIOcenu`, rezervacija)
  }
  updatePastRezervacije(user: string) {
    return this.http.post<Number>(`${this.path}/updatePastRezervacije`, user)
  }
  odbij(rez: Rezervacija, komentar : string) {
    const data = {
      rezervacija : rez,
      komentar : komentar
    }
    return this.http.post<Number>(`${this.path}/odbijRezervaciju`, data)
  }
  potvrdi(rez: Rezervacija) {
    return this.http.post<Number>(`${this.path}/potvrdiRezervaciju`, rez)
  }
  

  http = inject(HttpClient)

  constructor() { }
  private path = "http://localhost:8000/rezervacija"

  dodajRezervaciju(rezervacija: Rezervacija) {
    return this.http.post(`${this.path}/dodajRezervaciju`, rezervacija)
  }

  mojeRezervacije(user: string) {
    
    return this.http.post<Rezervacija[]>(`${this.path}/mojeRezervacije`, user)
  }

  rezervacijeVlasnik(user: string) {
    return this.http.post<Rezervacija[]>(`${this.path}/rezervacijeVlasnik`, user)
  }


}
