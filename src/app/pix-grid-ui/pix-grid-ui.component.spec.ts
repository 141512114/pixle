import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixGridUiComponent } from './pix-grid-ui.component';

describe('PixGridUiComponent', () => {
  let component: PixGridUiComponent;
  let fixture: ComponentFixture<PixGridUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PixGridUiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PixGridUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
