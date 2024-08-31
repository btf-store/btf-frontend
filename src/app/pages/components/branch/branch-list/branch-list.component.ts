import { Component } from '@angular/core';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Branch } from '../../../../core/models/interface/Branch';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [
    NzTableModule,
    NzInputModule,
    NzIconModule
  ],
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.css'
})
export class BranchListComponent {
  branches: Branch[] = [
    {
      branchId: 1,
      branchName: 'aaa'
    },
    {
      branchId: 1,
      branchName: 'aaa'
    },
    {
      branchId: 1,
      branchName: 'aaa'
    }
  ]

  scrollTopPage(){
    window.scrollTo(0, 0);
  }
}
