import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isDropdownOpen = false;

  constructor(protected authService: AuthService, private router: Router) {}

  ngOnInit() {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.isDropdownOpen = false;
    this.router.navigateByUrl('/');
  }

  changePassword() {
    // Implement changePassword logic here
    this.isDropdownOpen = false;
  }

  changeEmail() {
    // Implement changeEmail logic here
    this.isDropdownOpen = false;
  }
}
