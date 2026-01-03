import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, LogIn, UserPlus, ArrowLeft, LogOut, Phone, Upload, X, Camera } from 'lucide-react';
import './Auth.css';

const Auth = () => {
    const { user, signIn, signUp, signOut, updateProfile, loading } = useAuth();
    const navigate = useNavigate();

    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Profile editing state
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
        phone: user?.user_metadata?.phone || '',
        email: user?.email || '',
    });

    // Photo upload state
    const [uploadedPhotos, setUploadedPhotos] = useState([]);

    // Profile image state
    const [profileImage, setProfileImage] = useState(user?.user_metadata?.avatar_url || null);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleProfileChange = (e) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            return false;
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }

        if (isSignUp) {
            if (!formData.name) {
                setError('Name is required');
                return false;
            }

            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        try {
            if (isSignUp) {
                const { user, error } = await signUp(
                    formData.email,
                    formData.password,
                    { name: formData.name }
                );

                if (error) {
                    setError(error.message || 'Failed to sign up. Please try again.');
                    return;
                }

                if (user && !user.email_confirmed_at) {
                    setSuccess('Account created! Please check your email to confirm your account.');
                } else {
                    setSuccess('Account created successfully! Redirecting...');
                    setTimeout(() => {
                        navigate('/overview');
                    }, 1500);
                }
            } else {
                const { user, error } = await signIn(formData.email, formData.password);

                if (error) {
                    if (error.message && error.message.includes('Email not confirmed')) {
                        setError('Please confirm your email address before signing in. Check your inbox for the confirmation link.');
                    } else {
                        setError(error.message || 'Invalid email or password');
                    }
                    return;
                }

                setSuccess('Signed in successfully! Redirecting...');
                setTimeout(() => {
                    navigate('/overview');
                }, 1500);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
            console.error('Auth error:', err);
        }
    };

    const handleLogout = async () => {
        const { error } = await signOut();
        if (!error) {
            navigate('/');
        }
    };

    const handleSaveProfile = async () => {
        const { error } = await updateProfile({
            name: profileData.name,
            phone: profileData.phone,
        });

        if (error) {
            setError('Failed to update profile');
        } else {
            setSuccess('Profile updated successfully!');
            setIsEditingProfile(false);
            setTimeout(() => setSuccess(''), 3000);
        }
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = files.map(file => ({
            id: Date.now() + Math.random(),
            url: URL.createObjectURL(file),
            file: file
        }));
        setUploadedPhotos([...uploadedPhotos, ...newPhotos]);
    };

    const handleProfileImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
            // In a real app, you would upload to server here
            // and update user metadata with the URL
        }
    };


    const handleRemovePhoto = (photoId) => {
        setUploadedPhotos(uploadedPhotos.filter(photo => photo.id !== photoId));
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError('');
        setSuccess('');
        setFormData({
            email: '',
            password: '',
            name: '',
            confirmPassword: '',
        });
    };

    // If user is logged in, show profile page
    if (user) {
        return (
            <div className="auth-page profile-page">
                <div className="profile-container">
                    {/* Back Button */}
                    <button className="auth-back-btn" onClick={() => navigate('/overview')}>
                        <ArrowLeft size={20} />
                        Back to Overview
                    </button>

                    {/* Profile Card */}
                    <div className="profile-card">
                        {/* Header */}
                        <div className="profile-header">
                            <div className="profile-avatar-wrapper">
                                <div className="profile-avatar">
                                    {profileImage ? (
                                        <img src={profileImage} alt="Profile" className="profile-avatar-img" />
                                    ) : (
                                        <User size={48} />
                                    )}
                                </div>
                                <label className="avatar-upload-btn" title="Change profile picture">
                                    <Camera size={20} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfileImageUpload}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>
                            <h1>My Profile</h1>
                            <p className="profile-subtitle">Manage your account information</p>
                        </div>

                        {/* Success/Error Messages */}
                        {error && (
                            <div className="auth-message error">
                                <span>⚠️</span>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="auth-message success">
                                <span>✅</span>
                                {success}
                            </div>
                        )}

                        {/* Profile Information */}
                        <div className="profile-section">
                            <div className="section-header">
                                <h2>Personal Information</h2>
                                {!isEditingProfile && (
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setIsEditingProfile(true)}
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            <div className="profile-info-grid">
                                <div className="info-item">
                                    <label>
                                        <User size={18} />
                                        Full Name
                                    </label>
                                    {isEditingProfile ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileChange}
                                            placeholder="Enter your name"
                                        />
                                    ) : (
                                        <p>{profileData.name}</p>
                                    )}
                                </div>

                                <div className="info-item">
                                    <label>
                                        <Mail size={18} />
                                        Email Address
                                    </label>
                                    <p>{profileData.email}</p>
                                    <span className="info-note">Email cannot be changed</span>
                                </div>

                                <div className="info-item">
                                    <label>
                                        <Phone size={18} />
                                        Contact Number
                                    </label>
                                    {isEditingProfile ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleProfileChange}
                                            placeholder="Enter your phone number"
                                        />
                                    ) : (
                                        <p>{profileData.phone || 'Not provided'}</p>
                                    )}
                                </div>
                            </div>

                            {isEditingProfile && (
                                <div className="profile-actions">
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSaveProfile}
                                        disabled={loading}
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setIsEditingProfile(false);
                                            setProfileData({
                                                name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
                                                phone: user?.user_metadata?.phone || '',
                                                email: user?.email || '',
                                            });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Photo Upload Section */}
                        <div className="profile-section">
                            <div className="section-header">
                                <h2>My Photos</h2>
                                <label className="btn btn-secondary btn-sm upload-btn">
                                    <Upload size={16} />
                                    Upload Photos
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handlePhotoUpload}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>

                            <div className="photo-grid">
                                {uploadedPhotos.length === 0 ? (
                                    <div className="empty-photos">
                                        <Camera size={48} />
                                        <p>No photos uploaded yet</p>
                                        <span>Upload photos of your trips and experiences</span>
                                    </div>
                                ) : (
                                    uploadedPhotos.map(photo => (
                                        <div key={photo.id} className="photo-item">
                                            <img src={photo.url} alt="Uploaded" />
                                            <button
                                                className="remove-photo-btn"
                                                onClick={() => handleRemovePhoto(photo.id)}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Logout Button */}
                        <div className="profile-section">
                            <button
                                className="btn btn-danger logout-btn"
                                onClick={handleLogout}
                                disabled={loading}
                            >
                                <LogOut size={20} />
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // If user is not logged in, show login/signup form
    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Back Button */}
                <button className="auth-back-btn" onClick={() => navigate('/')}>
                    <ArrowLeft size={20} />
                    Back to Home
                </button>

                {/* Auth Card */}
                <div className="auth-card">
                    {/* Header */}
                    <div className="auth-header">
                        <div className="auth-icon">
                            {isSignUp ? <UserPlus size={32} /> : <LogIn size={32} />}
                        </div>
                        <h1>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
                        <p className="auth-subtitle">
                            {isSignUp
                                ? 'Sign up to start planning your trips'
                                : 'Sign in to continue your journey'}
                        </p>
                    </div>

                    {/* Error/Success Messages */}
                    {error && (
                        <div className="auth-message error">
                            <span>⚠️</span>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="auth-message success">
                            <span>✅</span>
                            {success}
                        </div>
                    )}

                    {/* Form */}
                    <form className="auth-form" onSubmit={handleSubmit}>
                        {/* Name Field (Sign Up Only) */}
                        {isSignUp && (
                            <div className="form-group">
                                <label htmlFor="name">
                                    <User size={18} />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="form-group">
                            <label htmlFor="email">
                                <Mail size={18} />
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                            <label htmlFor="password">
                                <Lock size={18} />
                                Password
                            </label>
                            <div className="password-input">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field (Sign Up Only) */}
                        {isSignUp && (
                            <div className="form-group">
                                <label htmlFor="confirmPassword">
                                    <Lock size={18} />
                                    Confirm Password
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="auth-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="loading-spinner">⏳</span>
                            ) : isSignUp ? (
                                <>
                                    <UserPlus size={20} />
                                    Create Account
                                </>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle Mode */}
                    <div className="auth-toggle">
                        <p>
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            <button
                                type="button"
                                onClick={toggleMode}
                                disabled={loading}
                                className="toggle-link"
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </div>

                    {/* Guest Mode */}
                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    <button
                        type="button"
                        className="guest-mode-btn"
                        onClick={() => navigate('/overview')}
                        disabled={loading}
                    >
                        Continue as Guest
                    </button>

                    <p className="guest-note">
                        Guest mode uses local storage. Your data won't sync across devices.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
