import { Component, OnInit } from '@angular/core';
import { HelperFunctionsService } from '@abstract/services/helper-functions.service';
import { PIXLE_ICONS } from '@typescript/emoji.database';

@Component({
  selector: 'app-pix-hero-grid',
  templateUrl: './pix-hero-grid.component.html',
  styleUrls: ['./pix-hero-grid.component.scss'],
})
export class PixHeroGridComponent implements OnInit {
  grid_image: string[][] = [];
  grid_image_width: number = 0;
  grid_image_height: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.searchRandomPixleArt();
  }

  /**
   * Search for any pixle art from the database (get a random one)
   * Emit an event, which sends the chosen pixle object out to be received by other components
   *
   * @private
   */
  private searchRandomPixleArt(): void {
    let temp_pixle_image: string[][] = [];
    const rowCount: number = 4;
    for (let i: number = 0; i < rowCount; i++) {
      let temp_row_of_image: string[] = [];
      for (let j: number = 0; j < rowCount; j++) {
        let rnd: number = HelperFunctionsService.generateRandomInteger(
          PIXLE_ICONS.length - 1,
        );
        temp_row_of_image.push(PIXLE_ICONS[rnd]);
      }
      temp_pixle_image.push(temp_row_of_image);
    }
    this.grid_image = temp_pixle_image;
    // Make sure a pixle tile array was assigned
    if (this.grid_image.length <= 0) return;
    this.grid_image_height = this.grid_image.length;
    this.grid_image_width = this.grid_image[0].length;
  }
}
