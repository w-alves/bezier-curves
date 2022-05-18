let points = [
    []
];
let curr = 0;
let padding = 0;
let t;

let width = 0;
let height = 0;

let started = false;
let selected;

// algoritmo decasteljau
function casteljau(k, t) {
    let q = [];
    let n = points[k].length;
    let ans;

    q = points[k].map((point) => ({...point }));

    for (let i = 1; i < n; i++) {
        for (let j = 0; j < n - i; j++) {
            q[j].x = (1 - t) * q[j].x + t * q[j + 1].x;
            q[j].y = (1 - t) * q[j].y + t * q[j + 1].y;
        }
    }

    ans = [q[0].x, q[0].y];

    return ans;
}

function setup() {
    width = document.getElementById('canvas-container').offsetWidth;
    height = document.getElementById('canvas-container').offsetHeight;

    let cnv = createCanvas(width, height);
    cnv.id('canvas');
    cnv.parent('canvas-container');
}

function draw() {
    background('black');
    if (FLAG_CREATE_ENABLED || FLAG_FIRST_CURVE) {
        if (FLAG_SHOW_POINTS_ENABLED) {
            visualize_points();
        };
        if (FLAG_SHOW_LINES_ENABLED) {
            visualize_lines();
        };
        if (FLAG_SHOW_CURVES_ENABLED) {
            visualize_curves();
    }

    if (!started) {
        resize_window();
        started = true;
    }
}

function visualize_points() {
    strokeWeight(10);

    for (let i = 0; i < points.length; i++) {
        for (let p of points[i]) {

            if (p.dragging || p == selected) {
                stroke('green');
                selected = p;

            } else {
                stroke('#FD49A0');
            }

            point(p.x, p.y);
            p.update();

            if (i == curr)
                p.over();
        }
    }
}

function visualize_lines() {
    stroke('#ffffff');
    strokeWeight(2);

    for (let i = 0; i < points.length; i++)
        for (let j = 0; j < points[i].length - 1; j++)
            line(
                points[i][j].x,
                points[i][j].y,
                points[i][j + 1].x,
                points[i][j + 1].y
            );   
}

function visualize_curves() {
    let bPoints = [];
            let color;

            for (let k = 0; k < points.length; k++) {
                if (points[k].length >= 3) {
                    if (k === curr) color = '#420075';
                    else color = '#666666'
                    for (let i = 0; i <= t; i++)
                        bPoints[i] = casteljau(k, i / t);
                    for (let i = 0; i < t; i++)
                        line_draw(bPoints[i], bPoints[i + 1], color);
                }
            }
        };
}

function line_draw(x, y, color) {
    stroke(color);
    strokeWeight(1.5);
    line(x[0], x[1], y[0], y[1]);
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dragging = false;
        this.rollover = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.size = 5;
    }

    over() {
        if (
            mouseX > this.x - this.size &&
            mouseX < this.x + this.size &&
            mouseY > this.y - this.size &&
            mouseY < this.y + this.size
        ) {
            this.rollover = true;

            if (!FLAG_CREATE_ENABLED)
                cursorType('pointer');

        } else {
            this.rollover = false;

            if (!FLAG_CREATE_ENABLED)
                cursorType('default');
        }
    }

    update() {
        if (this.dragging) {
            this.x = mouseX + this.offsetX;
            this.y = mouseY + this.offsetY;
        }
    }

    pressed() {
        if (
            mouseX > this.x - this.size &&
            mouseX < this.x + this.size &&
            mouseY > this.y - this.size &&
            mouseY < this.y + this.size
        ) {
            this.dragging = true;
            this.offsetX = this.x - mouseX;
            this.offsetY = this.y - mouseY;
        }
    }

    released() {
        this.dragging = false;
    }
}



function resize_window() {
    width = document.getElementById('canvas-container').offsetWidth;
    height = document.getElementById('canvas-container').offsetHeight;
    resizeCanvas(width, height);
}

function keyPressed() {
    if (keyCode === 13)
        input();
}

function mouseClicked() {
    setup_interface();

    if (
        mouseX > padding &&
        mouseY > padding &&
        mouseX < width - padding &&
        mouseY < height - padding
    ) {
        if (FLAG_CREATE_ENABLED || FLAG_ADD_ENABLED_POINTS) {
            let p = new Point(mouseX, mouseY);
            points[curr].push(p);
            selected = p;
        }
    }
}

function mousePressed() {
    if (!FLAG_CREATE_ENABLED && points.length > 1)
      for (let p of points[curr])
        p.pressed();
  }
  
  function mouseReleased() {
    if (!FLAG_CREATE_ENABLED && points.length > 1)
      for (let p of points[curr])
        p.released();
  }