import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVikendicaComponent } from './update-vikendica.component';

describe('UpdateVikendicaComponent', () => {
  let component: UpdateVikendicaComponent;
  let fixture: ComponentFixture<UpdateVikendicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateVikendicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateVikendicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
