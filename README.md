# Super Breakout
Classic Atari game implemented in HTML5, SVG and JavaScript.
The game can be played at https://jeronimonunes.github.io/super-breakout/

## Building
The game is a Angular project. To build it you first need to have node.js installed then run:
```bash
cd gamefolder
npm install
npx ng build
```
The output will be at dist/super-breakout and can be published at any hosting server.

## Development server
To have it running locally while you develop you do:
```bash
npm install
npx ng serve
```

The game will be available at http://localhost:4200/

## Project design
The game was developed using SVG to draw the objects and browser event listeners to change the game state.
Most of the code is available at `src/app/app.component.ts`.
