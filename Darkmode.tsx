import React, { useState, useEffect } from 'react';

const Darkmode: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode-variables');
        } else {
            document.body.classList.remove('dark-mode-variables');
        }
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp" rel="stylesheet" />

            <div>
                <div className={`dark-mode ${isDarkMode ? 'active' : ''}`} onClick={toggleDarkMode}>
                    <span className={isDarkMode ? 'material-icons-sharp active' : 'material-icons-sharp'}>dark_mode</span>
                    <span className={isDarkMode ? 'material-icons-sharp' : 'material-icons-sharp active'}>light_mode</span>
                </div>
            </div>
        </>
    );
};

export default Darkmode;