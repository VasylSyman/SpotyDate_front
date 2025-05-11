import React from 'react';
import {Container, MainContent, ContentWrapper} from './Layout';
import Header from './Header';
import MatchesSection from './MatchesSection';
import {useState, useEffect} from "react";
import {BASE_URL} from "../config";


const MainScreen = () => {
    const token = localStorage.getItem('access_token');
    const [apiMatches, setApiMatches] = useState(null);
    const [transformedMatches, setTransformedMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BASE_URL}/matches`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                console.log('Matches API Response:', data);
                setApiMatches(data);

                if (data && data.matches && Array.isArray(data.matches)) {
                    const formatted = data.matches.map(match => ({
                        match_id: match.match_id,
                        name: match.first_name,
                        age: match.age || 'Unknown',
                        matchPercentage: match.match_score,
                        topArtist: match.shared_music.artists.length > 0 ? match.shared_music.artists[0] : 'Unknown',
                        genres: match.shared_music.genres.slice(0, 3),
                        profilePic: match.profile_picture_url,
                        userId: match.user_id,
                        bio: match.bio,
                        location: match.location,
                        sharedMusic: match.shared_music
                    }));

                    setTransformedMatches(formatted);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching matches:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        if (token) {
            fetchMatches();
        }
    }, [token]);

    return (
        <Container>
            <MainContent>
                <Header/>
                <ContentWrapper>
                    {loading ? (<p>Loading matches...</p>) : <MatchesSection
                        matches={transformedMatches.length > 0 ? transformedMatches :
                            <p>Unfortunately, no matches found. Please try again later</p>}/>}
                    {error && <p>Error loading matches: {error}</p>}
                </ContentWrapper>
            </MainContent>
        </Container>
    );
};

export default MainScreen;