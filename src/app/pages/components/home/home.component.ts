
import { Component } from '@angular/core';
import { SliderComponent } from "./slider/slider.component";
import { ProductComponent } from "../product/product.component";
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SliderComponent,
    ProductComponent,
    CommonModule
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {

  listProduct = [1,2,3,4,5,6,7,8,9]
  constructor(
    private router: Router
  ){}

  navigate(url: string){
    this.router.navigateByUrl(url)
  }
}
