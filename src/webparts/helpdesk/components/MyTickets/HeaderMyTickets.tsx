import React from 'react'
import { useStore } from '../../store/store';
const  helpDeskLog = require( '../../../../../assets/help-desk.png');
const  helpDeskLogDarkMode = require( '../../../../../assets/HD365-Icon-White-1200.png');
let themeMode="site"
const Header = (props) => {
    // const {ThemesColor} = props;
    const ThemesColor = useStore((state)=>state.ThemesColor)
    // console.log("check",ThemesColorCheck)
    console.log("theme",ThemesColor);
  return (
    <>
<div className='add-new-ticket-header-style'>
    <img src={ThemesColor==="light" ? helpDeskLog : helpDeskLogDarkMode} alt='helpdesk'/>
    <span className='helpdesk-name-style logo-name-helpdesk'>HelpDesk 365</span>
    <span className='helpdesk-name-style new-ticket-helpdesk-title'>My Tickets</span>

</div>
    </>
  )
}

export default Header