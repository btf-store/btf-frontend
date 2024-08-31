import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductLineComponent } from './edit-product-line.component';

describe('EditProductLineComponent', () => {
  let component: EditProductLineComponent;
  let fixture: ComponentFixture<EditProductLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProductLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProductLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
