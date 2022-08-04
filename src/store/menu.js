import { makeAutoObservable } from 'mobx';

class Menu {
    open = false;

    constructor() {
        makeAutoObservable(this);
    }

    setMenu(value) {
        this.open = value;
    }
}

export const menu = new Menu();
