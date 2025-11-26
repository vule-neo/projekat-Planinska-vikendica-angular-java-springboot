import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userlogin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './userlogin.component.html',
  styleUrl: './userlogin.component.css'
})
export class UserloginComponent {


  userService : UserService = inject(UserService);
  authService : AuthService = inject(AuthService);
  
    username : string = ""
    password : string = ""
    constructor(private router: Router) {}
  
    login(){
      const blocked = JSON.parse(localStorage.getItem('blocked') || '[]');
      if (blocked.includes(this.username)) {
        alert("Korisnik blokiran.")
        return
      }

      this.userService.login(this.username, this.password).subscribe(data => {
        if (data == null){
          alert ("Login neuspesan...")
        }else {
          this.authService.setUser(data)
          this.router.navigate(['user/profil']).then(() => {
            window.location.reload();
          });
        }
      })
    }

}
