# Official Repository of the web-based game _Pixle_

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.5.

## Introduction

This is the official repository of the web-based game _Pixle_. The game is developed and published by Nani Games.
Lead Developer and Designer is Nolan Bjarne Schiemann, Co-Founder of Nani Games.

Wordle, Picross and typical nonograms inspired the creation and development of this web-application _Pixle_.
The player solves puzzles on a daily basis. Each day reveals a new, randomly generated puzzle to solve.
Their difficulty does vary from day to day, but won't exceed a four by four- or five by four grid.
To solve a puzzle, the player has to place the emojis on their correct tiles / positions, shown to the player
at the beginning of the game and after each failed try.

# Generation of puzzles in _Pixle_
Puzzles in the game _Pixle_ are generated ahead of time and stored inside a small database or array.
The stored data packs only contain the necessary ids of the used emojis.
Puzzles aren't completely, randomly generated. They always use one of the many, already given patterns.
This way it is ensured that the player won't feel discouraged or uncomfortable while solving a puzzle.
It creates a certain familiarity and other positive emotions, which help to bond the player to the game.
The player now knows certain patterns and recognizes them upon seeing a newly revealed puzzle, which 
encourages him to keep playing and train his memory.

## First steps

Before serving, you need to run `gulp compress` or `gulp` in order to generate the stylesheets needed. Bootstrap is already in this project, there is no need to install it as a package.
This app uses a customized version of bootstrap which is compromised separately via the command `gulp bootstrap`.

**It is also possible to combine these two steps by using `gulp combined`.**

### List of available gulp commands:

- `gulp compress` : used to compromise component stylesheets
- `gulp bootstrap` : used to compromise bootstrap source files
- `gulp combined` : combines `gulp compress` and `gulp bootstrap`
- `gulp watch` : activates file watcher which runs `gulp compress` every time a file is saved
- `gulp` or `gulp default` : runs `gulp compress` and `gulp watch`

Doing this first prevents many errors and headaches, so please follow these steps first.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
