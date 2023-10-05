import React from 'react'
import { useStore } from '../../store/zustand';
import { Icon } from 'office-ui-fabric-react';
const helpDeskLog = require('../../../../../assets/help-desk.png');
const helpDeskLogDarkMode = require('../../../../../assets/HD365-Icon-White-1200.png');
const Header = ({SubmitTicket}) => {
  const ThemesColor = useStore((state) => state.ThemesColor);
  const setExpandMode = useStore((state) => state.setExpandMode);
  // console.log("theme", ThemesColor);
  const handleExpandScreen = () => {
    console.log("clicked")
    setExpandMode(false);
  }
  return (
    <>
      <div className='add-new-ticket-header-style-large'>
        <img src={ThemesColor === "light" ? helpDeskLog : helpDeskLogDarkMode} alt='helpdesk' />
        <span className='helpdesk-name-style logo-name-helpdesk'>HelpDesk 365</span>
        <span className='helpdesk-name-style new-ticket-helpdesk-title'>Raise New Request</span>
        <Icon className='add-new-full-screen-icon send-on-submit-add-new-icon add-new-ticket-pointer' iconName="Clear" onClick={handleExpandScreen} />
        <Icon onClick={()=>SubmitTicket()} style={{ marginRight: "12px" }} className='send-on-submit-add-new-icon add-new-ticket-pointer' iconName="Send" />


      </div>
    </>
  )
}

export default Header