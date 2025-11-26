import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { User } from './models/User';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app';

  constructor(private router: Router) {}

  authService : AuthService = inject(AuthService)
  currUser : User | null = new User();

  ngOnInit(){
    this.currUser = this.authService.getUser();
  }

  logout(){
    this.authService.logout()
    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
  }


}
