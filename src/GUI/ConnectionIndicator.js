// connectionIndicator.js 
import './styles/connectionIndicator.css'
import Logo from './assets/leap.svg'; 
export const ConnectionIndicator = () => {
    return(
        <div className = "modal-main" id = "modal-leap">
            <div className = "d-flex flex-column justify-content-center align-items-center h-100">
                <img  className = "logo-leap" src = { Logo } />
                <p style = { {color: 'white'}}>Connect the <strong> LeapMotion</strong> or Unpause it to continue.</p>
            </div>
        </div>
    )
}