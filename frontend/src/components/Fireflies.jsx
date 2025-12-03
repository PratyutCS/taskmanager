import React from 'react';

const Fireflies = () => {
    const fireflies = Array.from({ length: 25 });

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {fireflies.map((_, i) => (
                <div
                    key={i}
                    className="firefly"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${10 + Math.random() * 20}s`,
                    }}
                />
            ))}
        </div>
    );
};

export default Fireflies;
