import React from 'react'
import './CreateReportModal.css'

export default function CreateReportModal({isOpen, onClose, children}){
    if(!isOpen) return null; 

    return(
        <>
        <div className="modal">
            <div className="overlay" onClick={onClose}></div>
            <div className="modal-content">
                <button className='close-modal' onClick={onClose}>Exit</button>
                {children}
            </div>
        </div>
        </>
    );
}