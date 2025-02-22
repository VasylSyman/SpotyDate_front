import React from 'react';
import styled from 'styled-components';
import MatchCard from './MatchCard';

const MatchesContainer = styled.div`
  flex: 1;
`;

const MatchesTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const MatchesSection = ({ matches }) => (
    <MatchesContainer>
        <MatchesTitle>Your Music Matches</MatchesTitle>
        <MatchesGrid>
            {matches.map(match => (
                <MatchCard key={match.name} match={match} />
            ))}
        </MatchesGrid>
    </MatchesContainer>
);

export default MatchesSection;