import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixGameComponent } from './pix-game.component';

describe('PixGameComponent', () => {
  let component: PixGameComponent;
  let fixture: ComponentFixture<PixGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PixGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PixGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
