import { Component, inject } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { User } from '../models/User';
import { Vikendica } from '../models/Vikendica';
import { VikendicaService } from '../services/vikendica.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-adminpage',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.css']
})
export class AdminpageComponent {
  adminService: AdminService = inject(AdminService);
  vikendice: Vikendica[] = [];
  userService : UserService = inject(UserService)
  vikendicaService: VikendicaService = inject(VikendicaService);

  pendingUsers: User[] = [];
  allUsers: User[] = [];
  constructor(private router: Router){}

  ngOnInit() {
    this.getPending();
    this.vikendicaService.getAllVikendice().subscribe(data => {
      this.vikendice = data;
      this.checkPoorReviews();
    });
    this.adminService.getAllUsers().subscribe(data=>{
      this.allUsers = data
    })
  }

  getPending() {
    this.adminService.getPendingUsers().subscribe(data => {
      this.pendingUsers = data;
    });
  }

  accept(username: string) {
    this.adminService.acceptPending(username).subscribe(data => {
      if (data == -1) {
        this.acceptanceMsg = `Failed to make the user ${username} active. Try again.`;
      } else {
        this.acceptanceMsg = `The user ${username} is now active.`;
      }
    });
  }

  acceptanceMsg: string = '';

  dismiss(username: string) {
    this.adminService.dismissPending(username).subscribe(data => {
      if (data == -1) {
        this.acceptanceMsg = `The user ${username} wasn't deleted. Try again.`;
      } else {
        this.acceptanceMsg = `The user ${username} has been removed from the database.`;

        const dismissedUser = this.pendingUsers.find(user => user.username === username);
        if (!dismissedUser) return;

        let bannedList = JSON.parse(localStorage.getItem('bannedUsers') || '[]');

        bannedList.push({
          username: dismissedUser.username,
          email: dismissedUser.email
        });

        localStorage.setItem('bannedUsers', JSON.stringify(bannedList));
      }
    });
  }
  checkPoorReviews() {
    this.vikendice.forEach(vikendica => {
      const vikendicaKey = vikendica.naziv;
      let ratings = JSON.parse(localStorage.getItem(vikendicaKey) || '[]');
      const allBelowTwo = ratings.every((rating: number) => rating < 2) && ratings.length == 3;
      if (allBelowTwo) {
        vikendica.crvena = true; 
      } else {
        vikendica.crvena = false;
      }
    });
  }

  uredi(u : User){
    localStorage.setItem("zaUredjivanje", JSON.stringify(u))
    this.router.navigate(["user/uredi"])
  }

  blokiraj(user: string) {
    const blockedKey = 'blocked';
    let blockedList: string[] = [];

    const stored = localStorage.getItem(blockedKey);
    if (stored) {
      blockedList = JSON.parse(stored);
    }

    if (!blockedList.includes(user)) {
      blockedList.push(user);
      localStorage.setItem(blockedKey, JSON.stringify(blockedList));
    }
    alert("Korisnik blokiran!")
  }


  userl : User = new User();
  usernames : Array<string> = [];

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

    if (this.userl.gender === ""){
      alert("Unesite pol.");
      return
    }
    if (!valid) {
      alert("Neispravan broj kreditne kartice.");
      return;
    }

    this.userService.registerAdmin(
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
        window.location.reload()
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

  izbrisi(username: string){
    this.adminService.izbrisi(username).subscribe(data=>{
      if (data == -1){
        alert("Brisanje neuspjesno")
      }else{
        window.location.reload()
        alert("Brisanje uspjesno")
      }
    })
  }


  blokirajVikendicu(naziv: string) {
    const key = 'blokiraneVikendice';
    const now = new Date().getTime();
    const expiryTime = now + 48 * 60 * 60 * 1000;

    let blockedList: { naziv: string; expiresAt: number }[] = [];

    const stored = localStorage.getItem(key);
    if (stored) {
      blockedList = JSON.parse(stored);
      blockedList = blockedList.filter(entry => entry.expiresAt > now);
    }

    const alreadyBlocked = blockedList.some(entry => entry.naziv === naziv);
    if (!alreadyBlocked) {
      blockedList.push({ naziv, expiresAt: expiryTime });
      localStorage.setItem(key, JSON.stringify(blockedList));
    }
    alert("Vikendica blokirana na 48h.")
  }


}
