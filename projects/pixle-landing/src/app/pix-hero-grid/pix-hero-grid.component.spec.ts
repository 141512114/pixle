import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PixHeroGridComponent} from './pix-hero-grid.component';

describe('PixHeroGridComponent', () => {
  let component: PixHeroGridComponent;
  let fixture: ComponentFixture<PixHeroGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PixHeroGridComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PixHeroGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
