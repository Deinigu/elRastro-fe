import { GoogleSigninButtonModule, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { OauthService } from '../../services/oauth-service/oauth-service.service';

@Component({
  selector: 'app-oauth',
  standalone: true,
  imports: [CommonModule, GoogleSigninButtonModule],
  templateUrl: './oauth.component.html',
  styleUrl: './oauth.component.css',
  providers: [OauthService]
})
export class OauthComponent{
  idToken: any;
  user: SocialUser = new SocialUser;
  loggedIn: any;
  constructor(private authService: SocialAuthService, private router: Router, private oauthService: OauthService) { }

  ngOnInit() {
    
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      if (user && user.idToken) {
        this.oauthService.verifyToken(user);
      }
    });
  }

}