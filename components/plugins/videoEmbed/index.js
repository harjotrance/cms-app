import React from 'react';

const VideoEmbedBlock = ({ videoUrl }) => {
    // Simple validation to ensure videoUrl is provided
    if (!videoUrl) {
        return <p className="plugin-error">Video URL is missing. Please configure the Video Embed block.</p>;
    }

    let embedUrl = videoUrl;

    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;
        if (videoId) {
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else {
            return <p className="plugin-error">Invalid YouTube URL.</p>;
        }
    } else if (videoUrl.includes('vimeo.com')) {
        const videoIdMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;
        if (videoId) {
            embedUrl = `https://player.vimeo.com/video/${videoId}`;
        } else {
            return <p className="plugin-error">Invalid Vimeo URL.</p>;
        }
    }
    // For other platforms or generic URLs, you might just use the provided URL directly

    return (
        <div className="video-embed-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
            <iframe
                className="video-embed-iframe"
                src={embedUrl}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
        </div>
    );
};

export default VideoEmbedBlock;