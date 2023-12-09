import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PujaFormComponent } from './puja-form.component';

describe('PujaFormComponent', () => {
  let component: PujaFormComponent;
  let fixture: ComponentFixture<PujaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PujaFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PujaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
