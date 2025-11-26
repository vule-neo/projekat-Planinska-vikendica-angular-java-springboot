import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.css'
})
export class ChangepasswordComponent {


  private userService : UserService = inject(UserService)
  private authService = inject(AuthService)

  oldPassword : string = ""
  newPassword : string = ""
  repNewPassword : string = ""

  constructor(private router: Router) {}
  ngOnInit(){
    
    if (!this.authService.isLoggedIn()){
      this.router.navigate([''])
    }
  }

  changePassword(){
    this.userService.changePassword(this.oldPassword, this.newPassword, this.repNewPassword).subscribe(data=>{
      if (data == -1){
        alert("No user in database.")
      }else if (data == -2){
        alert("Old password is incorrect.")
      }else if (data == -3){
        alert("Unknown error.")
      }else if (data == -4){
        alert("You typed the new passwords wrong.")
      }else if (data == -5){
        alert("Incorrect format of new password.")
      }else if (data == -6){
        alert("Old and new password can't be the same.")
      }else {
        this.router.navigate([''])
        alert("Password changed.")
      }
    })
  }
}
