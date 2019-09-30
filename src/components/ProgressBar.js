import React from 'react';
import styled from 'styled-components';

export const ProgressBar = ({percentage}) => {
  return (
    <ProgressBar>
      <FillerBar percentage={percentage} />
    </ProgressBar>
  );
};

const ProgressBar = styled.div`
  height: 20px;
  width: 75%;
  border-radius: 50px;
  border: 1px solid ${({ theme }) => theme.primary8};
`;

const FillerBar = styled.div`
    background: ${({ theme }) => theme.accent}
    height: 100%;
    border-radius: inherit;
    transition: width .2s ease-in;
    width: ${({percentage}) => `${percentage}%`}
`;

export default ProgressBar;
