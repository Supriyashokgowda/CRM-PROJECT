"use client"; // Ensures this component runs on the client side

import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <button onClick={handlePrev} disabled={currentPage === 1}>Previous</button>
            <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
        </div>
    );
};

export default Pagination; // Ensure only one default export here