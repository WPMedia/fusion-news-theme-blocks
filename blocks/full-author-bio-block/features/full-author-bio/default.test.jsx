import React from 'react';
import { mount } from 'enzyme';
import { useFusionContext } from 'fusion:context';
import FullAuthorBio from './default';

jest.mock('fusion:properties', () => (jest.fn(() => ({
  fallbackImage: 'placeholder.jpg',
  resizerURL: 'resizer',
}))));

jest.mock('fusion:themes', () => (jest.fn(() => ({}))));
jest.mock('fusion:context', () => ({
  useFusionContext: jest.fn(() => ({
    globalContent: {
      authors: [
        {
          _id: 'janedoe',
          firstName: 'Jane',
          lastName: 'Doe',
          secondLastName: 'Deo',
          byline: 'Jane Da Doe',
          role: 'Senior Product Manager',
          image: 'https://s3.amazonaws.com/arc-authors/corecomponents/b80bd029-16d8-4a28-a874-78fc07ebc14a.jpg',
          email: 'jane@doe.com',
          facebook: 'https://facebook.com/janedoe',
          affiliations: '',
          education: [],
          awards: [],
          books: [],
          podcasts: [],
          rss: 'somersslink',
          twitter: 'janedoe',
          bio_page: '/author/jane doe/',
          bio: 'Jane Doe is a senior product manager for Arc Publishing. This is a short bio. ',
          longBio: 'Jane Doe is a senior product manager for Arc Publishing. \nShe works on Arc Themes',
          slug: 'jane-doe',
          instagram: 'janedoe',
          native_app_rendering: false,
          fuzzy_match: false,
          contributor: false,
          status: true,
          last_updated_date: '2019-01-24T23:15:45.348Z',
          type: 'author',
          resized_params: {
            '158x158': '',
          },
        },
      ],
      last: 'c2FyYWNhcm90aGVycw==',
      more: false,
      _id: 'aea0c7ea37263d5d663cbb6844a506d39dfb7e02a76ab932d6e740c4e2807906',
    },
  })),
}));

describe('the full author bio block', () => {
  describe('when fields from globalContent are present', () => {
    it('should render a h1', () => {
      const wrapper = mount(<FullAuthorBio />);

      expect(wrapper.find('h1')).toHaveClassName('author-name');
    });

    it('should render a h4', () => {
      const wrapper = mount(<FullAuthorBio />);

      expect(wrapper.find('h2')).toHaveClassName('author-title');
    });

    it('should render a p', () => {
      const wrapper = mount(<FullAuthorBio />);

      expect(wrapper.find('.author-content > p')).toHaveClassName('author-bio');
    });

    it('should render a photo', () => {
      const wrapper = mount(<FullAuthorBio />);

      expect(wrapper.find('Image').props().src === '').toEqual(false);
    });
  });

  describe('when there is no long bio', () => {
    beforeEach(() => {
      useFusionContext.mockImplementation(() => ({
        arcSite: 'no-site',
        globalContent: {
          authors: [
            {
              _id: 'janedoe',
              firstName: 'Jane',
              lastName: 'Doe',
              byline: 'Jane Da Doe',
              role: 'Senior Product Manager',
              image: 'https://s3.amazonaws.com/arc-authors/corecomponents/b80bd029-16d8-4a28-a874-78fc07ebc14a.jpg',
              email: 'jane@doe.com',
              facebook: 'https://facebook.com/janedoe',
              rss: 'somersslink',
              twitter: 'janedoe',
              bio: 'Jane Doe is a senior product manager for Arc Publishing. This is a short bio. ',
              instagram: 'janedoe',
            },
          ],
        },
      }));
    });

    it('should render a short bio', () => {
      const wrapper = mount(<FullAuthorBio />);

      expect(wrapper.find('.author-content > p')).toHaveClassName('author-bio');
    });
  });

  describe('the social media icons', () => {
    describe('when the twitter link is present', () => {
      it('should render a twitter icon', () => {
        const wrapper = mount(<FullAuthorBio />);

        expect(wrapper.find('.twitter')).toHaveLength(1);
      });

      it('should have a twitter url', () => {
        const wrapper = mount(<FullAuthorBio />);

        expect((wrapper.find('.twitter').prop('href'))).toEqual('https://twitter.com/janedoe');
      });
    });

    describe('when the instagram link is present', () => {
      it('should render an instagram icon', () => {
        const wrapper = mount(<FullAuthorBio />);

        expect(wrapper.find('.instagram')).toHaveLength(1);
      });

      it('should have an instagram url', () => {
        const wrapper = mount(<FullAuthorBio />);

        expect((wrapper.find('.instagram').prop('href'))).toEqual('https://www.instagram.com/janedoe/');
      });
    });

    describe('when the facebook link is present', () => {
      it('should render a facebook icon', () => {
        const wrapper = mount(<FullAuthorBio />);

        expect(wrapper.find('.facebook')).toHaveLength(1);
      });

      it('should have a facebook url', () => {
        const wrapper = mount(<FullAuthorBio />);

        expect((wrapper.find('.facebook').prop('href'))).toEqual('https://facebook.com/janedoe');
      });
    });

    describe('when the email link is present', () => {
      it('should render an email icon', () => {
        const wrapper = mount(<FullAuthorBio />);

        expect(wrapper.find('.email')).toHaveLength(1);
      });

      it('should have a mailto link', () => {
        const wrapper = mount(<FullAuthorBio />);

        expect((wrapper.find('.email').prop('href'))).toEqual('mailto:jane@doe.com');
      });
    });

    describe('when the RSS link is present', () => {
      it('should render a RSS icon', () => {
        const wrapper = mount(<FullAuthorBio />);

        expect(wrapper.find('.rss')).toHaveLength(1);
      });

      it('should have a RSS url', () => {
        const wrapper = mount(<FullAuthorBio />);

        expect((wrapper.find('.rss').prop('href'))).toEqual('somersslink');
      });
    });

    describe('when the twitter link is not present', () => {
      beforeEach(() => {
        useFusionContext.mockImplementation(() => ({
          arcSite: 'no-site',
          globalContent: {},
        }));
      });
      it('should not render a twitter icon', () => {
        const wrapper = mount(<FullAuthorBio />);

        expect(wrapper.find('.twitter')).toHaveLength(0);
      });
    });

    describe('when the instagram link is not present', () => {
      it('should not render an instagram icon', () => {
        const wrapper = mount(<FullAuthorBio />);

        expect(wrapper.find('.instagram')).toHaveLength(0);
      });
    });

    describe('when the facebook link is not present', () => {
      it('should not render a facebook icon', () => {
        const wrapper = mount(<FullAuthorBio />);

        expect(wrapper.find('.facebook')).toHaveLength(0);
      });
    });

    describe('when the email link is not present', () => {
      it('should not render an email icon', () => {
        const wrapper = mount(<FullAuthorBio />);

        expect(wrapper.find('.email')).toHaveLength(0);
      });
    });

    describe('when the RSS link is not present', () => {
      it('should not render a RSS icon', () => {
        const wrapper = mount(<FullAuthorBio />);

        expect(wrapper.find('.rss')).toHaveLength(0);
      });
    });
  });

  describe('when the fields from globalContent are NOT present', () => {
    it('should NOT render anything', () => {
      const wrapper = mount(<FullAuthorBio />);

      expect(wrapper).toBeEmptyRender();
    });
  });

  describe('when there are no authors', () => {
    it('should NOT render anything', () => {
      const wrapper = mount(<FullAuthorBio />);

      expect(wrapper).toBeEmptyRender();
    });
  });
});
