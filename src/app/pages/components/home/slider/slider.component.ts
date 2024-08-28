import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RadioButtonModule
  ],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent {
  transformStyle: string = "translateX(-0%)";
  currentIndex = 0;
  intervalTime = 7000;
  isTransitioning = true;
  ingredient: string = "a"


  ngOnInit(): void {
    setInterval(() => {
      this.nextImage();
    }, this.intervalTime);
  }

  nextImage(): void {
    if (this.currentIndex < this.images.length - 1) {
      ++this.currentIndex
      this.changePositionImage(this.currentIndex)
      this.isTransitioning = true;
    }else {
      this.isTransitioning = false;
    }
  }

  backImage(): void {
    if (this.currentIndex !== 0) {
      --this.currentIndex
      this.changePositionImage(this.currentIndex)
      this.isTransitioning = true;
    }else {
      this.isTransitioning = false;
    }
  }

  changePositionImage(index: number) {
    this.intervalTime = 7000;
    this.transformStyle = `translateX(-${index * 100}%)`
  }

  selectImage(index: number) {
    this.currentIndex = index
    this.isTransitioning = true;
    this.changePositionImage(index)
  }



  images: string[] = [
    'https://theme.hstatic.net/200000278317/1000929405/14/slideshow_5.jpg?v=1400',
    'https://theme.hstatic.net/200000278317/1000929405/14/slideshow_6.jpg?v=1400',
    'https://theme.hstatic.net/200000278317/1000929405/14/slideshow_7.jpg?v=1400',
    'https://theme.hstatic.net/200000278317/1000929405/14/slideshow_2.jpg?v=1400',
  ];
}
