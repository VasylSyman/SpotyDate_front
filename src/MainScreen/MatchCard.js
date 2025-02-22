import React from 'react';
import styled from 'styled-components';
import { User } from 'lucide-react';

const Card = styled.div`
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.div`
  width: 4rem;
  height: 4rem;
  background-color: #374151;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserDetails = styled.div`
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
  }

  p {
    color: #9ca3af;
    font-size: 0.875rem;
  }
`;

const GenreTags = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const GenreTag = styled.span`
  background-color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ConnectButton = styled.button`
  flex: 1;
  background-color: white;
  color: black;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
`;

const LikeButton = styled.button`
  width: 3rem;
  height: 2.5rem;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MatchCard = ({ match }) => (
    <Card>
        <UserInfo>
            <Avatar>
                <User size={32} />
            </Avatar>
            <UserDetails>
                <h3>{match.name}, {match.age}</h3>
                <p>{match.matchPercentage}% music match</p>
                <p>🎵 Top artist: {match.topArtist}</p>
            </UserDetails>
        </UserInfo>
        <GenreTags>
            {match.genres.map(genre => (
                <GenreTag key={genre}>{genre}</GenreTag>
            ))}
        </GenreTags>
        <ButtonGroup>
            <ConnectButton>Connect</ConnectButton>
            <LikeButton>♡</LikeButton>
        </ButtonGroup>
    </Card>
);

export default MatchCard;