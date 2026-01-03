import { useState, useRef, useEffect } from 'react';
import { useTripContext } from '../../context/TripContext';
import { useStoryContext } from '../../context/StoryContext';
import { Navigate, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import './TripStoryCreator.css';

const TripStoryCreator = () => {
    const { activeTrip, updateActiveTrip } = useTripContext();
    const { createStory, updateStory, getStoriesByTripId } = useStoryContext();
    const [storyTitle, setStoryTitle] = useState('');
    const [storyText, setStoryText] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [generatedStory, setGeneratedStory] = useState('');
    const fileInputRef = useRef(null);

    if (!activeTrip) {
        return <Navigate to="/trip-creator" replace />;
    }

    // Get or initialize trip story
    const getTripStory = () => {
        return activeTrip.tripStory || {
            title: '',
            content: '',
            image: null,
            createdAt: null,
        };
    };

    const tripStory = getTripStory();

    // Load existing story on mount
    useEffect(() => {
        if (activeTrip) {
            const existingStories = getStoriesByTripId(activeTrip.id);
            if (existingStories.length > 0) {
                const story = existingStories[0];
                setStoryTitle(story.title);
                setGeneratedStory(story.content);
                setImagePreview(story.image);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTrip?.id]);

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(file);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle voice input (mock - uses text fallback)
    const handleVoiceInput = () => {
        // Check if browser supports speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Voice input not supported in this browser. Please type your story instead.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setStoryText(prev => prev + ' ' + transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            alert('Voice input failed. Please type your story instead.');
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    // AI-mock story generation
    const generateAIStory = () => {
        if (!storyText.trim() && !imagePreview) {
            alert('Please add some text or upload an image to generate a story');
            return;
        }

        // Mock AI logic - generates story based on inputs
        const destination = activeTrip.destination;
        const startDate = new Date(activeTrip.startDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' });
        const endDate = new Date(activeTrip.endDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' });
        const duration = Math.ceil((new Date(activeTrip.endDate) - new Date(activeTrip.startDate)) / (1000 * 60 * 60 * 24));
        const travelType = activeTrip.travelType === 'solo' ? 'solo adventure' : activeTrip.travelType === 'couple' ? 'romantic getaway' : 'group expedition';

        // Generate story based on user input
        let aiStory = `# My Unforgettable Journey to ${destination}\n\n`;

        if (imagePreview) {
            aiStory += `*A picture is worth a thousand words, and this moment captured the essence of my trip.*\n\n`;
        }

        aiStory += `From ${startDate} to ${endDate}, I embarked on an incredible ${duration}-day ${travelType} to the beautiful ${destination}. `;

        if (storyText.trim()) {
            // Incorporate user's text into the story
            aiStory += `\n\n${storyText}\n\n`;
        }

        // Add AI-generated content
        aiStory += `This journey was filled with unforgettable moments and experiences. `;

        if (destination.toLowerCase().includes('goa')) {
            aiStory += `The golden beaches, vibrant nightlife, and delicious seafood made every moment special. `;
        } else if (destination.toLowerCase().includes('shimla') || destination.toLowerCase().includes('manali')) {
            aiStory += `The snow-capped mountains, crisp mountain air, and breathtaking views left me in awe. `;
        } else if (destination.toLowerCase().includes('jaipur') || destination.toLowerCase().includes('rajasthan')) {
            aiStory += `The majestic forts, colorful markets, and rich cultural heritage transported me to another era. `;
        } else {
            aiStory += `The local culture, friendly people, and unique experiences made this trip truly memorable. `;
        }

        aiStory += `\n\nEvery day brought new adventures and discoveries. From exploring hidden gems to trying authentic local cuisine, `;
        aiStory += `each moment added to the tapestry of memories I'll cherish forever.\n\n`;

        if (activeTrip.travelType === 'solo') {
            aiStory += `Traveling solo gave me the freedom to explore at my own pace and connect with myself in ways I never imagined. `;
        } else if (activeTrip.travelType === 'couple') {
            aiStory += `Sharing these experiences with my partner made every moment twice as special and created memories we'll treasure together. `;
        } else {
            aiStory += `The laughter, camaraderie, and shared experiences with my travel companions made this journey even more meaningful. `;
        }

        aiStory += `\n\nAs I reflect on this journey, I'm filled with gratitude for the experiences, the people I met, and the memories created. `;
        aiStory += `${destination} will always hold a special place in my heart, and I can't wait to return someday.\n\n`;
        aiStory += `*Until next time, ${destination}!*`;

        setGeneratedStory(aiStory);
        setStoryTitle(storyTitle || `My ${destination} Adventure`);
    };

    // Save story to activeTrip and StoryContext
    const handleSaveStory = () => {
        if (!generatedStory && !storyText) {
            alert('Please generate or write a story first');
            return;
        }

        const story = {
            title: storyTitle || `My Trip to ${activeTrip.destination}`,
            content: generatedStory || storyText,
            image: imagePreview,
            tripId: activeTrip.id,
            destination: activeTrip.destination,
            tripDates: {
                start: activeTrip.startDate,
                end: activeTrip.endDate,
            },
            travelType: activeTrip.travelType,
        };

        // Check if story already exists for this trip
        const existingStories = getStoriesByTripId(activeTrip.id);

        if (existingStories.length > 0) {
            // Update existing story
            updateStory(existingStories[0].id, story);
            alert('Story updated successfully!');
        } else {
            // Create new story
            createStory(story);
            alert('Story saved successfully!');
        }

        // Also save to trip for backward compatibility
        updateActiveTrip({
            tripStory: {
                ...story,
                createdAt: tripStory.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        });
    };

    // Download as PDF
    const handleDownloadPDF = () => {
        if (!generatedStory && !storyText) {
            alert('Please generate or write a story first');
            return;
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const maxWidth = pageWidth - 2 * margin;
        let yPosition = margin;

        // Add title
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        const title = storyTitle || `My Trip to ${activeTrip.destination}`;
        doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;

        // Add trip details
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(100);
        const details = `${activeTrip.destination} • ${activeTrip.startDate} to ${activeTrip.endDate}`;
        doc.text(details, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;

        // Add image if available
        if (imagePreview) {
            const imgWidth = maxWidth;
            const imgHeight = 100; // Fixed height for consistency

            if (yPosition + imgHeight > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }

            doc.addImage(imagePreview, 'JPEG', margin, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + 10;
        }

        // Add story content
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFont(undefined, 'normal');

        const content = generatedStory || storyText;
        const lines = doc.splitTextToSize(content, maxWidth);

        lines.forEach(line => {
            if (yPosition > pageHeight - margin) {
                doc.addPage();
                yPosition = margin;
            }
            doc.text(line, margin, yPosition);
            yPosition += 7;
        });

        // Add footer
        const totalPages = doc.internal.pages.length - 1;
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Page ${i} of ${totalPages} • Generated by AI Trip Planner`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            );
        }

        // Download
        const filename = `${activeTrip.destination.replace(/[^a-z0-9]/gi, '_')}_Story.pdf`;
        doc.save(filename);
    };

    // Load saved story
    const handleLoadSavedStory = () => {
        setStoryTitle(tripStory.title);
        setGeneratedStory(tripStory.content);
        setImagePreview(tripStory.image);
    };

    return (
        <div className="trip-story-creator-page">
            <div className="tool-header">
                <div>
                    <h1>📖 Trip Story Creator</h1>
                    <p className="tool-subtitle">Create your story for {activeTrip.destination}</p>
                </div>
                <Link to="/smart-tools" className="btn btn-secondary">
                    Back to Smart Tools
                </Link>
            </div>

            <div className="story-creator-grid">
                {/* Input Section */}
                <div className="input-section">
                    <div className="section-card">
                        <h3>Story Inputs</h3>

                        {/* Title Input */}
                        <div className="form-group">
                            <label htmlFor="story-title">Story Title</label>
                            <input
                                type="text"
                                id="story-title"
                                placeholder={`My Trip to ${activeTrip.destination}`}
                                value={storyTitle}
                                onChange={(e) => setStoryTitle(e.target.value)}
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="form-group">
                            <label>Upload Image</label>
                            <div className="image-upload-area">
                                {imagePreview ? (
                                    <div className="image-preview">
                                        <img src={imagePreview} alt="Preview" />
                                        <button
                                            className="btn-remove-image"
                                            onClick={() => {
                                                setUploadedImage(null);
                                                setImagePreview(null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                        >
                                            ✕ Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className="upload-placeholder"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <span className="upload-icon">📷</span>
                                        <p>Click to upload image</p>
                                        <span className="upload-hint">Max 5MB • JPG, PNG</span>
                                    </div>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                        {/* Text Input */}
                        <div className="form-group">
                            <label htmlFor="story-text">Your Story</label>
                            <textarea
                                id="story-text"
                                rows="8"
                                placeholder="Write about your experiences, favorite moments, or let AI generate it for you..."
                                value={storyText}
                                onChange={(e) => setStoryText(e.target.value)}
                            />
                        </div>

                        {/* Voice Input Button */}
                        <div className="voice-input-section">
                            <button
                                className={`btn btn-voice ${isListening ? 'listening' : ''}`}
                                onClick={handleVoiceInput}
                                disabled={isListening}
                            >
                                {isListening ? (
                                    <>
                                        <span className="pulse-icon">🎤</span>
                                        Listening...
                                    </>
                                ) : (
                                    <>
                                        🎤 Voice Input
                                    </>
                                )}
                            </button>
                            <span className="voice-hint">Click to speak your story</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button className="btn btn-primary btn-full" onClick={generateAIStory}>
                                ✨ Generate Story with AI
                            </button>
                            <div className="button-row">
                                <button className="btn btn-secondary" onClick={handleSaveStory}>
                                    💾 Save Story
                                </button>
                                <button className="btn btn-secondary" onClick={handleDownloadPDF}>
                                    📄 Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="preview-section">
                    <div className="section-card">
                        <h3>Live Preview</h3>
                        {generatedStory || storyText || imagePreview ? (
                            <div className="story-preview-content">
                                <h2 className="preview-title">
                                    {storyTitle || `My Trip to ${activeTrip.destination}`}
                                </h2>
                                <div className="preview-meta">
                                    <span>📍 {activeTrip.destination}</span>
                                    <span>📅 {activeTrip.startDate} - {activeTrip.endDate}</span>
                                    <span>
                                        {activeTrip.travelType === 'solo' && '🧳 Solo Trip'}
                                        {activeTrip.travelType === 'couple' && '💑 Couple Trip'}
                                        {activeTrip.travelType === 'group' && '👥 Group Trip'}
                                    </span>
                                </div>

                                {imagePreview && (
                                    <div className="preview-image">
                                        <img src={imagePreview} alt="Trip" />
                                    </div>
                                )}

                                <div className="preview-text">
                                    {(generatedStory || storyText).split('\n').map((paragraph, index) => {
                                        if (paragraph.startsWith('# ')) {
                                            return <h2 key={index}>{paragraph.substring(2)}</h2>;
                                        } else if (paragraph.startsWith('*') && paragraph.endsWith('*')) {
                                            return <p key={index} className="italic">{paragraph.slice(1, -1)}</p>;
                                        } else if (paragraph.trim()) {
                                            return <p key={index}>{paragraph}</p>;
                                        }
                                        return null;
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="preview-empty">
                                <span className="empty-icon">📖</span>
                                <p>Your story preview will appear here</p>
                                <p className="preview-hint">
                                    Upload an image, write your story, or click "Generate with AI"
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Saved Story Notice */}
            {tripStory.content && (
                <div className="saved-story-notice">
                    <span className="notice-icon">✓</span>
                    <span>You have a saved story for this trip</span>
                    <button className="btn-link" onClick={handleLoadSavedStory}>
                        Load Saved Story
                    </button>
                </div>
            )}
        </div>
    );
};

export default TripStoryCreator;
