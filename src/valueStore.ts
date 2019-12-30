import { BehaviorSubject, Subject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export interface StoreUpdate<T> {
  prev: T;
  curr: T;
}

export type StateUpdaterFunction<T> = (state: T) => T;

export type SelectorFunction<T, V> = (state: T) => V;

export class ValueStore<T> {
  private storeValueSubject: BehaviorSubject<T>;
  private storeUpdatedSubject: Subject<StoreUpdate<T>>;

  constructor(initialValue: T) {
    this.storeValueSubject = new BehaviorSubject(initialValue);
    this.storeUpdatedSubject = new Subject();
  }

  get valueChange$() {
    return this.storeValueSubject.asObservable();
  }

  get storeUpdate$() {
    return this.storeUpdatedSubject.asObservable();
  }

  update(updaterFunction: StateUpdaterFunction<T>) {
    if (typeof updaterFunction !== 'function') {
      throw new Error('An update function should always be provided when triggering an update');
    }

    const prevState = this.storeValueSubject.getValue();
    const updatedState = updaterFunction(prevState);

    this.storeValueSubject.next(updatedState);

    this.storeUpdatedSubject.next({
      prev: prevState,
      curr: updatedState
    });
  }

  createSelector<V>(selectorFn: SelectorFunction<T, V>) {
    return this.valueChange$.pipe(map(selectorFn), distinctUntilChanged());
  }
}
