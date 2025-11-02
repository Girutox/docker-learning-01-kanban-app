import { OrderByPipe } from './order-by.pipe';

describe('OrderByPipe', () => {
  let pipe: OrderByPipe;

  beforeEach(() => {
    pipe = new OrderByPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the array in ascending order by default', () => {
    const value = [{ name: 'John' }, { name: 'Jane' }, { name: 'Doe' }];

    const result = pipe.transform(value, 'name');
    
    expect(result).toEqual([{ name: 'Doe' }, { name: 'Jane' }, { name: 'John' }]);
  });

  it('should order by field in ascending order', () => {
    const value = [{ name: 'John' }, { name: 'Jane' }, { name: 'Doe' }];

    const result = pipe.transform(value, 'name', 'asc');

    expect(result).toEqual([{ name: 'Doe' }, { name: 'Jane' }, { name: 'John' }]);
  });

  it('should order by field in descending order', () => {
    const value = [{ name: 'John' }, { name: 'Jane' }, { name: 'Doe' }];

    const result = pipe.transform(value, 'name', 'desc');

    expect(result).toEqual([{ name: 'John' }, { name: 'Jane' }, { name: 'Doe' }]);
  });

  it('should return the same array if field/direction is not provided', () => {
    const value = [{ name: 'John' }, { name: 'Jane' }, { name: 'Doe' }];

    const result = pipe.transform(value, '');
    
    expect(result).toEqual(value);
  });
});
