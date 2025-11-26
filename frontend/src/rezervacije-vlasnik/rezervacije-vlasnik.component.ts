import { Component, inject } from '@angular/core';
import { RezervacijaService } from '../app/services/rezervacija.service';
import { Rezervacija } from '../app/models/Rezervacija';
import { AuthService } from '../app/services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';



@Component({
  selector: 'app-rezervacije-vlasnik',
  standalone: true,
  imports: [FormsModule,FullCalendarModule],
  templateUrl: './rezervacije-vlasnik.component.html',
  styleUrl: './rezervacije-vlasnik.component.css'
})
export class RezervacijeVlasnikComponent {
  
  rezervacijeService = inject(RezervacijaService)
  rezervacije : Rezervacija[] = []
  authService = inject(AuthService)
  user = ""
  komentar :string[] = []
  constructor(private router: Router) {}


  calendarPlugins = [dayGridPlugin, interactionPlugin];
  calendarEvents = [
    {
      title: 'Vikendica A',
      start: '2025-09-10',
      end: '2025-09-12',
    },
    {
      title: 'Vikendica B',
      start: '2025-09-15',
      end: '2025-09-18',
    }
  ];

  ngOnInit(){
    const user = this.authService.getUser()
    
    if (user){
      this.user = user.username
    }
    this.mojeRezervacije()

    this.calendarEvents = this.rezervacije.map(r => ({
    title: r.vikendica,
    start: r.datumPocetka,
    end: r.datumKraja,
    color: r.status === 'potvrdjeno' ? 'green' : (r.status === 'na_cekanju' ? 'yellow' : '')
  }));
  }

    

  onEventClick(arg: any) {
    
  }

  mojeRezervacije(){
    this.rezervacijeService.rezervacijeVlasnik(this.user).subscribe(data=>{
      if (data == null){
        alert("Doslo je do greske.")
      }else{
        this.rezervacije = data;
      }
    })
  }

  potvrdi(rez : Rezervacija){
    this.rezervacijeService.potvrdi(rez).subscribe(data=>{
      if (data == -1){
        alert("Potvrda nije uspjela.")
      }else {
        this.router.navigate(['user/rezervacijeVlasnik']).then(() => {
            window.location.reload();
          });
        alert("Rezervacija potvrdjena.")
      }
    })
  }

  odbij(rez : Rezervacija, komentar : string){
    if (komentar == ""){
      alert("Unesite komentar!");
      return;
    }else{
      this.rezervacijeService.odbij(rez, komentar).subscribe(data=>{
      if (data == -1){
        alert("Odbijanje nije uspjelo.")
      }else {
        alert("Rezervacija odbijena.")
      }
    })
    }
  }
}
