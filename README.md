# Official Repository of the web-based game _Pixle_

This project was first generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.5.
Since then much has changed which has now been noticed and brought into this project. _Pixle_ has been updated
and newly generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.9. All packages have been
reviewed and either upgraded or, because of their lack of support, removed entirely from the project.

## Introduction

This is the official repository of the web-based game _Pixle_. The game is developed and published by the
developer Nolan Bjarne Schiemann.

Wordle, Picross and typical nonograms have influenced the development of the web-game _Pixle_.
The player challenges himself to solve a newly generated puzzle each day.
Their difficulty varies and can be quite nerve-wrecking at times.
To solve a puzzle, the player has to place the emojis on their correct tiles or positions,
shown to him at the beginning of the game and after each failed try.

### The creation of puzzles in _Pixle_
~~Puzzles in the game _Pixle_ are generated ahead of time and stored inside a small database or array.
This array only contains the necessary ids of the used emojis and a date on which the specific
puzzle goes public.\
Puzzles or _pixles_, as I like to call them, aren't fully, randomly generated.
They always use one of the many, already given patterns.
This way it is ensured that the player won't feel discouraged or uncomfortable while solving a pixle.
It creates a certain familiarity, which helps bonding to the game.
Learning patterns can help recognizing them upon seeing a newly revealed pixle,
which encourages to keep playing and train the brain.~~

Puzzles are now created dynamically on each new day. Databases for all available emoji icons and possible patterns are 
still in use creation process. To guarantee consistency across all players,
the current date and time are used as a seed, determining the puzzles creation process.

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
