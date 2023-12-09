import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MischatsComponent } from './mischats.component';

describe('MischatsComponent', () => {
  let component: MischatsComponent;
  let fixture: ComponentFixture<MischatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MischatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MischatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
