import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixGridElementComponent } from './pix-grid-element.component';

describe('PixGridElementComponent', () => {
  let component: PixGridElementComponent;
  let fixture: ComponentFixture<PixGridElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PixGridElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PixGridElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
