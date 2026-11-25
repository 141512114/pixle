# Official Repository of the web-based game _Pixle_

_Pixle_ is built with [Angular](https://angular.dev) 22 (standalone components, signals, no zone.js).
The repository contains two apps: the game (`projects/pixle-game`) and its landing page
(`projects/pixle-landing`). Code and styles shared by both live in `local/`.

## Introduction

This is the official repository of the web-based game _Pixle_.\
The game is developed and published by the developer Nolan Bjarne Schiemann.

Wordle, Picross and typical nonograms have influenced the development of the web-game _Pixle_.\
The player challenges themselves to solve a newly generated puzzle each day, with varying difficulty levels that can sometimes be quite nerve-wracking.\
To solve a puzzle, the player must place the emojis on their correct tiles or positions, as shown at the start of the game and after each failed attempt.

### The creation of puzzles in _Pixle_
Puzzles, or _pixles_, are generated on each new day. The current date is used as the seed, so every player
gets the same puzzle on the same day.\
Pixles aren't fully random: they always start from one of the hand-made patterns. Recognisable shapes keep the
player from feeling discouraged and make a pixle memorable. To keep them from being learned by heart, the
generator mutates the patterns (mirror, rotate, combine two patterns, recolour areas), with a difficulty that
rises over the week, and then fills them with randomly chosen emojis.

## First steps

Run `npm i` to install the dependencies.

## Development server

Run `ng serve pixle-game` (or `ng serve pixle-landing`) for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Running unit tests

Run `npm test` to execute the unit tests of both projects with [Vitest](https://vitest.dev/).\
Use `ng test pixle-game` or `ng test pixle-landing` to run a single project in watch mode.

## Build

Run `ng build [project-name]` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/cli) page.
