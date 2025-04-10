import React from 'react';
import {Container, MainContent, ContentWrapper} from './Layout';
import Header from './Header';
import MatchesSection from './MatchesSection';
import ProfileSection from './ProfileSection';

const MainScreen = () => {
    const token = localStorage.getItem('access_token');

    const initiateSpotifyAuth = async () => {
        try {
            const response = await fetch('http://0.0.0.0:8000/auth/spotify', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                window.location.href = data.url; // Redirect using window.location.href
            } else {
                console.error('Failed to initiate Spotify auth:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error initiating Spotify auth:', error);
        }
    };

    const matches = [
        {
            name: "Sarah",
            age: 25,
            matchPercentage: 90,
            topArtist: "The Weeknd",
            genres: ["Pop", "R&B", "Hip-Hop"]
        },
        {
            name: "Mike",
            age: 28,
            matchPercentage: 85,
            topArtist: "Arctic Monkeys",
            genres: ["Indie", "Rock", "Alternative"]
        }
    ];

    const userProfile = {
        topGenre: "Alternative Rock",
        monthlyListening: "45 hours",
        topArtists: [
            {name: "Tame Impala", plays: 120},
            {name: "The Strokes", plays: 98}
        ]
    };

    return (
        <Container>
            <button onClick={initiateSpotifyAuth}>Connect Spotify</button>
            <MainContent>
                <Header/>
                <ContentWrapper>
                    <MatchesSection matches={matches}/>
                    <ProfileSection profile={userProfile}/>
                </ContentWrapper>
            </MainContent>
        </Container>
    );
};

export default MainScreen;