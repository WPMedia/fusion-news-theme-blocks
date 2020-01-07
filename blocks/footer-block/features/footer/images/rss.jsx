import React from 'react';

const RSS = ({ fill = '#14689A', title = '', desc = '' }) => (
  <svg
    aria-labelledby="title"
    width="24"
    height="24"
    viewBox="60 0 100 300"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title id="title" lang="en">{title}</title>
    <desc>{desc}</desc>
    <path
      d="m72 196c0 19.9-16.1 36-36 36s-36-16.1-36-36 16.1-36 36-36 36 16.1 36 36zm160 20c0-119.1-96.9-216-216-216-11 0-16 9-16 20s5 20 16 20c97 0 176 79 176 176 0 11 9 16 20 16 11.1 0 20-5 20-16zm-80 0c0-75-61-136-136-136-11 0-16 9-16 20s5 20 16 20c52.9 0 96 43.1 96 96 0 11 9 16 20 16s20-5 20-16z"
      fill={fill}
      fillRule="nonzero"
    />
  </svg>
);

export default RSS;
