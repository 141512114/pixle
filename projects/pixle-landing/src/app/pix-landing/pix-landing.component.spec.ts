import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixLandingComponent } from './pix-landing.component';

describe('PixLandingComponent', () => {
  let component: PixLandingComponent;
  let fixture: ComponentFixture<PixLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PixLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PixLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
