import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  isDropdownOpen = false;

  constructor(protected authService: AuthService) {}

  ngOnInit() {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout();
    this.isDropdownOpen = false;
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
