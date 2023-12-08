import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private router: Router) {
  }
  ngOnInit() {
  }

  goToRecipeManagement(): void {
    this.router.navigateByUrl('/recipe');
  }

  goToIngredientManagement(): void {
    this.router.navigateByUrl('/ingredient');
  }

}
