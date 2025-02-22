import React from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  width: 20rem;
`;

const ProfileCard = styled.div`
  background-color: #1f2937;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const ProfileTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const InfoBox = styled.div`
  background-color: #374151;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;

  p:first-child {
    color: #9ca3af;
    font-size: 0.875rem;
  }

  p:last-child {
    font-weight: 600;
  }
`;

const ArtistCard = styled(InfoBox)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ArtistIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background-color: #4b5563;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfileSection = ({ profile }) => (
    <ProfileContainer>
      <ProfileCard>
        <ProfileTitle>Your Music Profile</ProfileTitle>
        <InfoBox>
          <p>Top Genre</p>
          <p>{profile.topGenre}</p>
        </InfoBox>
        <InfoBox>
          <p>Monthly Listening Time</p>
          <p>{profile.monthlyListening}</p>
        </InfoBox>
        <div>
          <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Top Artists
          </p>
          {profile.topArtists.map(artist => (
              <ArtistCard key={artist.name}>
                <ArtistIcon>🎵</ArtistIcon>
                <div>
                  <p style={{ fontWeight: 600 }}>{artist.name}</p>
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                    {artist.plays} plays this month
                  </p>
                </div>
              </ArtistCard>
          ))}
        </div>
      </ProfileCard>
    </ProfileContainer>
);

export default ProfileSection;