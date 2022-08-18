import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorioAdminComponent } from './directorio-admin.component';

describe('DirectorioAdminComponent', () => {
  let component: DirectorioAdminComponent;
  let fixture: ComponentFixture<DirectorioAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectorioAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectorioAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
