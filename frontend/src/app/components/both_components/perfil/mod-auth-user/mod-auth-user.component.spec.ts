import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModAuthUserComponent } from './mod-auth-user.component';

describe('ModAuthUserComponent', () => {
  let component: ModAuthUserComponent;
  let fixture: ComponentFixture<ModAuthUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModAuthUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModAuthUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
