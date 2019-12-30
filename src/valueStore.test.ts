import { ValueStore } from './valueStore';

describe('valueStore', () => {
  it('should initialize correctly', () => {
    const store = new ValueStore({});
    expect(store).toBeDefined();
  });

  it('should trigger value changes correctly when updating', () => {
    const store = new ValueStore(0);
    const fn = jest.fn();

    const obs$ = store.valueChange$.subscribe(fn);

    expect(fn).toHaveBeenCalledWith(0);

    store.update(v => v + 1);

    expect(fn).toHaveBeenCalledWith(1);

    obs$.unsubscribe();
  });

  it('should trigger updater when any updates are fired', () => {
    const store = new ValueStore(0);
    const fn = jest.fn();

    const obs$ = store.storeUpdate$.subscribe(fn);

    store.update(v => v + 1);
    expect(fn).toHaveBeenCalledWith({ prev: 0, curr: 1 });
    obs$.unsubscribe();
  });

  it('should create a selector that can be subscribed to', () => {
    const store = new ValueStore(0);
    const fn = jest.fn();

    const selector$ = store.createSelector(value => value ** 2);
    const objs$ = selector$.subscribe(fn);

    expect(fn).toHaveBeenCalledWith(0);

    store.update(v => v + 2);

    expect(fn).toHaveBeenCalledWith(4);
    objs$.unsubscribe();
  });

  it('should throw when an invalid updater is provided', () => {
    const store = new ValueStore(0);
    let error: Error | undefined;

    try {
      // @ts-ignore
      expect(store.update(undefined));
    } catch (err) {
      error = err;
    }

    expect(error).toBeInstanceOf(Error);
  });
});
