import { makeAutoObservable } from 'mobx';

class MenuStore {
    private _open = false;

    public constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    public get open(): boolean {
        return this._open;
    }

    public set open(value: boolean) {
        this._open = value;
    }
}

export const menu = new MenuStore();
