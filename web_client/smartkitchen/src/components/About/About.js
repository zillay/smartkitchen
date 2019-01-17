import React, { Component } from 'react';
import './About.css';

import Navbar from '../Navbar/Navbar';

const About = (props) => {
    const _main = props._main;
    
    return (
    <div className="About">
        <Navbar _main={_main} />
        <div className="about-ctr">
            <h3>About Project</h3>
            <p>
                Dummy Text. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
            </p>
            <br />
            <h3>Project Members</h3>
            <p><b>Zill E Rehman</b><br />BSIT-F15-LC-204</p>
            <p><b>Umair Hussnain</b><br />BSIT-F15-LC-206</p>
            <p><b>Muhammad Imran</b><br />BSIT-F15-LC-207</p>
            <br />
            <br />
        </div>
    </div>
    )
}

export default About;
