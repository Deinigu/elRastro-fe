import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OauthService {
  

  constructor(private http: HttpClient, private router: Router) { }

  verifyToken(user: SocialUser): void {
    // Define your backend API URL
    const backendUrl = 'http://localhost:8009/logged';
    //const backendUrl = 'http://13.36.188.166:8000/logged';

    // Send a POST request to the backend with the idToken
    this.http.post(backendUrl, { idtoken: user.idToken }).subscribe(
      (response) => {
        console.log('Token verification success:', response);
        localStorage.setItem("token", user.idToken);
        localStorage.setItem("email", user.email);
        localStorage.setItem("name", user.name);
        localStorage.setItem("photoUrl", user.photoUrl);
        location.reload();
      },
      (error) => {
        console.error('Token verification error:', error);
        // Handle the verification error as needed
      }
    );
  }
}