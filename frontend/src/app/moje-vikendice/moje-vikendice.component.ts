import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { VikendicaService } from '../services/vikendica.service';
import { Vikendica } from '../models/Vikendica';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-moje-vikendice',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './moje-vikendice.component.html',
  styleUrl: './moje-vikendice.component.css'
})
export class MojeVikendiceComponent {

  username = ""
  vikendice : string[] = []
  authService = inject(AuthService)
  vikendicaService = inject(VikendicaService)

  ngOnInit(){
    this.getMojeVikendice();
  }
  constructor(private router: Router) {}

  getMojeVikendice(){
    const user = this.authService.getUser()
    
    if (user){
      this.username = user.username
    }
    this.vikendicaService.mojeVikendice( this.username).subscribe(data=>{
      if (data == null){
        alert("Greska.")
        return
      }
      this.vikendice = data;
    })
  }

  
  delete(naziv : string){
    this.vikendicaService.delete(naziv).subscribe(data=>{
      if (data == -1){
        alert("Deleting failed.")
      }else{
        this.router.navigate(['vikendica/mojeVikendice']).then(() => {
            window.location.reload();
        });
        alert("Successfuly deleted.")
      }
    })
  }

}
