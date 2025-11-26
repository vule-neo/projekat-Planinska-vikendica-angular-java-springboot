import { Component, inject, OnInit } from '@angular/core';
import { Rezervacija } from '../models/Rezervacija';
import { FormsModule } from '@angular/forms';
import { RezervacijaService } from '../services/rezervacija.service';

@Component({
  selector: 'app-oceni-rezervaciju',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './oceni-rezervaciju.component.html',
  styleUrls: ['./oceni-rezervaciju.component.css']
})
export class OceniRezervacijuComponent implements OnInit {
  
  rezervacija: Rezervacija | null = null;
  rating: number = 0;
  comment: string = '';
  stars: boolean[] = [false, false, false, false, false];
  rezervacijaService = inject(RezervacijaService)

  ngOnInit(): void {
    const rezervacijaData = localStorage.getItem('rezervacijaOcena');
    
    if (rezervacijaData) {
      this.rezervacija = JSON.parse(rezervacijaData);
      if (this.rezervacija?.ocena) {
        this.rating = this.rezervacija.ocena;
        this.setStars(this.rating);
      }
      if (this.rezervacija?.komentar) {
        this.comment = this.rezervacija.komentar;
      }
    } else {
      console.log('No rezervacija found in localStorage');
    }
  }

  setRating(rating: number): void {
    this.rating = rating;
    this.setStars(rating);
    console.log(rating)
  }

  setStars(rating: number): void {
    this.stars = this.stars.map((_, index) => index < rating);
  }

  submitReview(): void {
  if (this.rezervacija) {
    this.rezervacija.ocena = this.rating;
    this.rezervacija.komentar = this.comment;

    localStorage.setItem('rezervacijaOcena', JSON.stringify(this.rezervacija));

    const vikendicaKey = this.rezervacija.vikendica;
    let ratings = JSON.parse(localStorage.getItem(vikendicaKey) || '[]');
    ratings.push(this.rating);
    if (ratings.length > 3) {
      ratings.shift();
    }
    localStorage.setItem(vikendicaKey, JSON.stringify(ratings));

    const allBelowTwo = ratings.every((rating: number) => rating < 2);
    
    

    this.rezervacijaService.posaljiKomentarIOcenu(this.rezervacija).subscribe(data => {
      if (data === -1) {
        alert("Komentar i ocjena neuspjesno poslati.");
      } else {
        alert("Komentar i ocjena uspjesno poslati.");
      }
    });
  }
}

}
