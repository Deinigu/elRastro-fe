import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStarHalfAlt as fasStarHalf } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-stars',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit, OnChanges {
  @Input() rating: number = 0;
  farStar = farStar;
  fasStar = fasStar;
  fasStarHalf = fasStarHalf;
  stars: {icon: any, style: string}[] = [];

  ngOnInit() {
    this.updateStars();
  }

  ngOnChanges() {
    this.updateStars();
  }

  updateStars() {
    this.stars = [];
    let displayRating = Math.round(this.rating * 2) / 2;
    for (let i = 1; i <= 5; i++) {
      if (i <= displayRating) {
        this.stars.push({icon: this.fasStar, style: 'color: gold'});
      } else if (i - 0.5 === displayRating) {
        this.stars.push({icon: this.fasStarHalf, style: 'color: gold'});
      } else {
        this.stars.push({icon: this.farStar, style: 'color: #ccc'});
      }
    }
  }
}