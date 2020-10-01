import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { vec2 } from 'gl-matrix';
import { GameOverComponent } from './game-over/game-over.component';
import { WelcomeComponent } from './welcome/welcome.component';

function between(v: number, start: number, end: number) {
  return start <= v && end >= v;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  rows: number;
  columns: number;
  margin: number;
  bheight: number;
  bwidth: number;
  pheight: number;
  pwidth: number;
  width: number;
  height: number;
  radius: number;

  @ViewChild('svg', { static: true })
  svg!: ElementRef<SVGElement>;
  player: SVGRectElement;
  ball: SVGCircleElement;
  tiles: SVGRectElement[];

  speed: vec2;
  temp: vec2;
  origin = vec2.create();
  _ballPosition: vec2;

  clock: number;

  set ballPosition([x, y]) {
    vec2.set(this._ballPosition, x, y);
    this.ball.setAttribute('cx', '' + x);
    this.ball.setAttribute('cy', '' + y);
  }

  get ballPosition() {
    return this._ballPosition;
  }

  constructor(private matDialog: MatDialog) {
    this.rows = 6;
    this.columns = 10;
    this.margin = 5;
    this.bheight = 10;
    this.bwidth = 20;
    this.pheight = 6;
    this.pwidth = 50;
    this.radius = 6.5;
    this.width = this.margin + (this.margin + this.bwidth) * this.columns;
    this.height = this.margin + (this.margin + this.bheight) * (this.rows * 3);

    this.player = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    this.ball = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.tiles = new Array();

    this.speed = vec2.create();
    this.temp = vec2.create();
    this._ballPosition = vec2.create();

    this.clock = new Date().getTime();

    this.matDialog.open(WelcomeComponent, { disableClose: true })
      .afterClosed()
      .subscribe(() => this.start());
  }

  start(): void {
    // creating elements
    const svg = this.svg.nativeElement;
    svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
    while (svg.lastChild) {
      svg.removeChild(svg.lastChild);
    }
    for (let r = 0; r < this.rows; r++) {

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      svg.appendChild(g);

      for (let c = 0; c < this.columns; c++) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        g.appendChild(rect);
        this.tiles.push(rect);

        rect.setAttribute('x', `${this.margin + (this.margin + this.bwidth) * c}`);
        rect.setAttribute('y', `${this.margin + (this.margin + this.bheight) * r}`);
        rect.setAttribute('width', `${this.bwidth}`);
        rect.setAttribute('height', `${this.bheight}`);
      }
    }

    svg.appendChild(this.ball);
    this.ballPosition = [this.width / 2, this.height - this.margin - this.pheight - this.radius];
    this.ball.setAttribute('r', `${this.radius}`);

    svg.appendChild(this.player);
    this.player.setAttribute('x', `${(this.width - this.pwidth) / 2}`);
    this.player.setAttribute('y', `${(this.height - this.pheight / 2 - this.margin)}`);
    this.player.setAttribute('width', `${this.pwidth}`);
    this.player.setAttribute('height', `${this.pheight}`);

    const border = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.appendChild(border);

    border.setAttribute('d', `M1 1 L${this.width - 1} 1 L${this.width - 1} ${this.height - 1} L1 ${this.height - 1} Z`);

    vec2.set(this.speed, 100, 100);
    this.clock = new Date().getTime();
    this.gameLoop();
  }

  gameLoop() {
    const now = new Date().getTime();
    const elapsedTime = now - this.clock;
    this.clock = now;

    if (this.dangerZone()) {
      if (this.looseBall()) {
        this.matDialog.open(GameOverComponent, { disableClose: true })
          .afterClosed()
          .subscribe(() => this.start());
        return;
      } else if (this.speed[1] > 0) {
        vec2.rotate(this.speed, this.speed, this.origin, Math.PI / 2);
      }
    } else if (this.isOutOfScreen()) {
      vec2.rotate(this.speed, this.speed, this.origin, Math.PI / 2);
    } else if (this.intersectTile()) {
      vec2.rotate(this.speed, this.speed, this.origin, Math.PI / 2);
    }

    const delta = vec2.scale(this.temp, this.speed, elapsedTime / 1000);
    this.ballPosition = vec2.add(this.temp, delta, this.ballPosition);

    requestAnimationFrame(this.gameLoop.bind(this));
  }

  dangerZone() {
    return (this.ballPosition[1] + this.radius) > this.player.y.baseVal.value;
  }

  looseBall(): boolean {
    const catchStart = this.player.x.baseVal.value - 2;
    const catchEnd = this.player.width.baseVal.value + catchStart + 4;
    return !between(this.ballPosition[0], catchStart, catchEnd);
  }

  intersectTile() {
    const [bx, by] = this.ballPosition;
    for (let i = 0; i < this.tiles.length; i++) {
      const tile = this.tiles[i];
      const x1 = tile.x.baseVal.value;
      const x2 = tile.width.baseVal.value + x1;
      const y1 = tile.y.baseVal.value;
      const y2 = tile.height.baseVal.value + y1;
      if (bx > x1 && bx < x2 && by < y1 && by < y2) {
        tile.remove();
        this.tiles.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  isOutOfScreen(): boolean {
    const [bx, by] = this.ballPosition;
    return (bx + this.radius) > this.width || (bx - this.radius) < 0 || (by + this.radius) > this.height || (by - this.radius) < 0;
  }

  mousemove(ev: MouseEvent): void {
    const svgPlayerX = this.player.x.baseVal.value;
    const realPlayerX = this.player.getBoundingClientRect().x;
    let x = ev.offsetX * svgPlayerX / (realPlayerX + this.pwidth);
    if (x < 1) {
      x = 1;
    } else if (x >= this.width - this.pwidth) {
      x = this.width - this.pwidth - 1;
    }
    this.player.setAttribute('x', `${x}`);
  }

}
