import React from 'react';

/** Voyager probe, drawn dish-on: high-gain antenna, bus with the Golden Record and its booms */
export const Voyager = () => (
    <svg viewBox="0 0 64 64" width="44" height="44" aria-hidden="true">
        {/* Magnetometer boom, the long one */}
        <line x1="30" y1="36" x2="3" y2="5" stroke="#8892b0" strokeWidth="0.7" />
        <circle cx="3" cy="5" r="1" fill="#a8b2d1" />
        {/* Plasma wave antennas */}
        <line x1="34" y1="42" x2="58" y2="60" stroke="#8892b0" strokeWidth="0.4" />
        <line x1="30" y1="42" x2="12" y2="62" stroke="#8892b0" strokeWidth="0.4" />
        {/* RTG boom with the three nuclear power generators */}
        <line x1="28" y1="42" x2="8" y2="50" stroke="#8892b0" strokeWidth="1" />
        <rect x="9" y="46.5" width="4" height="3" rx="0.8" fill="#495670" transform="rotate(-22 11 48)" />
        <rect x="14" y="44.5" width="4" height="3" rx="0.8" fill="#495670" transform="rotate(-22 16 46)" />
        <rect x="19" y="42.5" width="4" height="3" rx="0.8" fill="#495670" transform="rotate(-22 21 44)" />
        {/* Science boom with the scan platform and cameras */}
        <line x1="36" y1="40" x2="56" y2="44" stroke="#8892b0" strokeWidth="1" />
        <rect x="52" y="40" width="6" height="5" rx="1" fill="#a8b2d1" />
        <rect x="57" y="41" width="3" height="2" fill="#ccd6f6" />
        {/* Bus */}
        <polygon points="27,37 37,37 39,41 37,45 27,45 25,41" fill="#495670" stroke="#8892b0" strokeWidth="0.5" />
        {/* The Golden Record */}
        <circle cx="32" cy="41" r="2.2" fill="#f7c948" />
        <circle cx="32" cy="41" r="0.6" fill="#b8860b" />
        {/* High-gain antenna dish */}
        <circle cx="32" cy="24" r="14" fill="#e6f1ff" stroke="#a8b2d1" strokeWidth="0.8" />
        <circle cx="32" cy="24" r="9" fill="none" stroke="#ccd6f6" strokeWidth="0.5" />
        <line x1="32" y1="12" x2="32" y2="36" stroke="#a8b2d1" strokeWidth="0.4" />
        <line x1="20" y1="24" x2="44" y2="24" stroke="#a8b2d1" strokeWidth="0.4" />
        <circle cx="32" cy="24" r="2" fill="#8892b0" />
    </svg>
);
