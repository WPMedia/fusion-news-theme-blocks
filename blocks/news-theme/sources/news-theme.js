const fetch = (query) => {
  const baseTheme = {
    fontFamily: "'Roboto', 'Palatino', sans-serif",
    color: 'rgb(25 25 25)',
    heading: {
      fontWeight: 'bold',
      textDecoration: 'none',
    },
    paragraph: {
      fontSize: '1rem',
      lineHeight: '1.5',
    },
    overline: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      padding: '0.25rem',
      hoverColor: 'rgb(0 0 0)',
    },
    largePromo: {
      heading: {
        fontSize: '1.25rem',
      },
    },
    smallPromo: {
      heading: {
        fontSize: '1rem',
        fontWeight: '400',
      },
    },
    extraLargePromo: {
      heading: {
        fontSize: '3.25rem',
        lineHeight: '1.2',
        textAlign: 'center',
      },
    },
    cardList: {
      heading: {
        textDecoration: 'none',
      },
      small: {
        heading: {
          fontSize: '1rem',
        },
      },
    },
  };

  const themesPerSite = {
    'the-gazette': {
      fontFamily: "'Poppins', 'Palatino', sans-serif",
      overline: {
        backgroundColor: 'rgb(243 163 163)',
        color: 'rgb(255 255 255)',
        padding: '0.25rem',
      },
      largePromo: {
        borderColor: 'rgb(243 163 163)',
        borderStyle: 'none none none solid',
        borderWidth: '5px',
        padding: '0 0 0 1rem',
        overline: {
          backgroundColor: 'transparent',
          color: 'rgb(243 163 163)',
        },
        heading: {
          fontSize: '1.25rem',
          textDecoration: 'none',
        },
      },
      cardList: {
        borderColor: 'rgb(243 163 163)',
        borderStyle: 'none none none solid',
        borderWidth: '5px',
        boxShadow: 'none',
        padding: '0 0 0 1rem',
      },
    },
    'the-sun': {
      fontFamily: 'Georgia',
      overline: {
        margin: '0 0 0.5rem 0',
        padding: '0.5rem 0.5rem 0.5rem 0',
        fontWeight: '900',
      },
      largePromo: {
        heading: {
          fontSize: '1.25rem',
          lineHeight: '1.4',
        },
      },
    },
  };

  const site = query['arc-site'];
  return { ...baseTheme, ...themesPerSite[site] };
};

export default {
  fetch,
  cache: false,
};
