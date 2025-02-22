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
        firstName: '',
        lastName: '',
        birthDate: '',
        gender: '',
        bio: '',
        location: '',
        profilePicture: null
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('YOUR_BACKEND_URL/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setProfile(data);
            if (data.profilePicture) {
                setImagePreview(data.profilePicture);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e) => {
        if (!isEditMode) return;
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setProfile(prev => ({...prev, profilePicture: file}));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Saving profile:', profile);
            // Here you would normally send the data to your backend
            navigate('/profile');
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = () => {
        navigate('/profile/edit');
    };

    const handleLogout = () => {
        console.log('Logging out...');
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
                            value={profile.firstName}
                            onChange={e => setProfile(prev => ({...prev, firstName: e.target.value}))}
                            disabled={!isEditMode}
                        />
                        <Input
                            type="text"
                            placeholder="Last Name"
                            value={profile.lastName}
                            onChange={e => setProfile(prev => ({...prev, lastName: e.target.value}))}
                            disabled={!isEditMode}
                        />
                        <Input
                            type="date"
                            value={profile.birthDate}
                            onChange={e => setProfile(prev => ({...prev, birthDate: e.target.value}))}
                            disabled={!isEditMode}
                        />
                        <Select
                            value={profile.gender}
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
                        value={profile.bio}
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
                            value={profile.location}
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