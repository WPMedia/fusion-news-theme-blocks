import React from 'react';
import { mount } from 'enzyme';

jest.mock('fusion:themes', () => (jest.fn(() => ({}))));

describe('the links bar feature for the default output type', () => {
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

  it('should be a nav element', () => {
    const { default: LinkBar } = require('./link-bar');
    const fusionContext = { arcSite: 'abc' };
    const content = {
      children: [
        {
          _id: 123,
          node_type: 'link',
          url: 'http://google.com',
          display_name: 'Text',
        },
        {
          _id: 123,
          node_type: 'link',
          url: 'http://google.com',
          display_name: 'Text 2',
        },
      ],
    };
    const wrapper = mount(<LinkBar useContent={content} useFusionContext={fusionContext} />);

    expect(wrapper.children().at(0).type()).toBe('nav');
  });

  it('should contain the equal number of links between input and output', () => {
    const { default: LinkBar } = require('./link-bar');
    const fusionContext = { arcSite: 'abc' };
    const content = {
      children: [
        {
          _id: 'id_1',
          name: 'test link 1',
        },
        {
          _id: 'id_2',
          name: 'test link 2',
        },
        {
          _id: 'id_3',
          node_type: 'link',
          url: '/',
          display_name: 'Link Text',
        },
        {
          _id: 'id_4',
          node_type: 'link',
          url: 'http://arcpublishing.com',
          display_name: 'Link Text',
        },
      ],
    };
    const wrapper = mount(<LinkBar useContent={content} useFusionContext={fusionContext} />);

    expect(wrapper.find('span.links-menu')).toHaveLength(4);
    expect(wrapper.find('span.links-menu a:not([target])')).toHaveLength(3);
    expect(wrapper.find('span.links-menu a[target="_blank"]')).toHaveLength(1);
  });

  it('should have no menu item if no content is returned', () => {
    const { default: LinkBar } = require('./link-bar');
    const fusionContext = { arcSite: 'abc' };
    const content = {};
    const wrapper = mount(<LinkBar useContent={content} useFusionContext={fusionContext} />);

    expect(wrapper.find('nav > span')).toHaveLength(0);
  });

  describe('a link element ', () => {
    it('should have the right name', () => {
      const { default: Link } = require('./_children/link');
      const wrapper = mount(<Link href="/testurl" name="test" />);

      expect(wrapper.props().name).toBe('test');
      expect(wrapper.find('a').text()).toBe('test');
    });
  });

  describe('when a link is missing a trailing slash', () => {
    it('should add a slash at the end of the link', () => {
      const { default: Link } = require('./_children/link');
      const wrapper = mount(<Link href="/testurl" name="test" />);

      expect(wrapper.props().href).toBe('/testurl');
      expect(wrapper.find('[href="/testurl/"]').length).toBe(1);
    });
  });

  describe('when a link is not missing a trailing slash', () => {
    it('should not add a slash at the end of the link', () => {
      const { default: Link } = require('./_children/link');
      const wrapper = mount(<Link href="/testurl/" name="test" />);

      expect(wrapper.props().href).toBe('/testurl/');
      expect(wrapper.find('[href="/testurl/"]').length).toBe(2);
    });
  });

  describe('when a link has query parameters', () => {
    it('should not add a slash at the end of a internal link', () => {
      const { default: Link } = require('./_children/link');
      const wrapper = mount(<Link href="/testurl/?query=home" name="test" />);

      expect(wrapper.props().href).toBe('/testurl/?query=home');
      expect(wrapper.find('[href="/testurl/?query=home"]').length).toBe(2);
    });
  });

  describe('when a link has query parameters', () => {
    it('should not add a slash at the end of a external link', () => {
      const { default: Link } = require('./_children/link');
      const wrapper = mount(<Link href="http://example.com/testurl/?query=home" name="test" />);

      expect(wrapper.props().href).toBe('http://example.com/testurl/?query=home');
      expect(wrapper.find('[href="http://example.com/testurl/?query=home"]').length).toBe(2);
    });
  });

  describe('when a link is to a page', () => {
    it('should not add a slash at the end of the link', () => {
      const { default: Link } = require('./_children/link');
      const wrapper = mount(<Link href="https://example.com/category/page.html" name="test" />);

      expect(wrapper.props().href).toBe('https://example.com/category/page.html');
      expect(wrapper.find('[href="https://example.com/category/page.html"]').length).toBe(2);
    });
  });

  describe('when a link has a hash', () => {
    it('should not add a slash at the end of the link', () => {
      const { default: Link } = require('./_children/link');
      const wrapper = mount(<Link href="/category/page#myhash" name="test" />);

      expect(wrapper.props().href).toBe('/category/page#myhash');
      expect(wrapper.find('[href="/category/page#myhash"]').length).toBe(2);
    });
  });

  describe('when a link has a mail', () => {
    it('should not add a slash at the end of the link', () => {
      const { default: Link } = require('./_children/link');
      const wrapper = mount(<Link href="mailto:readers@washpost.com" name="test" />);

      expect(wrapper.props().href).toBe('mailto:readers@washpost.com');
      expect(wrapper.find('[href="mailto:readers@washpost.com"]').length).toBe(2);
    });
  });
});
