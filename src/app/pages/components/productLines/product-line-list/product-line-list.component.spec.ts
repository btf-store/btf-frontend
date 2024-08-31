import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLineListComponent } from './product-line-list.component';

describe('ProductLineListComponent', () => {
  let component: ProductLineListComponent;
  let fixture: ComponentFixture<ProductLineListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductLineListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductLineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
