import React, { useState } from 'react'
import { useStore } from '../../../store/zustand';
const helpDeskLog = require('../../../../../../assets/help-desk.png');
const helpDeskLogDarkMode = require('../../../../../../assets/HD365-Icon-White-1200.png');
import { Icon } from '@fluentui/react/lib/Icon';
import ReusableDialogModal from '../../../utils/CustomModels/ReusableDialogModal';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

// Items Data
const ItemsArr = [
  { id: 0, Name: "Teams" },
  { id: 1, Name: "Service" },
  { id: 2, Name: "Sub Service" },
  { id: 3, Name: "Priority" },
  { id: 4, Name: "Request Type" }
]

const SingleLayoutHeader = () => {
  const ThemesColor = useStore((state) => state.ThemesColor)
  const setExpandMode = useStore((state) => state.setExpandMode);
  console.log("theme", ThemesColor);

  // <----------------------- MODEL ON/OFF STATES --------------->
  const [openModel, setOpenModel] = useState<boolean>(true);

  //
  const [draggedOrderData,setDraggedOrderData] = useState<any[]>(ItemsArr);

  // <------------------ EXPAND SCREEN ON CHANGE -------------------->
  const handleExpandScreen = () => {
    console.log("clicked")
    setExpandMode(true);
  }

  const handleDragEnd = (e) => {
    console.log("drag end event", e);
    const {destination, source,type } = e;
    // if null return early
    if(!destination) return;
    // if source & destination same return early.
    if(source?.droppableId === destination?.droppableId && source?.index === destination?.index) return;
    // based on type & it's can be multiple so...
    if(type==="group"){
      if(draggedOrderData && draggedOrderData?.length>0){
        const ReOrderingData = [...draggedOrderData];
        const sourceIndex = source?.index;
        const destinationIndex = destination?.index;

        const [removedItem] = ReOrderingData?.splice(sourceIndex,1);
        ReOrderingData?.splice(destinationIndex,0,removedItem); // remove zero and added to particular index.

        // return Modified Data;
        return setDraggedOrderData(ReOrderingData);
      }
    }
  }
  console.log("draggedOrderData =>",draggedOrderData);
  return (
    <>
      <div className='add-new-ticket-header-style header-single-layout-add-new-ticket'>
        <img className='add-new-ticket-header-style-img' src={ThemesColor === "light" ? helpDeskLog : helpDeskLogDarkMode} alt='helpdesk' />
        <span className='helpdesk-name-style logo-name-helpdesk'>HelpDesk 365</span>


        <span className='add-new-ticket-title-single-layout'>Raise New Request</span>
        <span className='single-layout-add-new-icon-style-header'>
          <Icon className='send-on-submit-add-new-icon add-new-ticket-pointer' iconName="Settings"
            onClick={() => setOpenModel(true)}
          />
          <Icon className='send-on-submit-add-new-iconExpandRemove add-new-ticket-pointer' iconName="FullScreen" onClick={handleExpandScreen} />
          <Icon className='send-on-submit-add-new-icon add-new-ticket-pointer' iconName="Send" />

        </span>
      </div>

      {openModel && <ReusableDialogModal
        title="Skip"
        isOpened={openModel}
        onClose={() => setOpenModel(false)}
        modelStyle='modal-style-add-new-webpart'
      >
        {/* DRAGGABLE CONTENT */}
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* HI from another side. */}
          <Droppable droppableId={"ROOT"} type={"group"}>
            {
              (provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {draggedOrderData && draggedOrderData?.length>0 && draggedOrderData?.map((item, index) =>
                    <Draggable draggableId={item?.id+""} key={item?.id} index={index}>
                      {(provided) => (
                        <div
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                           <Icon iconName="GripperDotsVertical"></Icon> {item?.Name}</div>
                      )}
                    </Draggable>

                  )}
                  {provided?.placeholder}
                </div>
              )
            }
          </Droppable>
        </DragDropContext>

        {/* DEFAULT CONTNET */}
        
      </ReusableDialogModal>}
    </>
  )
}

export default SingleLayoutHeader




