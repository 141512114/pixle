import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixHeroTileComponent } from './pix-hero-tile.component';

describe('PixHeroTileComponent', () => {
  let component: PixHeroTileComponent;
  let fixture: ComponentFixture<PixHeroTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PixHeroTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PixHeroTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
