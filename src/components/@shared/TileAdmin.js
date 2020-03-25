import styled from 'styled-components';

const Figure = styled.div`
  margin: 0;
  position: relative;
  overflow: hidden;
  text-align: center;
  cursor: pointer;
  background: ${props => props.color};
  opacity: 0.6;
  border-radius: 5px;
  text-align: left;
  height: ${props => props.height}px;
  > img {
    position: relative;
    display: block;
    max-width: 100%;
    opacity: 0.8;
    transition: opacity 300ms, transform 300ms;
    opacity: 0.85;
    height: 300px;
    margin: auto;
    object-fit: cover;
  }
  &:hover > img {
    opacity: 0.6;
  }
`;

const Caption = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  color: #fff;
  overflow: hidden;
  padding: 0.7rem;
  position: absolute;
  left: 0;
  right: 0;
  &.footer {
    bottom: 0;
  }
  &.header {
    top: 0;
  }
`;

const Title = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  box-sizing: border-box;
  margin: 0 0 3px 0;
  padding: 0;
  font-size: 0.875rem;
  font-weight: 700;
`;

const SubTitle = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 0.7rem;
  opacity: 0.8;
`;

const Description = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 0.65rem;
  opacity: 0.6;
`;

const Image = styled.span`
  position: absolute;
  background-size: cover;
  background-position: center center;
  background-image: url(${props => props.source});
  width: 100%;
  height: 100%;
`;

export { Figure, Caption, Title, SubTitle, Image, Description };
