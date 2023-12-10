import { Component, Input, Output, EventEmitter  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faStar as farStarIcon } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStarIcon } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule  , FontAwesomeModule],
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent {
  @Input() rating: number = 0;
  @Output() ratingChange = new EventEmitter<number>();
  stars: { icon: IconDefinition; style: string; }[] = [];
  previewRating: number | null = null;

  farStar: IconDefinition = farStarIcon;
  fasStar: IconDefinition = fasStarIcon;
  
  constructor(private library: FaIconLibrary) {
    library.addIcons(this.farStar, this.fasStar);
  }

  // INICIALIZAR Y ACTUALIZAR EL ARRAY DE ESTRELLAS 
  ngOnInit() {
    this.actualizarIconos();
  }

  ngOnChanges() {
    this.actualizarIconos();
  }

  // ACTUALIZAR ARRAY DE ESTRELLAS
  actualizarIconos() {
    this.stars = [];
    let displayRating = this.previewRating !== null ? this.previewRating : this.rating;
    for (let i = 1; i <= 5; i++) {
      if (i <= displayRating) {
        this.stars.push({icon: this.fasStar, style: 'color: gold'});
      } else {
        this.stars.push({icon: this.farStar, style: 'color: #ccc'});
      }
    }
  }

  // CONTROLAR EVENTO EXTERNO CLICK
  configurarValor(rating: number) {
    this.rating = rating;
    this.previewRating = null;
    this.ratingChange.emit(this.rating);
    this.actualizarIconos();
  }

  previsualizarValor(rating: number) {
    this.previewRating = rating;
    this.actualizarIconos();
  }

  resetPreview(rating: number) {
    this.previewRating = rating;
    this.actualizarIconos();
  }
  
}