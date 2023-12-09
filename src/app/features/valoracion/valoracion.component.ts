import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-valoracion',
  standalone: true,
  imports: [CommonModule, StarRatingComponent, FontAwesomeModule],
  templateUrl: './valoracion.component.html',
  styleUrl: './valoracion.component.css'
})

export class ValoracionComponent {
  userRating = 0;
}
