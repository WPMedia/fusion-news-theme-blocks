import styled from 'styled-components';

const ThemeLowerFooter = styled.div`
  position: fixed;
  /* on the editor this should be 50 */
  bottom: 25px;
  left: 0;
  right: 0;
  height: 100px;
  width: 90%;
  margin: 0 5%;

  padding: 10px;

  /* generated via https://glassmorphism.com/ */
  background: rgba( 48, 50, 61, 0.55 );
  box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
  backdrop-filter: blur( 20.0px );
  -webkit-backdrop-filter: blur( 20.0px );
  border-radius: 10px;
  border: 1px solid rgba( 255, 255, 255, 0.18 );

  /* handle interior */
  display: flex;
`;

export default ThemeLowerFooter;
