import React from 'react'
import NavBar from '../components/NavBar'
import '../components/About.css'

export default function About(){
    return(
        <>
        <NavBar/>
        <div className='about-container'>
            <h1 className='about-header'>About</h1>
            <h2 className='about-header2'>Overview</h2>
            <p className='about-content'>Our product intends to create a user-friendly tool for business 
                owners, managers, and operators in the video gaming industry in the state of Illinois. 
                This tool will simplify and streamline the process of aggregating, analyzing, and 
                visualizing public gaming data, which is currently only available through the Illinois 
                Gaming Board’s website. By allowing users to select multiple municipalities or 
                establishments at once, the tool will provide a comprehensive view of business performance
                 across different areas.
            </p>
            <p className='about-content'>Features such as customizable analytics will allow users to gain 
                deeper insight into their operations. Interactive charts and graphs will make it easier to
                 identify trends and compare key metrics. The ability to export reports, save preferences,
                  and securely access historical data ensures a seamless user experience.
            </p>
            <p className='about-content'>To further productivity, users can add notes directly to reports 
                or charts for future reference and share findings with others through email. This solution
                 will help businesses save time, improve decision making, and maintain a competitive edge 
                 within the industry.
            </p>
        </div>
        <div className='contact-container'>
            <h1 className='contact-header'>Contacts</h1>
            <p className='contact-content'>Paige Scott</p>
            <p className='contact-content'>Email: pscott10@murraystate.edu</p>
            <p className='contact-content'>Ally Robinson</p>
            <p className='contact-content'>Email: arobinson38@murraystate.edu</p>
        </div>
        </>
    )
}