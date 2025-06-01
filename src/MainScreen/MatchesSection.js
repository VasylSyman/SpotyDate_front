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

const NoMatchesMessage = styled.p`
    color: #666;
    font-style: italic;
    text-align: center;
    margin-top: 2rem;
`;

const MatchesSection = ({matches}) => {
    let matchesArray = [];

    if (Array.isArray(matches)) {
        matchesArray = matches;
    } else if (matches && typeof matches === 'object') {
        if (Array.isArray(matches.data)) {
            matchesArray = matches.data;
        } else if (Array.isArray(matches.results)) {
            matchesArray = matches.results;
        } else if (Array.isArray(matches.matches)) {
            matchesArray = matches.matches;
        } else {
            matchesArray = Object.values(matches).filter(item =>
                item && typeof item === 'object' && item.name
            );
        }
    }

    return (
        <MatchesContainer>
            <MatchesTitle>Your Music Matches</MatchesTitle>
            <MatchesGrid>
                {matchesArray.length > 0 ? (
                    matchesArray.map((match, index) => (
                        <MatchCard
                            key={match.name || match.id || index}
                            match={match}
                        />
                    ))
                ) : (
                    <NoMatchesMessage>No matches found</NoMatchesMessage>
                )}
            </MatchesGrid>
        </MatchesContainer>
    );
};

export default MatchesSection;