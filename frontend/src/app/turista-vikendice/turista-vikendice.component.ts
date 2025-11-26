import { Component, inject } from '@angular/core';
import { VikendicaService } from '../services/vikendica.service';
import { Vikendica } from '../models/Vikendica';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-turista-vikendice',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './turista-vikendice.component.html',
  styleUrl: './turista-vikendice.component.css'
})
export class TuristaVikendiceComponent {
  vikendicaService : VikendicaService = inject(VikendicaService)

  ngOnInit(){
    this.getAllVikendice();
  }

  allVikendice : Vikendica[] = [];

  getAllVikendice() {
    this.vikendicaService.getAllVikendice().subscribe(data => {
      if (data == null) {
        alert("Doslo je do greske...");
        return;
      }
      this.allVikendice = data;

      this.allVikendice.forEach(v => {
        this.vikendicaService.prosecnaOcena(v.naziv).subscribe(ocena => {
          (v as any).ocena = ocena; 
        });
      });

      this.filtriraneVikendice = this.allVikendice;
    });
  }


  pretragaMesto = ""
  pretragaNaziv = ""
  filtriraneVikendice : Vikendica[]= []

  pretrazi() {
  const naziv = this.pretragaNaziv.toLowerCase();
  const mesto = this.pretragaMesto.toLowerCase();

  this.filtriraneVikendice = this.allVikendice.filter(v =>
    (!naziv || v.naziv.toLowerCase().includes(naziv)) &&
    (!mesto || v.mesto.toLowerCase().includes(mesto))
  );
}


sortColumn: string = '';
sortDirection: 'asc' | 'desc' = 'asc';

sortBy(column: string) {
  if (this.sortColumn === column) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    this.sortColumn = column;
    this.sortDirection = 'asc';
  }

  this.filtriraneVikendice.sort((a: any, b: any) => {
    const valA = a[column]?.toString().toLowerCase() ?? '';
    const valB = b[column]?.toString().toLowerCase() ?? '';

    if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}

  // prosecnaOcena(naziv : string){
  //   this.vikendicaService.prosecnaOcena(naziv).subscribe(data=>{
  //     if (data == -1){
  //       alert("Greska pri racunanju prosecnje ocene.")
  //     }else{
  //       return data
  //     }
  //   })
  // }



}
