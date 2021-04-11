import styled from 'styled-components';

export const Container = styled.button`
  margin-top: 16px;
  background: #ff9000;
  height: 56px;
  border-radius: 10px;
  border: 0;
  padding: 0 16px;
  color: #312e38;
  font-weight: 500;
  width: 100%;
  transition: background-color 0.2s;
  &:hover {
    background: #d08726;
  }
`;
