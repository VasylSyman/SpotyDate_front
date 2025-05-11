import React, {useState} from 'react';
import styled from 'styled-components';
import {Bell, MessageSquare, User, Loader} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {BASE_URL} from "../config";

const HeaderContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
`;

const Logo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const LogoDot = styled.div`
    width: 1.5rem;
    height: 1.5rem;
    background-color: #10b981;
    border-radius: 50%;
`;

const LogoText = styled.span`
    font-size: 1.125rem;
    font-weight: 600;
`;

const NavIcons = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const IconWrapper = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.1);
        color: #10b981;
    }
`;

const SpotifyButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background-color: #1DB954;
    color: white;
    border: none;
    border-radius: 24px;
    padding: 8px 16px;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-right: 16px;

    &:hover {
        background-color: #1ed760;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
`;

const SpotifyIcon = styled.div`
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const LoadingIcon = styled.div`
    animation: spin 1s linear infinite;
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');
    const [isLoading, setIsLoading] = useState(false);


    const initiateSpotifyAuth = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${BASE_URL}/auth/spotify`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                window.location.href = data.url;
            } else {
                console.error('Failed to initiate Spotify auth:', response.status, response.statusText);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error initiating Spotify auth:', error);
            setIsLoading(false);
        }
    };

    return (<HeaderContainer>
        <IconWrapper onClick={() => navigate('/')}>
            <Logo>
                <LogoDot/>
                <LogoText>MusicMatch</LogoText>
            </Logo>
        </IconWrapper>

        <NavIcons>
            <SpotifyButton onClick={initiateSpotifyAuth} disabled={isLoading}>
                {isLoading ? (
                    <>
                        <LoadingIcon>
                            <Loader size={16}/>
                        </LoadingIcon>
                        Connecting...
                    </>
                ) : (
                    <>
                        <SpotifyIcon>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path
                                    d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                            </svg>
                        </SpotifyIcon>
                        Update spotify data
                    </>
                )}
            </SpotifyButton>
            <IconWrapper onClick={() => navigate('/chat')}>
                <MessageSquare size={20}/>
            </IconWrapper>
            <IconWrapper onClick={() => navigate('/profile')}>
                <User size={20}/>
            </IconWrapper>
        </NavIcons>
    </HeaderContainer>)
};

export default Header;
