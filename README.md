# Official Repository of the web-based game _Pixle_

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.5.

## Introduction

This is the official repository of the web-based game _Pixle_. The game is developed and published by Nani Games.
Lead Developer and Designer is Nolan Bjarne Schiemann, Co-Founder of Nani Games.

Wordle, Picross and typical nonograms inspired the creation and development of the web-game _Pixle_.
The player solves puzzles on a daily-basis and each day challenges himself to solve a new and randomly generated puzzle.
Their difficulty does vary from day to day, and can be quite nerve-braking at times.
To solve a puzzle, the player has to place the emojis on their correct tiles or positions,
shown to him at the beginning of the game and after each failed try.

### The creation of puzzles in _Pixle_
Puzzles in the game _Pixle_ are generated ahead of time and stored inside a small database or array.
This array only contains the necessary ids of the used emojis and a date on which the specific
puzzle goes public.\
Puzzles or _pixles_, as we like to call them, aren't fully, randomly generated.
They always use one of the many, already given patterns.
This way it is ensured that the player won't feel discouraged or uncomfortable while solving a pixle.
It creates a certain familiarity, which helps to bond the player to the game.
The player now knows certain patterns and recognizes them upon seeing a newly revealed pixle,
which encourages him to keep playing and train his memory.

## First steps

Gulp has been removed and is no longer needed. This project is ready to go!
Well, you do have to run the command `npm i` at some point though... .

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build [project-name]` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
