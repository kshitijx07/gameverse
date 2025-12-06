import React, { useEffect, useRef } from 'react';

const DataStreams = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const streamCount = 15;
        const streams = [];

        for (let i = 0; i < streamCount; i++) {
            const stream = document.createElement('div');
            stream.className = 'data-stream';
            stream.style.left = `${Math.random() * 100}%`;
            stream.style.animationDelay = `${Math.random() * 3}s`;
            stream.style.animationDuration = `${3 + Math.random() * 2}s`;
            container.appendChild(stream);
            streams.push(stream);
        }

        return () => {
            streams.forEach(stream => stream.remove());
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 2 }}
        />
    );
};

export default DataStreams;
