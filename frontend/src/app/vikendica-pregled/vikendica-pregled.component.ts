import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { VikendicaService } from '../services/vikendica.service';
import { Vikendica } from '../models/Vikendica';
import { Cenovnik } from '../models/Cenovnik';
import { Rezervacija } from '../models/Rezervacija';

@Component({
  selector: 'app-vikendica-pregled',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './vikendica-pregled.component.html',
  styleUrl: './vikendica-pregled.component.css'
})
export class VikendicaPregledComponent {

  constructor(private route : ActivatedRoute){}
  naziv : string = ""
  vikendicaService = inject(VikendicaService)
  vikendica : Vikendica = new Vikendica();
  slike : string[] = []
  cenovnici : Cenovnik[] = []
  rezervacije : Rezervacija[] = []

  ngOnInit() {
    const naziv = this.route.snapshot.paramMap.get('naziv');
    if (naziv){
      this.naziv = naziv;
    }
    this.getAllInfo();
    this.getAllSlike();
    this.getAllCenovnik();
    this.vikendicaService.getAllRezervacije(this.naziv).subscribe(data=>{
      if (data == null){
        alert("Greska prilikom dohvatanja rezervacija.")
      }else{
        this.rezervacije = data;
      }
    })
  }

  getAllInfo(){
    this.vikendicaService.getAllInfo(this.naziv).subscribe(data=>{
      if (data == null){
        alert("GRESKA")
      }
      this.vikendica = data;
    })
  }
  getAllSlike(){
    this.vikendicaService.getAllSlike(this.naziv).subscribe(data=>{
      if (data == null){
        alert("GRESKA")
      }
      this.slike = data
    })  
  }

  getAllCenovnik(){
    this.vikendicaService.getAllCenovnik(this.naziv).subscribe(data=>{
      if (data == null){
        alert("GRESKA")
      }
      this.cenovnici = data
    })
  }

    vikendicaBlokirana(naziv: string): boolean {
      const key = 'blokiraneVikendice';
      const now = new Date().getTime();

      const stored = localStorage.getItem(key);
      if (!stored) return false;

      const blockedList: { naziv: string; expiresAt: number }[] = JSON.parse(stored);
      return blockedList.some(entry => entry.naziv === naziv && entry.expiresAt > now);
    }

  }
