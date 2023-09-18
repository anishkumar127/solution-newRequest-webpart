import { IconButton, Label } from '@fluentui/react';
import React, { useRef } from 'react';
// import CustomDropdown from './CustomDropdown';
import CustomDropdown from '../Home/CustomDropdown';
import './AMDrascssgStyles.scss';

import {strings as Language} from "../../loc/Strings";

import ReusableTooltip from '../../utils/ReusableTooltip';


const DragAndDrop = ({ selectedFile,IgnoreUptoMBValue,setSelectedFile,onChangeCommercialAttachmentUpdate,onChangeCommercialAttachment, isUpdate,lightdark, multiple,LabelValue }: any) => {
  const ref = useRef(null)
  const inputRef = useRef<any>(null)
  // const [index,setIndex]=useState<any>(null)

  const handleFileChange = (event: any) => {
    if (multiple) {
      for (let i = 0; i < event.target.files.length; i++) {
        setSelectedFile((prev: any) => [...prev, event.target.files[i]])
      }
    }
   else{
      setSelectedFile([event.target.files[0]])

    }
  };
  const handleDrag = () => {
    ref.current.classList.remove("b-w-img")
    ref.current.classList.remove("hidden")
    //ref.current.classList.add("drag_brdr_clr")
  }
  const handleDragLeave = () => {
    ref.current.classList.remove("drag_brdr_clr")
    ref.current.classList.add("b-w-img")


  }
  const handleClick = (() => {
    inputRef.current.click()
  })

  const handleCancel = ((index:any) => {
  
    let draggedItem = [...selectedFile]
    draggedItem.splice(index, 1)
    setSelectedFile(draggedItem)
  })
  // const sizeValidation=(ev)=>{
  //  if(Math?.floor(ev?.target?.files[0]?.size / 1024 / 1024) < parseInt(IgnoreUptoMBValue)){
  //   isUpdate ? onChangeCommercialAttachmentUpdate(ev) : onChangeCommercialAttachment(ev)
  //  }
  // }
  // const DragDropImage: any = require("../../../public/AttachmentAreaBGImage.png");
  
   /* tslint:disable no-var-requires */
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const DragDropImage: any = require("../../../../../assets/AttachmentImage.png");

  return (
    <> 
      <span className="file-input-label">
        {/* <Label>{strings.UploadCommercialDocument} </Label> */}
        <Label>{LabelValue ? LabelValue : 'Attachments'}</Label>

        <ReusableTooltip content={Language.AttachmentTitlle ? Language.AttachmentTitlle : "Click on the attachment icon to add multiple attachments"} lightdarkmode={lightdark} />

        <IconButton
          className=''
          iconProps={{ iconName: "Attach" }}
          onClick={handleClick}
        />
      </span>
      <div className="file-input-container">
        <input ref={inputRef}
          id="file-input"
          type="file"
          // accept=".jpg, .jpeg, .png, .pdf"
           onChange={onChangeCommercialAttachment}
         // onChange={(ev)=>{sizeValidation(ev)}}
          onDragOver={handleDrag}
          onDragLeave={handleDragLeave}
          className="file-input"
          multiple={multiple}
        />
        <label className={`file-input-wrapper hidden b-w-img `} ref={ref} htmlFor="file-input" >
          <div className="file-input-icon">
            <img className='drop-logo' src={DragDropImage} alt="" />
            <div className=''>
            
                <span className='drag_text'>
                  Drop your files here
                </span>
            </div>
          </div>
        </label>
      </div>
    
   {/* <div className='flex file_dropdown'>

      {selectedFile &&
        selectedFile.length > 0 &&
        selectedFile.map((e: any, i: number) => {
          return (
           <CustomDropdown data={e} handleCancel={handleCancel} index={i} lightdark={lightdark}/>
          )
        })
      }
   </div> */}

    </>
  );
};

export default DragAndDrop;
