import React from 'react';
import Logo from './images/logo.png'

class RenderLogo extends React.Component {
    render() { 
        return (
            <div className='render-main-image'>
                <img src={Logo} alt="Logo" style={{'width': '100%'}} />
            </div>
        );
    }
}
 
export default RenderLogo;