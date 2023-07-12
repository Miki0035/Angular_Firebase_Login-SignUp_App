import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth/auth.service';

declare var particlesJS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FireBaseAngular';
  
  constructor(
    public authService: AuthService,
  ){}

  ngOnInit(): void {
    particlesJS.load('particles', 'assets/particles.json', () => {
      console.log('callback - particles.js config loaded');
    });
  }

  logout(): void {
    this.authService.logout();
  }

 
}
