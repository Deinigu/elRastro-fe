import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ValoracionesService } from '../../services/valoraciones-service/valoraciones.service';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-valoracion',
  standalone: true,
  imports: [CommonModule, StarRatingComponent, FontAwesomeModule, FormsModule],
  templateUrl: './valoracion.component.html',
  styleUrl: './valoracion.component.css',
  providers: [ValoracionesService],
})

export class ValoracionComponent {
  userRating = 0;
  @Input() userId: string | undefined;
  @Input() vendedorId: string | undefined;
  @Input() productId: string | undefined;
  @Output() valoracionCompletada = new EventEmitter<string>();

  comentario: string = '';
  constructor(private valoracionesService: ValoracionesService) {}

  guardarValoracion() {

    if (this.userId && this.vendedorId && this.productId && this.userRating > 0) {
      const valoracion = {
        idUsuario: this.userId,
        idValorado: this.vendedorId,
        idProducto: this.productId,
        puntuacion: this.userRating,
        comentario: this.comentario,
        fecha: new Date()
      };

      this.valoracionesService.crearValoracion(valoracion).subscribe(
        (response) => {
          console.log('Valoración guardada con éxito:', response);
          const mensaje = `¡Has valorado a ${this.userId} con ${this.userRating} estrellas!`;
          this.valoracionCompletada.emit(mensaje);

         // this.activeModal.close();
        },
        (error) => {
          console.error('Error al guardar la valoración:', error);
        }
      );
    } else {
      console.error('Faltan datos para guardar la valoración.');
    }
  }
}

