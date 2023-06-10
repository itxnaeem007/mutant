import React from 'react';
import './RenderImage.css'
import Mov from './images/apes1.mov'

class RenderImage extends React.Component {
    render() { 
        return(
            <div className='render-image'>
                <img src={this.props.Image} alt="GIF" />
                {/* <video src={Mov} autoPlay loop></video> */}
            </div>
        );
    }
}
 
export default RenderImage;