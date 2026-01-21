import { useState } from 'react';
import { Image, X, Upload, Trash2, ZoomIn } from 'lucide-react';
import './PhotoGallery.css';

const PhotoGallery = ({ tripId, photos = [], onPhotosUpdate }) => {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);

        // Convert files to base64 for local storage
        const newPhotos = await Promise.all(
            files.map(async (file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({
                            id: Date.now() + Math.random(),
                            url: reader.result,
                            name: file.name,
                            uploadedAt: new Date().toISOString(),
                        });
                    };
                    reader.readAsDataURL(file);
                });
            })
        );

        const updatedPhotos = [...photos, ...newPhotos];
        onPhotosUpdate(updatedPhotos);
        setUploading(false);
    };

    const handleDelete = (photoId) => {
        const updatedPhotos = photos.filter(p => p.id !== photoId);
        onPhotosUpdate(updatedPhotos);
    };

    const openLightbox = (photo) => {
        setSelectedPhoto(photo);
    };

    const closeLightbox = () => {
        setSelectedPhoto(null);
    };

    return (
        <div className="photo-gallery-section">
            <div className="gallery-header">
                <div className="gallery-title">
                    <Image size={24} />
                    <h2>Trip Photos</h2>
                    <span className="photo-count">{photos.length}</span>
                </div>
                <label className="upload-btn">
                    <Upload size={18} />
                    Upload Photos
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        disabled={uploading}
                    />
                </label>
            </div>

            {photos.length === 0 ? (
                <div className="empty-gallery">
                    <Image size={48} />
                    <p>No photos yet</p>
                    <span>Upload photos to remember your trip</span>
                </div>
            ) : (
                <div className="photo-grid">
                    {photos.map((photo) => (
                        <div key={photo.id} className="photo-item">
                            <img src={photo.url} alt={photo.name} />
                            <div className="photo-overlay">
                                <button
                                    className="photo-action zoom"
                                    onClick={() => openLightbox(photo)}
                                    title="View full size"
                                >
                                    <ZoomIn size={20} />
                                </button>
                                <button
                                    className="photo-action delete"
                                    onClick={() => handleDelete(photo.id)}
                                    title="Delete photo"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {uploading && (
                <div className="upload-overlay">
                    <div className="upload-spinner"></div>
                    <p>Uploading photos...</p>
                </div>
            )}

            {selectedPhoto && (
                <div className="lightbox" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>
                        <X size={32} />
                    </button>
                    <img src={selectedPhoto.url} alt={selectedPhoto.name} />
                </div>
            )}
        </div>
    );
};

export default PhotoGallery;
