import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {


  newFirstName: string = '';
  newLastName: string = '';
  newAddress: string = '';
  newEmail: string = '';
  newCreditCardNumber: string = '';
  newPhoneNumber : string = '';

  authService = inject(AuthService)
  userService = inject(UserService)
  constructor(private router: Router) {  }
  
  updateUser(what : string, what2 : string){
    if (what == "email"){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(what2)){
          alert("Incorrect email address...")
          return;
      }
    }
    this.userService.updateUser(what, what2).subscribe(data=>{
      if (data == -1){
        alert("Doslo je do greske.")
      }else{
        const user = this.authService.getUser();
        if (user) {
          switch (what) {
            case "firstname":
              user.firstname = what2;
              break;
            case "lastname":
              user.lastname = what2;
              break;
            case "email":
              user.email = what2;
              break;
            case "address":
              user.address = what2;
              break;
            case "phone_number":
              user.phoneNumber = what2;
              break;
            case "credit_card_number":
              if (!what2 || !/^\d+$/.test(what2)) {
                alert("Broj kartice mora sadržati samo cifre.");
                return;
              }

              let valid = false;
              let type = "";

              if (/^(300|301|302|303|36|38)/.test(what2) && what2.length === 15) {
                valid = true;
              }

              else if (/^(51|52|53|54|55)/.test(what2) && what2.length === 16) {
                valid = true;
              }

              else if (/^(4539|4556|4916|4532|4929|4485|4716)/.test(what2) && what2.length === 16) {
                valid = true;
              }


              if (!valid) {
                alert("Neispravan broj kreditne kartice.");
                return;
              }
              user.creditCardNumber = what2;
              break;
          }
          this.authService.setUser(user);

        }

        this.router.navigate(['user/profil']).then(() => {
          window.location.reload();
        });
      }
    });
  }

  imageBase64 : string = ""

  onFileSelected(event: any): void {

    const file: File = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png'];
      const input = event.target as HTMLInputElement;
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
      };
      img.src = e.target.result;
  };

  reader.readAsDataURL(file);


  }

  uploadProfilePicture(): void {
    const data = {
      username : this.authService.getUser()?.username,
      field : "profile_picture",
      newVal : this.imageBase64, 
    }
    this.userService.uploadProfilePicture(data).subscribe(data=>{
      if (data == -1){
        alert("Something went wrong...")
      }else{

        alert("SUCCESS")
        const user = this.authService.getUser();
        if (user) {
          user.profilePicture = this.imageBase64;
          this.authService.setUser(user);
        }
        
        this.router.navigate(['user/profil']).then(() => {
          window.location.reload();
        });
      }
    })
  }

}
