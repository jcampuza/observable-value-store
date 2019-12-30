# Observable Value Store

An Rxjs powered observable store for simple state.

### Usage

```js
import { ValueStore } from 'value-store';

const store = new ValueStore({ count: 1 });

const values$ = store.valueChange$.subscribe(state => console.log('values$', state));
// > values$ { count: 1 }
const updates$ = store.storeUpdate$.subscribe(({ prev, curr }) =>
  console.log('updates$', prev, curr)
);

store.update(state => ({ count: state.count + 1 }));
// > values$ { count: 2 }
// > updates$ { count: 1 } { count: 2 }

const counterExponential$ = store
  .createSelector(state => state.count ** 2)
  .subscribe(value => console.log('counterExponential$', value));
// counterExponential$ 4
```
