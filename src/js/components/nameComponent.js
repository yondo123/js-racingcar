import { Component } from './component.js';

import { $name, $round } from '../views/selector.js';
import { NAME } from '../common/const.js';
import { CustomError, ERROR_MESSAGE, InputOutOfRangeError } from "../common/error.js";
import { disableButton, displayNone, renderInputValue, setFocus } from "../common/util.js";

export class NameComponent extends Component {
    constructor(stateService) {
        super(stateService);
        this._init();
        this._subscribe();
    }

    _init() {
        super._init();
    }

    _setEventListeners() {
        $name.button.addEventListener('click', () => this.#submit());
        $name.input.addEventListener('keyup', e => this.#submitByEnterKey(e));
    }

    _initElement() {
        disableButton($name.button, false);
        displayNone($round.container);
        renderInputValue($name.input);
    }

    _subscribe() {
        this._stateService.reset.observers.push({ resets: () => this._init() });
    }

    #submit() {
        const names = this.#setNames();

        try {
            this.#IsValidated(names);
        } catch (e) {
            if (!e instanceof CustomError) {
                throw e;
            }
            return alert(e.message);
        }

        this._stateService.render.round = true;
        this._stateService.race.names = names;

        disableButton($name.button, true);
        setFocus($round.input);
    }

    #submitByEnterKey(e) {
        if (e.key !== 'Enter' || this._stateService.render.round) return;
        e.preventDefault();
        this.#submit();
    }

    #setNames = () => {
        return $name.input.value.split(',').map(name => name.trim());
    }

    #IsValidated = (names) => {
        names.forEach(name => {
            if (name.length < NAME.MIN_RANGE || name.length > NAME.MAX_RANGE) {
                throw new InputOutOfRangeError(ERROR_MESSAGE.InputOutOfRange);
            }
        });
    }
}