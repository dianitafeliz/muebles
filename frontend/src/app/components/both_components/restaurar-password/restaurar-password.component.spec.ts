import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurarPasswordComponent } from './restaurar-password.component';

describe('RestaurarPasswordComponent', () => {
  let component: RestaurarPasswordComponent;
  let fixture: ComponentFixture<RestaurarPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurarPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestaurarPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
