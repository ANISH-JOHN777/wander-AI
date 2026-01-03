import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { CheckCircle, XCircle, Loader, Mail } from 'lucide-react';
import './EmailConfirmation.css';

const EmailConfirmation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        verifyEmail();
    }, []);

    const verifyEmail = async () => {
        try {
            // Get the token from URL
            const token = searchParams.get('token');
            const type = searchParams.get('type');

            if (!token || type !== 'signup') {
                setStatus('error');
                setMessage('Invalid confirmation link. Please try signing up again.');
                return;
            }

            // Verify the email with Supabase
            const { data, error } = await supabase.auth.verifyOtp({
                token_hash: token,
                type: 'signup'
            });

            if (error) {
                console.error('Email verification error:', error);
                setStatus('error');
                setMessage(error.message || 'Failed to verify email. The link may have expired.');
                return;
            }

            if (data) {
                setStatus('success');
                setMessage('Your email has been confirmed successfully!');

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/auth?confirmed=true');
                }, 3000);
            }
        } catch (error) {
            console.error('Verification error:', error);
            setStatus('error');
            setMessage('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="email-confirmation-page">
            <div className="confirmation-container">
                <div className="confirmation-card">
                    {status === 'verifying' && (
                        <>
                            <div className="status-icon verifying">
                                <Loader size={64} className="spinner" />
                            </div>
                            <h1>Verifying Your Email</h1>
                            <p>Please wait while we confirm your email address...</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="status-icon success">
                                <CheckCircle size={64} />
                            </div>
                            <h1>Email Confirmed!</h1>
                            <p>{message}</p>
                            <p className="redirect-message">
                                Redirecting you to login...
                            </p>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/auth')}
                            >
                                Go to Login Now
                            </button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="status-icon error">
                                <XCircle size={64} />
                            </div>
                            <h1>Verification Failed</h1>
                            <p>{message}</p>
                            <div className="error-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => navigate('/auth')}
                                >
                                    Back to Sign Up
                                </button>
                            </div>
                        </>
                    )}
                </div>

                <div className="help-section">
                    <Mail size={24} />
                    <h3>Need Help?</h3>
                    <p>If you're having trouble confirming your email, please contact support.</p>
                </div>
            </div>
        </div>
    );
};

export default EmailConfirmation;
