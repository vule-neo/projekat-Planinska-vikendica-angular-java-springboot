import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MojeRezervacijeComponent } from './moje-rezervacije.component';

describe('MojeRezervacijeComponent', () => {
  let component: MojeRezervacijeComponent;
  let fixture: ComponentFixture<MojeRezervacijeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MojeRezervacijeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MojeRezervacijeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
