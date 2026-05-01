import { useNavigate } from "react-router-dom";
export default function NahideaInfor(){
    const navigate = useNavigate();
    return(
        <div id="form-footer-2">
          <p onClick={()=>{navigate('/nahidearule')}}>Nahidea Rule</p>
          <p onClick={()=>{navigate('/privacypolicy')}}>Private Policy</p>
          <p onClick={()=>{navigate('/useragreement')}}>User Agreement</p>
          <p onClick={()=>{navigate('/accessibility')}}>Accessibility</p>
          <p onClick={()=>{navigate('/home')}}>Nahidea. © 2026. All rights reserved </p>
      </div> 
    )
}