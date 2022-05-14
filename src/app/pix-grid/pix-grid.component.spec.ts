import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PixGridComponent} from './pix-grid.component';

describe('PixGridComponent', () => {
  let component: PixGridComponent;
  let fixture: ComponentFixture<PixGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PixGridComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PixGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
