import React, {useState, useEffect} from 'react';
import {User, MapPin, Camera, Music} from 'lucide-react';
import {useLocation, useNavigate} from "react-router-dom";
import {
    Container,
    ProfileCard,
    Title,
    Section,
    SectionTitle,
    Grid,
    Input,
    Select,
    TextArea,
    ImageUploadSection,
    ImagePreview,
    UploadButton,
    ActionButton,
    ButtonContainer,
    EditButton,
    LogoutButton, MainContent,
    GenreTag,
    GenreContainer
} from './ProfileLayout';
import Header from "../MainScreen/Header";
import {BASE_URL} from "../config";

const profileService = {
    fetchProfile: async (token) => {
        const response = await fetch(`${BASE_URL}/user/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }
        return response.json();
    },

    updateProfile: async (token, formData) => {
        const response = await fetch(`${BASE_URL}/update_user/me`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to update profile');
        }
        return response.json();
    }
};

const initialProfileState = {
    first_name: '',
    last_name: '',
    birth_date: '',
    gender: '',
    bio: '',
    location: '',
    profile_picture_url: null,
    genres: []
};

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditMode = location.pathname === '/profile/edit';
    const token = localStorage.getItem('access_token');

    const [profile, setProfile] = useState(initialProfileState);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const fetchProfileData = async () => {
        try {
            setError(null);
            const data = await profileService.fetchProfile(token);
            console.log(data);
            setProfile(data);
            if (data.profile_picture_url) {
                setImagePreview(data.profile_picture_url);
            }

        } catch (error) {
            setError('Failed to load profile data');
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [isEditMode]);

    const handleImageUpload = (e) => {
        if (!isEditMode) return;

        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            setError('Please upload a valid image file (JPEG, PNG, or GIF)');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('Image size should be less than 5MB');
            return;
        }

        setProfilePicture(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleInputChange = (field, value) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);

            const formData = new FormData();

            Object.entries(profile).forEach(([key, value]) => {
                if (value !== initialProfileState[key] && value !== null) {
                    formData.append(key, value);
                }
            });

            if (profilePicture) {
                formData.append('file', profilePicture);
            }

            await profileService.updateProfile(token, formData);
            navigate('/profile');
            setProfilePicture(null);
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        navigate('/login');
    };

    if (loading) {
        return <Container>Loading...</Container>;
    }

    const hasGenres = Array.isArray(profile.genres) && profile.genres.length > 0;

    return (
        <Container>
            <MainContent>
                <Header/>
                <ProfileCard>
                    <div className="flex justify-between items-center">
                        <Title>Profile Settings</Title>
                        <ButtonContainer>
                            {!isEditMode && (
                                <EditButton onClick={() => navigate('/profile/edit')}>
                                    Edit Profile
                                </EditButton>
                            )}
                            <LogoutButton onClick={handleLogout}>
                                Log Out
                            </LogoutButton>
                        </ButtonContainer>
                    </div>

                    <Section>
                        <SectionTitle>Profile Picture</SectionTitle>
                        <ImageUploadSection>
                            <ImagePreview>
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <User size={40}/>
                                )}
                            </ImagePreview>
                            {isEditMode && (
                                <UploadButton as="label">
                                    <Camera size={20}/>
                                    Upload Photo
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/jpeg,image/png,image/gif"
                                        onChange={handleImageUpload}
                                    />
                                </UploadButton>
                            )}
                        </ImageUploadSection>
                    </Section>

                    <Section>
                        <SectionTitle>Basic Information</SectionTitle>
                        <Grid>
                            <Input
                                type="text"
                                placeholder="First Name"
                                value={profile.first_name || ''}
                                onChange={e => handleInputChange('first_name', e.target.value)}
                                disabled={!isEditMode}
                            />
                            <Input
                                type="text"
                                placeholder="Last Name"
                                value={profile.last_name || ''}
                                onChange={e => handleInputChange('last_name', e.target.value)}
                                disabled={!isEditMode}
                            />
                            <Input
                                type="date"
                                value={profile.birth_date || ''}
                                onChange={e => handleInputChange('birth_date', e.target.value)}
                                disabled={!isEditMode}
                            />
                            <Select
                                value={profile.gender || ''}
                                onChange={e => handleInputChange('gender', e.target.value)}
                                disabled={!isEditMode}
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">Prefer not to say</option>
                            </Select>
                        </Grid>
                    </Section>

                    <Section>
                        <SectionTitle>About You</SectionTitle>
                        <TextArea
                            placeholder="Tell us about yourself..."
                            value={profile.bio || ''}
                            onChange={e => handleInputChange('bio', e.target.value)}
                            disabled={!isEditMode}
                        />
                    </Section>

                    <Section>
                        <SectionTitle>
                            <MapPin size={16} className="inline mr-2"/>
                            Location
                        </SectionTitle>
                        <Grid>
                            <Input
                                type="text"
                                placeholder="Enter your location"
                                value={profile.location || ''}
                                onChange={e => handleInputChange('location', e.target.value)}
                                disabled={!isEditMode}
                                className="col-span-full"
                            />
                        </Grid>
                    </Section>

                    {hasGenres && (
                        <Section>
                            <SectionTitle>
                                <Music size={16} className="inline mr-2"/>
                                Favorite Music Genres
                            </SectionTitle>

                            <GenreContainer>
                                {profile.genres.map((genre) => (
                                    <GenreTag key={genre}>
                                        {genre}
                                    </GenreTag>
                                ))}
                            </GenreContainer>
                        </Section>
                    )}

                    {isEditMode && (
                        <ActionButton
                            onClick={handleSave}
                            disabled={saving}
                            className="mt-6"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </ActionButton>
                    )}
                </ProfileCard>
            </MainContent>
        </Container>
    );
};

export default Profile;