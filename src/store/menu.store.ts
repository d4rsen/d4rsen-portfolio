import { computed, makeAutoObservable, observable } from 'mobx';

class MenuStore {
    constructor() {
        makeAutoObservable(this);
    }

    @observable
    private _open = false;

    @computed
    get open(): boolean {
        return this._open;
    }

    set open(value: boolean) {
        this._open = value;
    }
}

export const menu = new MenuStore();
