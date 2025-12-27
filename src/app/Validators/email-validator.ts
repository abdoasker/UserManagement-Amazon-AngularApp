import { AbstractControl, AsyncValidatorFn, FormControl } from '@angular/forms';
import { AccountService } from '../Services/account-service.js';
import {
  map,
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  first,
} from 'rxjs/operators';
import { of, timer } from 'rxjs';

export class EmailValidator {
  static createValidator(accountService: AccountService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null);
      }

      return timer(500).pipe(
        switchMap(() => {
          return accountService.checkEmailExists(control.value).pipe(
            map((exists) => (exists ? { emailExists: true } : null)),
            catchError(() => of(null))
          );
        }),
        first() // important to complete the observable
      );
    };
  }
}
