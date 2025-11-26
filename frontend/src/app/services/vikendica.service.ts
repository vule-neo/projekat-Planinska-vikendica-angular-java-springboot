import { inject, Injectable } from '@angular/core';
import { Cenovnik } from '../models/Cenovnik';
import { Vikendica } from '../models/Vikendica';
import { HttpClient } from '@angular/common/http';
import { Rezervacija } from '../models/Rezervacija';

@Injectable({
  providedIn: 'root'
})
export class VikendicaService {
  getAllRezervacije(naziv: string) {
    return this.http.get<Rezervacija[]>(`${this.path}/getAllRezervacije/${naziv}`)
  }
  prosecnaOcena(naziv: string) {
    return this.http.get<Number>(`${this.path}/prosecnaOcena/${naziv}`)
  }
  numVikendicaUPeriodu(brDana: Number) {
    return this.http.get<Number>(`${this.path}/numVikendicaUPeriodu/${brDana}`)
  }
  
  getAllVikendice() {
    return this.http.get<Vikendica[]>(`${this.path}/getAllVikendice`)
  }
  numVikendica() {
    return this.http.get<Number>(`${this.path}/numVikendica`)
  }
  
  
  http = inject(HttpClient)
  private path = "http://localhost:8000/vikendica"
  constructor() { }

  dodajVikendicu(vikendica: Vikendica, cenovnici: Cenovnik[]) {
    const data = {
      cenovnici : cenovnici,
      vikendica : vikendica
    }
    return this.http.post<Number>(`${this.path}/dodajVikendicu`, data)
  }


  mojeVikendice(username: string) {
    
    return this.http.post<string[]>(`${this.path}/mojeVikendice`, username)
  }

  update(naziv: string, field: string, newVal: string){
    const data = [naziv, field, newVal]
    return this.http.post<Number>(`${this.path}/updateVikendica`, data);
  }

  delete(naziv : string){
    return this.http.post<Number>(`${this.path}/deleteVikendica`, naziv);
  }

  getAllInfo(naziv: string) {
    return this.http.post<Vikendica>(`${this.path}/getAllInfo`, naziv);
    
  }

  getAllSlike(naziv: string){
    return this.http.post<string[]>(`${this.path}/getAllSlike`, naziv);
  }

  getAllCenovnik(naziv: string){
    return this.http.post<Cenovnik[]>(`${this.path}/getAllCenovnici`, naziv);
  }

  deleteImage(slika: string, vikendicaNaziv : string) {
    const data = [slika, vikendicaNaziv]
    return this.http.post<Number>(`${this.path}/deleteSlika`, data);
  }

  uploadImage(imageBase64: string, vikendicaNaziv : string) {
    const data = [imageBase64, vikendicaNaziv]
      
    return this.http.post<Number>(`${this.path}/uploadImage`, data);
  }

  updateCenovnik(cenovnik: Cenovnik, field: string, newVal: Number) {
    const data = {
      cenovnik : cenovnik,
      field : field,
      newVal : newVal
    }
    
    return this.http.post<Number>(`${this.path}/updateCenovnik`, data);
  }

  dodajCenovnik(cenovnik: Cenovnik){
    return this.http.post<Number>(`${this.path}/dodajCenovnik`, cenovnik);
  }

  racunajCijenu(rezervacija: Rezervacija) {
    return this.http.post<Number>(`${this.path}/racunajCijenu`, rezervacija);
  }

}
