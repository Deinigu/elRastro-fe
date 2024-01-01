import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { OauthComponent } from './features/oauth/oauth.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './features/navbar/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterOutlet, OauthComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})



export class AppComponent {

  urlCrear = false;

  title = 'Elrastro';
  loggedIn : any;
  token = localStorage.getItem("token");

  ngOnInit(): void {
  }
}


