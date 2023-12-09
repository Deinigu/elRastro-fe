import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavuserComponent } from './navuser.component';

describe('NavuserComponent', () => {
  let component: NavuserComponent;
  let fixture: ComponentFixture<NavuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavuserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
