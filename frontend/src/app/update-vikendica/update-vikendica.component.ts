import { Component, inject } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { VikendicaService } from '../services/vikendica.service';
import { Cenovnik } from '../models/Cenovnik';
import { Vikendica } from '../models/Vikendica';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-vikendica',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-vikendica.component.html',
  styleUrl: './update-vikendica.component.css'
})
export class UpdateVikendicaComponent {

  
  vikendicaService = inject(VikendicaService)

  constructor(private route: ActivatedRoute, private router : Router) {}
  naziv :string = ""
  cenovnici : Cenovnik[] = [];
  slike : string [] = [];
  vikendica : Vikendica = new Vikendica();
  ngOnInit() {
    const naziv = this.route.snapshot.paramMap.get('naziv');
    if (naziv){
      this.naziv = naziv;
    }
    this.getAllInfo();
    this.getAllSlike();
    this.getAllCenovnik();
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

  newNaziv : string = ""
  newMesto : string = ""
  newUsluge : string = ""
  newTelefon : string = ""
  newX : string = ""
  newY : string = ""

  update(field : string, newVal: string){
    this.vikendicaService.update(this.naziv, field, newVal).subscribe(data=>{
      if (data == -1){
        alert("Greska, azuriranje nije uspjelo...")
      }else {
        if (field == "naziv") this.naziv = this.newNaziv;
        this.getAllInfo();
        
        this.router.navigate(['vikendica/updateVikendica', this.naziv]).then(() => {
            window.location.reload();
        });
        
        alert("Uspjesno azuriranje vikendice!")
      }
    })
  }

  newCena: number[] = [];
  newOd: number[] = [];
  newDoo: number[] = [];

  updateCenovnik(cenovnik : Cenovnik, field :string, newVal : Number){
    this.vikendicaService.updateCenovnik(cenovnik, field, newVal).subscribe(data=>{
      if (data == -1){
        alert("Greska, azuriranje nije uspjelo...")
      }else {
        this.getAllCenovnik();
        this.router.navigate(['vikendica/updateVikendica', this.naziv]).then(() => {
            window.location.reload();
        });
        alert("Uspjesno azuriranje cenovnika!")
      }
    })

  }

  imageBase64 = ""
  onFileSelected(e: any){
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

  uploadImage(){
    this.vikendicaService.uploadImage(this.imageBase64, this.vikendica.naziv).subscribe(data=>{
      if (data == -1){
        alert("Greska, slika nije objavljena...")
      }
      else{
        this.getAllSlike();
        this.router.navigate(['vikendica/updateVikendica', this.naziv]).then(() => {
            window.location.reload();
        });
        alert("Slika objavljena!")
      }
    })
  }

  deleteImage(slika:string){
    this.vikendicaService.deleteImage(slika, this.naziv).subscribe(data=>{
      if (data == -1){
        alert("Greska, slika nije izbrisana...")
      }
      else{
        this.getAllSlike();
        this.router.navigate(['vikendica/updateVikendica', this.naziv]).then(() => {
            window.location.reload();
        });
        alert("Slika izbrisana!")
      }
    })
  }

  cenovnik : Cenovnik = new Cenovnik()
  dodajCenovnik(){
    this.cenovnik.vikendica = this.naziv;
    this.vikendicaService.dodajCenovnik(this.cenovnik).subscribe(data=>{
      if (data==-1){
        alert("Cenovnik nije dodat.")
      }else{
        this.router.navigate(['vikendica/updateVikendica', this.naziv]).then(() => {
            window.location.reload();
        });
        alert("Cenovnik dodat!")
      }
    })
  }

}
