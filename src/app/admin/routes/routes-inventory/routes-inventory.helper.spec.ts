import RenameRouteBatch from './routes-inventory.helper';

describe('RenameRouteBatch', () => {
  const routes =
    [{ name: 'Yaba', batch: 'E'},
    { name: 'Yaba', batch: 'Q'},
    { name: 'Yaba', batch: 'V'},
    { name: 'Nairobi', batch: 'C'},
    { name: 'Nairobi', batch: 'F'},
    { name: 'Nairobi', batch: 'B'}]
  const renameRouteBatch = new RenameRouteBatch(routes, null, null)

  it('should return the next character', () => {
    expect(renameRouteBatch.nextLetter('A')).toEqual('B');
    expect(renameRouteBatch.nextLetter('Z')).toEqual('A');
  });

  it('should increment a batchString', () => {
    const spy = jest.spyOn(RenameRouteBatch.prototype, 'nextLetter');
    expect(renameRouteBatch.incrementChar('AA')).toEqual('AB');
    expect(renameRouteBatch.incrementChar('ZZ')).toEqual('AAA');
    expect(renameRouteBatch.incrementChar('FZ')).toEqual('GA');
    expect(renameRouteBatch.incrementChar('')).toEqual('A');
    expect(spy).toBeCalledTimes(5);
  })

  it('should update route batches sequentially', () => {
    expect(renameRouteBatch.renameRouteBatches()).toEqual(
     [{ name: 'Yaba', batch: 'A'},
      { name: 'Yaba', batch: 'B'},
      { name: 'Yaba', batch: 'C'},
      { name: 'Nairobi', batch: 'A'},
      { name: 'Nairobi', batch: 'B'},
      { name: 'Nairobi', batch: 'C'}]
    )
  })
})
