import React from 'react';
import styled from 'styled-components';
import {Bell, MessageSquare, User} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

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
        transform: scale(1.1); /* Scale up the icon on hover */
        color: #10b981; /* Change color on hover */
    }
`;

const Header = () => {
    const navigate = useNavigate();

    return (<HeaderContainer>
        <IconWrapper onClick={() => navigate('/')}>
            <Logo>
                <LogoDot/>
                <LogoText>MusicMatch</LogoText>
            </Logo>
        </IconWrapper>

        <NavIcons>
            <IconWrapper onClick={() => console.log('Bell clicked')}>
                <Bell size={20}/>
            </IconWrapper>
            <IconWrapper onClick={() => console.log('Messages clicked')}>
                <MessageSquare size={20}/>
            </IconWrapper>
            <IconWrapper onClick={() => navigate('/profile')}>
                <User size={20}/>
            </IconWrapper>
        </NavIcons>
    </HeaderContainer>)
};

export default Header;
