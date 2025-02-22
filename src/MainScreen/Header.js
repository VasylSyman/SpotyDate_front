import React from 'react';
import styled from 'styled-components';
import { Bell, MessageSquare, User } from 'lucide-react';

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

const Header = () => (
    <HeaderContainer>
        <Logo>
            <LogoDot />
            <LogoText>MusicMatch</LogoText>
        </Logo>
        <NavIcons>
            <Bell onClick={() => console.log('clicl')} size={20} />
            <MessageSquare size={20} />
            <User size={20} />
        </NavIcons>
    </HeaderContainer>
);

export default Header;