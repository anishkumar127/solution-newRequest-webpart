import { useState, useRef } from "react"
import * as React from 'react'
import { ActionButton, FontIcon, Icon, mergeStyleSets } from 'office-ui-fabric-react';
import { IconButton, Label } from '@fluentui/react';


const CustomDropdown = ({ data, handleCancel, index,lightdark }: any) => {
  const [dropdown, setDropdown] = useState<any>(false);
  const AttachFontclass = mergeStyleSets({
    AttachColor :[{ color : lightdark == 'light' ? 'var(--lightdarkColor) !important' : 'var(--lightdarkBGGray) !important'}],
  });
  const dropdownRef = useRef<any>(null)
  const openDropdown = () => {
    setDropdown(!dropdown)
    if (dropdown) {
      dropdownRef.current.classList.add("open_dropdown")

      dropdownRef.current.style.height = dropdownRef.current.scrollHeight + "px"
    }
    else {
      dropdownRef.current.style.height = "0px"
      dropdownRef.current.classList.remove("open_dropdown")

    }
  }
  return (
    <>
      <div className='file_dropdown_box'>
        <Label className="fileNameLabel">{data.name}</Label>
        <FontIcon   iconName="ChevronDown" className={AttachFontclass.AttachColor} onClick={openDropdown} style={{marginLeft: "5px"}}>
         </FontIcon>

        <div className='file-dropdown-option' ref={dropdownRef} style={{ height: "0px" }}>

          <IconButton 
           styles={{
            root: {
                color: lightdark == 'light' ? 'var(--lightdarkColor)' : 'var(--lightdarkHoverBG)',}}
              }
          className="file-dropdown-option-cta flex" iconProps={{ iconName: "Installation" }} text="Delete File" onClick={ handleCancel(index)}/>
          {/* <button className="file-dropdown-option-cta flex" onClick={() => {
            handleCancel(index)
          }}>

            <Icon iconName="Installation" />
            <Label> Delete File</Label>

          </button> */}
        </div>

      </div>
    </>
  )
}

export default CustomDropdown