import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajVikendicuComponent } from './dodaj-vikendicu.component';

describe('DodajVikendicuComponent', () => {
  let component: DodajVikendicuComponent;
  let fixture: ComponentFixture<DodajVikendicuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DodajVikendicuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DodajVikendicuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
