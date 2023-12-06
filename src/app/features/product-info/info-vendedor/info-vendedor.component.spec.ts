import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoVendedorComponent } from './info-vendedor.component';

describe('InfoVendedorComponent', () => {
  let component: InfoVendedorComponent;
  let fixture: ComponentFixture<InfoVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoVendedorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
