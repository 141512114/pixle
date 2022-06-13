# The Official Game _Pixle_

## First steps

Before serving, you need to run `gulp compress` or `gulp` in order to generate the stylesheets needed.\
This has to be done in both projects (_pixle-game_ and _pixle-landing_) and outside in the root folder.
Each of the projects have their own stylesheets and additionally share static files which are located
outside, in the root folder.\
Bootstrap is already in this project, there is no need to install it as a package.
Bootstrap is located in the root folder, so the command as to be done "globally".\
This app uses a customized version of bootstrap which is compromised separately via the command `gulp bootstrap`.

**It is also possible to combine these two steps by using `gulp combined`.**

### List of available gulp commands:

- `gulp compress` : used to compromise component stylesheets
- `gulp watch` : activates file watcher which runs `gulp compress` every time a file is saved
- `gulp` or `gulp default` : runs `gulp compress` and `gulp watch`

Doing this first prevents many errors and headaches, so please follow these steps first.
