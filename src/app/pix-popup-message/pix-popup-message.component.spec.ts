import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PixPopupMessageComponent} from './pix-popup-message.component';

describe('PixPopupMessageComponent', () => {
  let component: PixPopupMessageComponent;
  let fixture: ComponentFixture<PixPopupMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PixPopupMessageComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PixPopupMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
