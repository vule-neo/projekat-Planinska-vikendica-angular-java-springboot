import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cenovnik } from '../models/Cenovnik';
import { Vikendica } from '../models/Vikendica';
import { VikendicaService } from '../services/vikendica.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dodaj-vikendicu',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dodaj-vikendicu.component.html',
  styleUrl: './dodaj-vikendicu.component.css'
})
export class DodajVikendicuComponent {

  vikendicaService = inject(VikendicaService)
  authService = inject(AuthService)
  cenovnik = new Cenovnik()
  vikendica = new Vikendica()

  cenovnici : Cenovnik[]= []
  zaPeriod = "za letnji period (mjeseci 5, 6, 7, 8)"

  dodajCenovnik(){

    if (this.zaPeriod == "za letnji period (mjeseci 5, 6, 7, 8)"){
      if (this.cenovnik.od<5 || this.cenovnik.doo > 8){
        alert("Nevazeci period.")
        return
      }
      this.zaPeriod = "za zimski period"
    }else if (this.zaPeriod == "za zimski period"){
      if (
        !( 
        (this.cenovnik.od <= this.cenovnik.doo &&
          this.cenovnik.doo < 5 || this.cenovnik.od > 8) ||

        (this.cenovnik.od > this.cenovnik.doo &&
          (this.cenovnik.od > 8 && this.cenovnik.doo < 5))
      )
      ){
        alert("Nevazeci period.")
        return
      }
      this.zaPeriod = ""
    }
    this.cenovnici.push(this.cenovnik);
    this.cenovnik = new Cenovnik();
  }

  imageBase64: string = "";
  onSlikeSelected(e : any){
    const file: File = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Slika mora biti u JPG ili PNG formatu.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        this.imageBase64 = e.target.result;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }


  dodajSlikuMsg = "Dodali ste sliku broj 0"
  dodajSlikuCnt = 1
  dodajSliku(){
    this.vikendica.slike.push(this.imageBase64);
    this.dodajSlikuMsg = "Dodali ste sliku broj " + this.dodajSlikuCnt
    this.dodajSlikuCnt++
  }

  dodajVikendicu(){
    if (this.cenovnici.length < 2){
      alert("Minimalan broj cenovnika nocenja nije zadovoljen.")
      return
    }
    const user = this.authService.getUser();
    if (!user || !user.username) {
      alert("Korisnik nije prijavljen.");
      return;
    }
    this.vikendica.vlasnik = user.username;

    this.vikendicaService.dodajVikendicu(this.vikendica, this.cenovnici).subscribe(data=>{
      if (data == -1){
        alert("Doslo je do greske.");
      }else {
        alert("Uspjesno ste dodali vikendicu.")
      }
    })


  }

  onJsonUpload(event: any) {
  const file: File = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const json = JSON.parse(reader.result as string);

      this.vikendica.naziv = json.naziv || '';
      this.vikendica.mesto = json.mesto || '';
      this.vikendica.usluge = json.usluge || '';
      this.vikendica.telefon = json.telefon || '';
      this.vikendica.x = json.x || 0;
      this.vikendica.y = json.y || 0;
      this.vikendica.slike = []; 


      if (json.cenovnik) {
        let c = json.cenovnik;
        const cenovnik = new Cenovnik();
        cenovnik.cena = c.cena || 0;
        cenovnik.od = c.od || 0;
        cenovnik.doo = c.doo || 0;
        this.cenovnik = cenovnik;
        this.cenovnici.push(cenovnik);
        this.zaPeriod = "za zimski period";
      }


      alert("JSON uspešno učitan.");
    } catch (e) {
      alert("Neispravan JSON format.");
    }
  };
  reader.readAsText(file);
}

}
