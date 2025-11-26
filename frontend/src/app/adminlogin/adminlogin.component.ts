import { Component, inject } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-adminlogin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './adminlogin.component.html',
  styleUrl: './adminlogin.component.css'
})
export class AdminloginComponent {


  constructor(private router: Router) {}

  adminService : AdminService = inject(AdminService);
  authService : AuthService = inject(AuthService);

  username : string = ""
  password : string = ""

  login(){
    this.adminService.login(this.username, this.password).subscribe(data => {
      if (data == null){
        alert ("Wrong username or password...")
      }else {
        this.authService.setUser(data)
        this.router.navigate(['/user/adminpage']).then(() => {
          window.location.reload();
        });
        
      }
    })
  }

}
