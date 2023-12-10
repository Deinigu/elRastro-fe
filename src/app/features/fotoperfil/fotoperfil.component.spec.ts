import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FotoperfilComponent } from './fotoperfil.component';

describe('FotoperfilComponent', () => {
  let component: FotoperfilComponent;
  let fixture: ComponentFixture<FotoperfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FotoperfilComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FotoperfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
