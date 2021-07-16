import {
  reduceResultList,
  resolveDefaultPromoElements,
} from './helpers';

describe('resolveDefaultPromoElements', () => {
  it('should use default custom fields as empty object', () => {
    const result = resolveDefaultPromoElements();
    const expectedResult = {
      showByline: true, showDate: true, showDescription: true, showHeadline: true, showImage: true,
    };
    expect(result).toEqual(expectedResult);
  });

  it('should use valid passed field values when available', () => {
    const result = resolveDefaultPromoElements({
      showByline: true, showDate: true, showDescription: true, showHeadline: true, showImage: false,
    });
    const expectedResult = {
      showByline: true, showDate: true, showDescription: true, showHeadline: true, showImage: false,
    };
    expect(result).toEqual(expectedResult);
  });
});

describe('reduceResultList', () => {
  it('should append unique items to the results collection', () => {
    const result = reduceResultList({
      content_elements: [{ _id: 'a' }, { _id: 'b' }],
      _id: '1234',
    }, {
      type: 'appendUnique',
      data: {
        content_elements: [{ _id: 'a' }, { _id: 'c' }, { _id: 'd' }],
        _id: '5678',
      },
    });
    expect(result).toEqual({
      content_elements: [{ _id: 'a' }, { _id: 'b' }, { _id: 'c' }, { _id: 'd' }],
      _id: '5678',
    });
  });

  it('should return the new collection when the state is undefined', () => {
    const result = reduceResultList(undefined, {
      type: 'appendUnique',
      data: {
        content_elements: [{ _id: 'a' }, { _id: 'c' }, { _id: 'd' }],
        _id: '5678',
      },
    });
    expect(result).toEqual({
      content_elements: [{ _id: 'a' }, { _id: 'c' }, { _id: 'd' }],
      _id: '5678',
    });
  });

  it('should return an unchanged collection for unknown action', () => {
    const result = reduceResultList({
      content_elements: [{ _id: 'a' }, { _id: 'b' }],
      _id: '1234',
    }, {
      type: 'badAction',
      data: {
        content_elements: [{ _id: 'a' }, { _id: 'c' }, { _id: 'd' }],
        _id: '5678',
      },
    });
    expect(result).toEqual({
      content_elements: [{ _id: 'a' }, { _id: 'b' }],
      _id: '1234',
    });
  });

  it('should return an unchanged collection for invalid data', () => {
    const result = reduceResultList({
      content_elements: [{ _id: 'a' }, { _id: 'b' }],
      _id: '1234',
    }, {
      type: 'badAction',
      data: undefined,
    });
    expect(result).toEqual({
      content_elements: [{ _id: 'a' }, { _id: 'b' }],
      _id: '1234',
    });
  });
});
