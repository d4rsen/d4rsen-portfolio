export const initBlackHoles = () => {
    let curs = document.querySelector('.cursor');

    document.addEventListener('mousemove', (e) => {
        let x = e.pageX;
        let y = e.pageY;
        curs.style.left = x - 15 + 'px';
        curs.style.top = y - 15 + 'px';
        curs.style.display = 'block';
    });

    document.addEventListener('click', (e) => {
        let x = e.pageX;
        let y = e.pageY;

        curs.classList.add('explosion');
        setTimeout(function () {
            curs.classList.remove('explosion');
        }, 900);

        let blackhole = document.createElement('blackhole');
        blackhole.classList.add('blackhole');
        blackhole.style.zIndex = '1';

        let megna = document.createElement('div');
        megna.classList.add('megna');

        let blackHoleInner = document.createElement('div');
        blackHoleInner.classList.add('black');

        blackhole.appendChild(megna);
        megna.appendChild(blackHoleInner);

        blackhole.style.left = x + 'px';
        blackhole.style.top = y + 'px';
        document.body.appendChild(blackhole);
        let size = Math.random() * 80;
        blackhole.style.width = 20 + size + 'px';
        blackhole.style.height = 20 + size + 'px';

        setTimeout(function () {
            blackhole.remove();
        }, 3000);
    });
};

const lerp = (a, b, n) => (1 - n) * a + n * b;
const body = document.body;
const getMousePos = (e) => {
    let posx = 0;
    let posy = 0;
    if (!e) e = window.event;
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    } else if (e.clientX || e.clientY) {
        posx = e.clientX + body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + body.scrollTop + document.documentElement.scrollTop;
    }
    return { x: posx, y: posy };
};

let winsize;
const calcWinsize = () => (winsize = { width: window.innerWidth, height: window.innerHeight });
calcWinsize();
window.addEventListener('resize', calcWinsize);

export class CursorFx {
    constructor(el) {
        this.DOM = { el: el };
        this.DOM.dot = this.DOM.el.querySelector('.cursor__inner--dot');
        this.DOM.circle = this.DOM.el.querySelector('.cursor__inner--circle');
        this.bounds = { dot: this.DOM.dot.getBoundingClientRect(), circle: this.DOM.circle.getBoundingClientRect() };
        this.scale = 1;
        this.opacity = 1;
        this.mousePos = { x: 0, y: 0 };
        this.lastMousePos = { dot: { x: 0, y: 0 }, circle: { x: 0, y: 0 } };
        this.lastScale = 1;
        this.lastOpacity = 1;

        this.initEvents();
        requestAnimationFrame(() => this.render());
    }

    initEvents() {
        window.addEventListener('mousemove', (ev) => (this.mousePos = getMousePos(ev)));
    }

    render() {
        this.lastMousePos.dot.x = lerp(this.lastMousePos.dot.x, this.mousePos.x - this.bounds.dot.width / 2, 1);
        this.lastMousePos.dot.y = lerp(this.lastMousePos.dot.y, this.mousePos.y - this.bounds.dot.height / 2, 1);
        this.lastMousePos.circle.x = lerp(
            this.lastMousePos.circle.x,
            this.mousePos.x - this.bounds.circle.width / 2,
            0.15
        );
        this.lastMousePos.circle.y = lerp(
            this.lastMousePos.circle.y,
            this.mousePos.y - this.bounds.circle.height / 2,
            0.15
        );
        this.lastScale = lerp(this.lastScale, this.scale, 0.15);
        this.lastOpacity = lerp(this.lastOpacity, this.opacity, 0.1);
        this.DOM.dot.style.transform = `translateX(${this.lastMousePos.dot.x}px) translateY(${this.lastMousePos.dot.y}px)`;
        this.DOM.circle.style.transform = `translateX(${this.lastMousePos.circle.x}px) translateY(${this.lastMousePos.circle.y}px) scale(${this.lastScale})`;
        this.DOM.circle.style.opacity = this.lastOpacity;
        requestAnimationFrame(() => this.render());
    }

    enter() {
        this.scale = 2.7;
    }

    leave() {
        this.scale = 1;
    }

    click() {
        this.lastScale = 1;
        this.lastOpacity = 0;
    }
}
