const React = require('react');
const { mount } = require('enzyme');

describe('Given a reqired test', () => {
  afterEach(() => {
    jest.resetModules();
  });

  beforeEach(() => {
    jest.mock('fusion:context', () => ({
      useFusionContext: jest.fn(() => ({
        arcSite: 'the-sun',
        id: 'testId',
      })),
    }));
  });

  it('should pass', () => {
    const { default: LineChart } = require('./default');
    const wrapper = mount(<LineChart />);
    expect(wrapper).toExist();
  });
});
