import React, {useState} from 'react';
import styled from 'styled-components';
import {User, X, Music, Users, Disc} from 'lucide-react';
import {useNavigate} from 'react-router-dom';

const Card = styled.div`
    background-color: #1f2937;
    border-radius: 0.5rem;
    padding: 1.25rem;
    cursor: pointer;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    color: #d1d5db;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    }
`;

const UserInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
`;

const Avatar = styled.div`
    width: 4.5rem;
    height: 4.5rem;
    background-color: #374151;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
`;

const UserDetails = styled.div`
    h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #f9fafb;
        margin-bottom: 0.25rem;
    }

    p {
        color: #9ca3af;
        font-size: 0.875rem;
        line-height: 1.4;
    }
`;

const MatchInfoHighlight = styled.p`
    font-size: 0.9rem !important;
    font-weight: 500;
    color: #5eead4 !important;
    margin-bottom: 0.5rem !important;
`;

const GenreTags = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
`;

const GenreTag = styled.span`
    background-color: #374151;
    color: #e5e7eb;
    padding: 0.3rem 0.8rem;
    border-radius: 9999px;
    font-size: 0.8rem;
`;

const MatchingSection = styled.div`
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #374151;
`;

const MatchingTitle = styled.h4`
    font-size: 1rem;
    font-weight: 500;
    color: #a5b4fc;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const MatchingList = styled.ul`
    list-style: none;
    padding-left: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
`;

const MatchingListItem = styled.li`
    background-color: #4b5563;
    color: #d1d5db;
    font-size: 0.8rem;
    padding: 0.25rem 0.6rem;
    border-radius: 0.25rem;
    white-space: nowrap;
`;

const TrackListItem = styled(MatchingListItem)`
    font-size: 0.75rem;
    white-space: normal;
    padding: 0.2rem 0.5rem;

    .track-title {
        font-weight: 500;
        color: #f0f0f0;
    }
`;


const ButtonGroup = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: 1.5rem;
`;

const ConnectButton = styled.button`
    flex: 1;
    background-color: white;
    color: black;
    padding: 0.6rem;
    border-radius: 0.5rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: #f3f4f6;
    }
`;

const LikeButton = styled.button`
    width: 3.2rem;
    height: 2.9rem;
    border: 1px solid #374151;
    background-color: #1f2937;
    color: #f9fafb;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;

    &:hover {
        background-color: #374151;
        border-color: #4b5563;
    }
`;

const ForeshadowBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(6px);
    z-index: 1000;
    display: ${props => (props.$show ? 'block' : 'none')};
{ /* MODIFIED */
}
`;

const ModalWindow = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #111827;
    color: #f9fafb;
    padding: 1.5rem 2rem;
    border-radius: 0.75rem;
    z-index: 1001;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
    display: ${props => (props.$show ? 'flex' : 'none')};
{ /* MODIFIED */
} flex-direction: column;
    max-height: 90vh;
`;

// ***** MODIFIED SECTION START *****
const ModalHeaderUserContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem; /* Adjust gap as needed */
`;
// ***** MODIFIED SECTION END *****

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #374151;
    padding-bottom: 1rem;
    margin-bottom: 1rem;

    /* h2 styling remains, will apply to the h2 within ModalHeaderUserContainer */

    h2 {
        font-size: 1.75rem;
        font-weight: 700;
        color: #f9fafb; /* Ensuring h2 color is consistent if not inherited */
    }
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.375rem;
    transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;

    &:hover {
        background-color: #374151;
        color: #f9fafb;
    }
`;

const ModalContent = styled.div`
    overflow-y: auto;
    padding-right: 1rem;
    margin-right: -1rem; /* To hide scrollbar but allow scrolling */
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    p {
        font-size: 1rem;
        line-height: 1.6;
        color: #d1d5db;
    }

    strong {
        color: #a5b4fc;
        font-weight: 600;
    }
`;

const ModalSection = styled.div`
    h5 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #7dd3fc;
        margin-bottom: 0.75rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px dashed #4b5563;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    ul {
        list-style: none;
        padding-left: 0;
        margin: 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
`;

const ModalCompactListItem = styled.li`
    background-color: #4b5563;
    color: #d1d5db;
    font-size: 0.8rem;
    padding: 0.25rem 0.6rem;
    border-radius: 0.25rem;
    white-space: nowrap;
`;

const ModalCompactTrackItem = styled.li`
    background-color: #4b5563;
    color: #f0f0f0;
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
    border-radius: 0.25rem;
    white-space: normal;
    font-weight: 500;
`;

const ModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #374151;
`;

const MessageButton = styled.button`
    background-color: #2563eb;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: #1d4ed8;
    }
`;

const DetailItem = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0.6rem 0;
    border-bottom: 1px dashed #374151;
    font-size: 0.95rem;

    &:last-child {
        border-bottom: none;
    }

    span:first-child {
        color: #9ca3af;
        font-weight: 500;
    }

    span:last-child {
        color: #e5e7eb;
        text-align: right;
        max-width: 60%;
        word-break: break-word;
    }
`;


const MatchCard = ({match}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const openModal = (e) => {
        if (e.target.closest('button')) return;
        setIsModalOpen(true);
    };

    const closeModal = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        setIsModalOpen(false);
    };

    const handleMessageClick = (e) => {
        e.stopPropagation();
        navigate(`/chat/${match.match_id}`);
        closeModal();
    };


    const {
        name, age, matchPercentage, topArtist,
        genres: userGenres = [],
        profilePic, location, bio,
        sharedMusic
    } = match || {};

    console.log(match)

    const matchingArtists = sharedMusic?.artists || [];
    const matchingGenres = sharedMusic?.genres || [];
    const matchingTracks = sharedMusic?.tracks || [];

    const MAX_ITEMS_ON_CARD = 3;

    return (
        <>
            <Card onClick={openModal}>
                <UserInfo>
                    <Avatar>
                        {profilePic ? (
                            <img src={profilePic} alt={`${name}'s avatar`}
                                 style={{width: '100%', height: '100%', borderRadius: '0.5rem', objectFit: 'cover'}}/>
                        ) : (
                            <User size={36} color="#9ca3af"/>
                        )}
                    </Avatar>
                    <UserDetails>
                        <h3>{name}, {age}</h3>
                        <MatchInfoHighlight>{matchPercentage}% music match</MatchInfoHighlight>
                        <p>🎵 Your Top Artist: {topArtist}</p>
                    </UserDetails>
                </UserInfo>

                {(matchingArtists.length > 0 || matchingGenres.length > 0 || matchingTracks.length > 0) && (
                    <MatchingSection>
                        {matchingGenres.length > 0 && (
                            <>
                                <MatchingTitle><Music size={18}/> Matching Genres
                                    ({sharedMusic?.genre_count || matchingGenres.length})</MatchingTitle>
                                <MatchingList>
                                    {matchingGenres.slice(0, MAX_ITEMS_ON_CARD).map(genre => (
                                        <MatchingListItem key={genre}>{genre}</MatchingListItem>
                                    ))}
                                    {matchingGenres.length > MAX_ITEMS_ON_CARD &&
                                        <MatchingListItem>...</MatchingListItem>}
                                </MatchingList>
                            </>
                        )}
                        {matchingArtists.length > 0 && (
                            <>
                                <MatchingTitle style={{marginTop: "1rem"}}><Users size={18}/> Matching Artists
                                    ({sharedMusic?.artist_count || matchingArtists.length})</MatchingTitle>
                                <MatchingList>
                                    {matchingArtists.slice(0, MAX_ITEMS_ON_CARD).map(artist => (
                                        <MatchingListItem key={artist}>{artist}</MatchingListItem>
                                    ))}
                                    {matchingArtists.length > MAX_ITEMS_ON_CARD &&
                                        <MatchingListItem>...</MatchingListItem>}
                                </MatchingList>
                            </>
                        )}
                        {matchingTracks.length > 0 && (
                            <>
                                <MatchingTitle style={{marginTop: "1rem"}}><Disc size={18}/> Matching Tracks
                                    ({sharedMusic?.track_count || matchingTracks.length})</MatchingTitle>
                                <MatchingList>
                                    {matchingTracks.slice(0, MAX_ITEMS_ON_CARD).map((trackTitle, index) => (
                                        <TrackListItem key={`${trackTitle}-${index}`}>
                                            <span className="track-title">{trackTitle}</span>
                                        </TrackListItem>
                                    ))}
                                    {matchingTracks.length > MAX_ITEMS_ON_CARD &&
                                        <TrackListItem>...</TrackListItem>}
                                </MatchingList>
                            </>
                        )}
                    </MatchingSection>
                )}
            </Card>

            <ForeshadowBackground $show={isModalOpen} onClick={closeModal}/>
            <ModalWindow $show={isModalOpen} onClick={(e) => e.stopPropagation()}>
                {/* ***** MODIFIED SECTION START ***** */}
                <ModalHeader>
                    <ModalHeaderUserContainer>
                        <Avatar> {/* Using the existing Avatar component */}
                            {profilePic ? (
                                <img src={profilePic} alt={`${name}'s avatar`}
                                     style={{
                                         width: '100%',
                                         height: '100%',
                                         borderRadius: '0.5rem',
                                         objectFit: 'cover'
                                     }}/>
                            ) : (
                                <User size={36} color="#9ca3af"/>
                            )}
                        </Avatar>
                        <h2>{name}, {age}</h2>
                    </ModalHeaderUserContainer>

                    <CloseButton onClick={closeModal}>
                        <X size={28}/>
                    </CloseButton>
                </ModalHeader>
                {/* ***** MODIFIED SECTION END ***** */}
                <ModalContent>
                    <DetailItem>
                        <span>Match %:</span>
                        <span style={{color: "#5eead4", fontWeight: "bold"}}>{matchPercentage}%</span>
                    </DetailItem>
                    <DetailItem>
                        <span>Top Artist:</span>
                        <span>{topArtist}</span>
                    </DetailItem>
                    {location && <DetailItem><span>Location:</span><span>{location}</span></DetailItem>}
                    {bio && (
                        <ModalSection>
                            <h5>Bio</h5>
                            <p style={{fontSize: "0.9rem", color: "#e5e7eb"}}>{bio}</p>
                        </ModalSection>
                    )}

                    {matchingGenres.length > 0 && (
                        <ModalSection>
                            <h5><Music size={20}/> Matching Genres ({sharedMusic?.genre_count || matchingGenres.length})
                            </h5>
                            <ul>
                                {matchingGenres.map(genre => (
                                    <ModalCompactListItem key={genre}>{genre}</ModalCompactListItem>))}
                            </ul>
                        </ModalSection>
                    )}
                    {matchingArtists.length > 0 && (
                        <ModalSection>
                            <h5><Users size={20}/> Matching Artists
                                ({sharedMusic?.artist_count || matchingArtists.length})</h5>
                            <ul>
                                {matchingArtists.map(artist => (
                                    <ModalCompactListItem key={artist}>{artist}</ModalCompactListItem>))}
                            </ul>
                        </ModalSection>
                    )}
                    {matchingTracks.length > 0 && (
                        <ModalSection>
                            <h5><Disc size={20}/> Matching Tracks ({sharedMusic?.track_count || matchingTracks.length})
                            </h5>
                            <ul>
                                {matchingTracks.map((trackTitle, index) => (
                                    <ModalCompactTrackItem key={`${trackTitle}-${index}`}>
                                        {trackTitle}
                                    </ModalCompactTrackItem>
                                ))}
                            </ul>
                        </ModalSection>
                    )}
                </ModalContent>
                <ModalFooter>
                    <MessageButton onClick={handleMessageClick}>Message</MessageButton>
                </ModalFooter>
            </ModalWindow>
        </>
    );
};

export default MatchCard;