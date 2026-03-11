import React, { useEffect } from 'react';
import './Loading.css';

const Preloader = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="loader-container">
            <div className="modern-spinner">
                <div className="spinner-core"></div>
            </div>
        </div>
    );
};

export default Preloader;