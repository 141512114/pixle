import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PixHomeComponent} from './pix-home.component';

describe('PixLandingComponent', () => {
  let component: PixHomeComponent;
  let fixture: ComponentFixture<PixHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PixHomeComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PixHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
