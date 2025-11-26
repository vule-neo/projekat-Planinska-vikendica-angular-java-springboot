import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VikendicaPregledComponent } from './vikendica-pregled.component';

describe('VikendicaPregledComponent', () => {
  let component: VikendicaPregledComponent;
  let fixture: ComponentFixture<VikendicaPregledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VikendicaPregledComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VikendicaPregledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
