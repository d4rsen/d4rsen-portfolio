import { makeAutoObservable } from 'mobx';

class Menu {
    open = false;

    constructor() {
        makeAutoObservable(this);
    }

    setMenu(value: boolean) {
        this.open = value;
    }
}

export const menu = new Menu();
