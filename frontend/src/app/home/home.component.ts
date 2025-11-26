import { Component, inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { VikendicaService } from '../services/vikendica.service';
import { Vikendica } from '../models/Vikendica';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  vikendice: Vikendica[] = [];
  filteredVikendice: Vikendica[] = [];

  searchNaziv: string = "";
  searchMesto: string = "";
  sortColumn: string = "";
  sortAsc: boolean = true;

  numOfVlasnik: Number = 0;
  numOfTurista: Number = 0;
  numOfVikendica: Number = 0;
  numVikendicaPeriod : Number[] = []
  userService = inject(UserService);
  vikendicaService = inject(VikendicaService);

  ngOnInit() {
    this.numRegisteredTurista();
    this.numRegisteredVlasnik();
    this.numVikendica();
    this.getVikendice();
    this.numVikendicaUPeriodu(1);
    this.numVikendicaUPeriodu(7);
    this.numVikendicaUPeriodu(30);
  }

  filterVikendice() {
    this.filteredVikendice = this.vikendice.filter(v => {
      const matchNaziv = this.searchNaziv
        ? v.naziv.toLowerCase().includes(this.searchNaziv.toLowerCase())
        : true;
      const matchMesto = this.searchMesto
        ? v.mesto.toLowerCase().includes(this.searchMesto.toLowerCase())
        : true;
      return matchNaziv && matchMesto;
    });
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortAsc = !this.sortAsc; 
    } else {
      this.sortColumn = column;
      this.sortAsc = true;
    }

    this.filteredVikendice.sort((a: any, b: any) => {
      const valA = (a[column] || "").toString().toLowerCase();
      const valB = (b[column] || "").toString().toLowerCase();

      if (valA < valB) return this.sortAsc ? -1 : 1;
      if (valA > valB) return this.sortAsc ? 1 : -1;
      return 0;
    });
  }
  getVikendice(){
    this.vikendicaService.getAllVikendice().subscribe(data=>{
      if (data == null){
        alert("Doslo je do greske...")
        return
      }
      this.vikendice = data;
      this.filteredVikendice = data;
    })
  }
  numRegisteredVlasnik(){
    this.userService.getNumVlasnik().subscribe(data=>{
      if (data==-1){
        alert("Greska prilikom ucitavanja broja vlasnika.");
      }else {
        this.numOfVlasnik = data;
      }
    })
  }

  numRegisteredTurista(){
    this.userService.getNumTurista().subscribe(data=>{
      if (data==-1){
        alert("Greska prilikom ucitavanja broja turista.");
      }else {
        this.numOfTurista = data;
      }
    })
  }

  numVikendica(){
    this.vikendicaService.numVikendica().subscribe(data=>{
      if (data == -1){
        alert("Doslo je do greske...")
        return
      }
      this.numOfVikendica = data;
    })
  }

  numVikendicaUPeriodu(brDana : Number){
    this.vikendicaService.numVikendicaUPeriodu(brDana).subscribe(data=>{
      if (brDana == 1){
        this.numVikendicaPeriod[0] = data;
      }else if (brDana == 7){
        this.numVikendicaPeriod[1] = data;
      }else if (brDana == 30){
        this.numVikendicaPeriod[2] = data;
      }
    })
  }

  

}
