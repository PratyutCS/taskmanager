import React from 'react';

const Fireflies = () => {
    const [fireflies] = React.useState(() =>
        Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 20}s`,
        }))
    );

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {fireflies.map((firefly) => (
                <div
                    key={firefly.id}
                    className="firefly"
                    style={{
                        left: firefly.left,
                        top: firefly.top,
                        animationDelay: firefly.animationDelay,
                        animationDuration: firefly.animationDuration,
                    }}
                />
            ))}
        </div>
    );
};

export default Fireflies;
