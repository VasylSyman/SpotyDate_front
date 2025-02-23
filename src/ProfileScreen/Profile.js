import React, {useState, useEffect} from 'react';
import {User, MapPin, Camera} from 'lucide-react';
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
    LogoutButton
} from './ProfileLayout';

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isEditMode = location.pathname === '/profile/edit';

    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        birth_date: '',
        gender: '',
        bio: '',
        location: '',
        profile_picture_url: null
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('http://0.0.0.0:8000/user/me', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            const data = await response.json();
            setProfile(data);
            if (data.profile_picture_url) {
                setImagePreview(data.profile_picture_url);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    // Add new useEffect to handle path changes
    useEffect(() => {
        if (!isEditMode) {
            fetchProfileData();
        }
    }, [isEditMode]);

    const handleImageUpload = (e) => {
        if (!isEditMode) return;
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            const formData = new FormData();

            // Only append values that are not null or undefined
            if (profile.first_name) formData.append('first_name', profile.first_name);
            if (profile.last_name) formData.append('last_name', profile.last_name);
            if (profile.birth_date) formData.append('birth_date', profile.birth_date);
            if (profile.gender) formData.append('gender', profile.gender);
            if (profile.bio) formData.append('bio', profile.bio);
            if (profile.location) formData.append('location', profile.location);
            if (profilePicture) formData.append('file', profilePicture);

            const response = await fetch('http://0.0.0.0:8000/update_user/me', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to update profile');
            }

            // Navigate to profile view mode
            navigate('/profile');

            // Reset the profile picture state
            setProfilePicture(null);

        } catch (error) {
            console.error('Error updating profile:', error);
            // You might want to show an error message to the user here
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = () => {
        navigate('/profile/edit');
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        navigate('/login');
    };

    if (loading) {
        return <Container>Loading...</Container>;
    }

    return (
        <Container>
            <ProfileCard>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Title>Profile Settings</Title>
                    <ButtonContainer>
                        {!isEditMode && (
                            <EditButton onClick={handleEdit}>
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
                                <img src={imagePreview} alt="Profile"/>
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
                                    accept="image/*"
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
                            onChange={e => setProfile(prev => ({...prev, first_name: e.target.value}))}
                            disabled={!isEditMode}
                        />
                        <Input
                            type="text"
                            placeholder="Last Name"
                            value={profile.last_name || ''}
                            onChange={e => setProfile(prev => ({...prev, last_name: e.target.value}))}
                            disabled={!isEditMode}
                        />
                        <Input
                            type="date"
                            value={profile.birth_date || ''}
                            onChange={e => setProfile(prev => ({...prev, birth_date: e.target.value}))}
                            disabled={!isEditMode}
                        />
                        <Select
                            value={profile.gender || ''}
                            onChange={e => setProfile(prev => ({...prev, gender: e.target.value}))}
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
                        onChange={e => setProfile(prev => ({...prev, bio: e.target.value}))}
                        disabled={!isEditMode}
                    />
                </Section>

                <Section>
                    <SectionTitle><MapPin size={16}/> Location</SectionTitle>
                    <Grid>
                        <Input
                            type="text"
                            placeholder="Enter your location"
                            value={profile.location || ''}
                            onChange={e => setProfile(prev => ({...prev, location: e.target.value}))}
                            disabled={!isEditMode}
                            style={{gridColumn: '1 / -1'}}
                        />
                    </Grid>
                </Section>

                {isEditMode && (
                    <ActionButton onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </ActionButton>
                )}
            </ProfileCard>
        </Container>
    );
};

export default Profile;