import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom'; // If you're using React Router

const SpotifyCallback = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');


        console.log(code);
        if (code) {
            // Send the code to your backend
            exchangeCodeForToken(code);
        } else {
            // Handle errors or missing code
            console.error('Spotify authorization code not found.');
            navigate('/'); // Redirect to home or error page
        }
    }, [navigate]);

    const exchangeCodeForToken = async (code) => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await fetch('http://0.0.0.0:8000/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({code: code})
            });

            if (response.ok) {
                // const data = await response.json();
                navigate('/profile');
            } else {
                console.error('Failed to exchange code for token:', response.status, response.statusText);
                navigate('/');
            }
        } catch (error) {
            console.error('Error exchanging code for token:', error);
            navigate('/');
        }
    };

    return (
        <div>
            <h1>Processing Spotify Authentication...</h1>
        </div>
    );
};

export default SpotifyCallback;