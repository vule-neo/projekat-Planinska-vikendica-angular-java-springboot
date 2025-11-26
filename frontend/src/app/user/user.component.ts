import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../services/user.service';
import {User} from '../models/User'
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterOutlet, FormsModule, RouterLink],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  userl : User = new User();
  usernames : Array<string> = [];

  private userService = inject(UserService);
  cardImage: string = "";


  register() {

    if (this.checkIfBanned(this.userl.username, this.userl.email)) {
      alert("Ovo korisnicko ime ili email ne moze da se koristi.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userl.email)) {
      alert("Incorrect email address...");
      return;
    }

    const card = this.userl.creditCardNumber;
    if (!card || !/^\d+$/.test(card)) {
      alert("Broj kartice mora sadržati samo cifre.");
      return;
    }

    let valid = false;
    let type = "";

    if (/^(300|301|302|303|36|38)/.test(card) && card.length === 15) {
      valid = true;
      type = "Diners";
      this.cardImage = "assets/diner.png";
    }

    else if (/^(51|52|53|54|55)/.test(card) && card.length === 16) {
      valid = true;
      type = "MasterCard";
      this.cardImage = "assets/master.png";
    }

    else if (/^(4539|4556|4916|4532|4929|4485|4716)/.test(card) && card.length === 16) {
      valid = true;
      type = "Visa";
      this.cardImage = "assets/visa.png";
    }


    if (!valid) {
      alert("Neispravan broj kreditne kartice.");
      return;
    }

    if (this.userl.gender === ""){
      alert("Unesite pol.");
      return
    }

    this.userService.register(
      this.userl.username,
      this.userl.password,
      this.userl.firstname,
      this.userl.lastname,
      this.userl.gender,
      this.userl.address,
      this.userl.phoneNumber,
      this.userl.email,
      this.userl.profilePicture,
      this.userl.creditCardNumber,
      this.userl.type
    ).subscribe(data => {
      if (data == -1) {
        alert("Neispravno unijeta sifra...");
      } else if (data == -2) {
        alert("Username vec postoji...");
      } else if (data == -3) {
        alert("Email vec postoji...");
      } else {
        alert("Registrovan novi korisnik");
      }
    });
  }


  checkIfBanned(username: string, email: string): boolean {
    const bannedList = JSON.parse(localStorage.getItem('bannedUsers') || '[]');
    return bannedList.some((entry: any) => entry.username === username || entry.email === email);
  }


onCardNumberChange() {
  const card = this.userl.creditCardNumber;
  this.cardImage = ""; 

  if (!card || !/^\d+$/.test(card)) return;

  if (/^(300|301|302|303|36|38)/.test(card) && card.length === 15) {
    this.cardImage = "assets/diner.png";
  }
  else if (/^(51|52|53|54|55)/.test(card) && card.length === 16) {
    this.cardImage = "assets/master.png";
  }
  else if (/^(4539|4556|4916|4532|4929|4485|4716)/.test(card) && card.length === 16) {
    this.cardImage = "assets/visa.png";
  }
}

  

imageBase64: string = "";
onFileSelected(event: any): void {
  this.userl.profilePicture = 'assets/default.png';
  const file: File = event.target.files[0];
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
      const { width, height } = img;
      if (width < 100 || height < 100 || width > 300 || height > 300) {
        alert('Dimenzije slike moraju biti između 100x100 i 300x300 piksela.');
        return;
      }

      this.imageBase64 = e.target.result;
      this.userl.profilePicture = this.imageBase64;
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}



}
