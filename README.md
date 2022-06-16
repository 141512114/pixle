# Official Repository of the web-based game _Pixle_

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.5.

## Introduction

This is the official repository of the web-based game _Pixle_. The game is developed and published by Nani Games.
Lead Developer and Designer is Nolan Bjarne Schiemann, Co-Founder of Nani Games.

Wordle, Picross and typical nonograms inspired the creation and development of the web-game Pixle.
The player solves puzzles on a daily-basis and each day challenges himself to solving a new, randomly generated puzzle. 
Their difficulty does vary from day to day, and can be quite nerve-braking at times.
To solve a puzzle, the player has to place the emojis on their correct tiles or positions, 
shown to him at the beginning of the game and after each failed try.

### Generation of puzzles in _Pixle_
Puzzles in the game _Pixle_ are generated ahead of time and stored inside a small database or array.
This array only contains the necessary ids of the used emojis and a date on which the specific
pixle goes public.\
Puzzles or _pixles_, as we like to call them, aren't fully, randomly generated.
They always use one of the many, already given patterns.
This way it is ensured that the player won't feel discouraged or uncomfortable while solving a pixle.
It creates a certain familiarity, which helps to bond the player to the game.
The player now knows certain patterns and recognizes them upon seeing a newly revealed pixle,
which encourages him to keep playing and train his memory.

## First steps

Before serving, you need to run `gulp compress` or `gulp` in order to generate the stylesheets needed.\
This has to be done in both projects (_pixle-game_ and _pixle-landing_) and outside in the root folder.
Each of the projects have their own stylesheets and additionally share static files which are located
outside, in the root folder.\
Bootstrap is already in this project, there is no need to install it as a package.
This app uses a customized version of bootstrap which is compromised separately via the command `gulp bootstrap`.\
Bootstrap is located in the root folder, so the command as to be done "globally".

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
