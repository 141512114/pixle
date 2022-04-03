import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PixSideMenuComponent} from './pix-side-menu.component';

describe('PixSideMenuComponent', () => {
  let component: PixSideMenuComponent;
  let fixture: ComponentFixture<PixSideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PixSideMenuComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PixSideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
