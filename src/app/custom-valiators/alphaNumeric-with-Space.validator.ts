import { AbstractControl, Validator } from '@angular/forms';
export function alphaNumericWithSpace(control: AbstractControl) {

    const value = control.value.trim();
    if (!/^[a-zA-Z0-9\-_\s]+$/.test(value) && value) {
        return { isAlphaNumeric: true };
    }
    return null;
}