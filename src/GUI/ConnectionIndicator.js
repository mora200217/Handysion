// connectionIndicator.js 
import './styles/connectionIndicator.css'

export const ConnectionIndicator = () => {
    return(
        <div className = "modal-main" id = "modal-leap">
            <div className = "d-flex flex-column justify-content-center align-items-center h-100">
                {/* <img> </img> */}
                <p style = { {color: 'white'}}>Connect the <strong> LeapMotion</strong> or Unpause it to continue.</p>
            </div>
        </div>
    )
}