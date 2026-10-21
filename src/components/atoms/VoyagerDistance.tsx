import React, { useEffect, useState } from 'react';

/**
 * Voyager 1's distance from the Sun, ticking live. It's a straight-line
 * extrapolation from a known point (≈166 AU on 1 Jan 2025, receding at
 * ≈16.99 km/s), which is accurate to well under a percent for years.
 */
const AU_KM = 149_597_870.7;
const REFERENCE_TIME = Date.UTC(2025, 0, 1);
const REFERENCE_KM = 166 * AU_KM;
const SPEED_KM_PER_S = 16.99;
const TICK_MS = 100;

const distanceNow = () => REFERENCE_KM + ((Date.now() - REFERENCE_TIME) / 1000) * SPEED_KM_PER_S;
const format = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export const VoyagerDistance = () => {
    const [km, setKm] = useState(distanceNow);

    useEffect(() => {
        const timer = window.setInterval(() => setKm(distanceNow()), TICK_MS);
        return () => window.clearInterval(timer);
    }, []);

    return (
        <div className="voyager-distance" title="Voyager 1, launched 1977, the farthest human-made object">
            Voyager 1 is <span className="voyager-distance__km">{format.format(km)}</span> km from the Sun and counting
        </div>
    );
};
