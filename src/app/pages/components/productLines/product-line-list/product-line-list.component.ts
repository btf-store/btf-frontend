import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ProductLine } from '../../../../core/models/interface/Branch';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-product-line-list',
  standalone: true,
  imports: [
    NzTableModule,
    NzInputModule,
    NzIconModule
  ],
  templateUrl: './product-line-list.component.html',
  styleUrl: './product-line-list.component.css'
})
export class ProductLineListComponent {
  productLines: ProductLine[] = [
    {
      productLineId: 1,
      productLineName: 'aa',
      description: 'aaaa',
      branch: {
        branchId: 1,
        branchName: 'aa'
      }
    },
    {
      productLineId: 1,
      productLineName: 'aa',
      description: 'aaaa',
      branch: {
        branchId: 1,
        branchName: 'aa'
      }
    },
    {
      productLineId: 1,
      productLineName: 'aa',
      description: 'aaaa',
      branch: {
        branchId: 1,
        branchName: 'aa'
      }
    }
  ]


  getAllProductLine(){

  }

  scrollTopPage(){
    window.scrollTo(0, 0);
  }
}
