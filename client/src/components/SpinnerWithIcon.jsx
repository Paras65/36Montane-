import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHiking } from '@fortawesome/free-solid-svg-icons';
import { Puff } from 'react-loading-icons';

// Spinner container styled
const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  position: relative;
  padding: 16px; /* Increased padding */
  margin: 16px; /* Added margin */
  box-sizing: border-box; /* Ensure padding and margin are included in the element's total width and height */
`;

const SpinnerWithIcon = () => {
  return (
    <SpinnerContainer>
      <FontAwesomeIcon 
        icon={faHiking} 
        className="text-orange-600 text-4xl relative z-10"  // Orange icon
      />
      <Puff 
        stroke="#FFA500"  // Orange spinner
        className="w-20 h-20 absolute z-0" // Increased spinner size
      />
    </SpinnerContainer>
  );
};

export default SpinnerWithIcon;