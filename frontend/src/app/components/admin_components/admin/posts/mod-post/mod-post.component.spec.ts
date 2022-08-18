import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModPostComponent } from './mod-post.component';

describe('ModPostComponent', () => {
  let component: ModPostComponent;
  let fixture: ComponentFixture<ModPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
