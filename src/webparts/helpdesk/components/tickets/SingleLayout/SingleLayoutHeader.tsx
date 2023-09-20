import React, { useEffect, useState } from 'react'
import { useStore } from '../../../store/zustand';
const helpDeskLog = require('../../../../../../assets/help-desk.png');
const helpDeskLogDarkMode = require('../../../../../../assets/HD365-Icon-White-1200.png');
import { Icon } from '@fluentui/react/lib/Icon';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Checkbox, Dropdown, ICheckboxStyles, Modal } from '@fluentui/react';

let mandatoryFields = [];

const SingleLayoutHeader = ({ propsData }) => {
  const ThemesColor = useStore((state) => state.ThemesColor)
  const setExpandMode = useStore((state) => state.setExpandMode);
  const getSettingsCollection = useStore((state) => state.getSettingsCollection());
  console.log("SITE DATA", getSettingsCollection)
  console.log("theme", ThemesColor);

  // <----------------------- MODEL ON/OFF STATES --------------->
  const [openModel, setOpenModel] = useState<boolean>(false);

  // <----------------------- DRAGGBLE STATES --------------->

  const [draggedOrderData, setDraggedOrderData] = useState<any[]>();
  useEffect(() => {
    if (getSettingsCollection) {
      mandatoryFields = []; // SET TO EMPTY.
      // const DraggableTemplate = {
      //   Teams: getSettingsCollection?.TeamDisplayName,
      //   Service: getSettingsCollection?.ServiceName,
      //   'Sub Service': getSettingsCollection?.SubServiceName,
      //   Priority: 'Priority',
      //   'Request Type': 'Request Type',
      //   Desc: 'Description',
      //   Title: getSettingsCollection?.TicketTitleName
      // }
      const DraggableTemplate = [
        { id: 0, Name: getSettingsCollection?.TeamDisplayName ,isChecked:true},
        { id: 1, Name: getSettingsCollection?.ServiceName,isChecked:false },
        { id: 2, Name: getSettingsCollection?.SubServiceName,isChecked:false },
        { id: 3, Name: 'Priority' ,isChecked:false},
        { id: 4, Name: 'Request Type' ,isChecked:false},
        { id: 5, Name: 'Description',isChecked:true },
        { id: 6, Name: getSettingsCollection?.TicketTitleName,isChecked:true }
      ]
      // mandatoryFields.push(getSettingsCollection?.TeamDisplayName)
      // mandatoryFields.push(getSettingsCollection?.TicketTitleName);
      // mandatoryFields.push('Description');
      setDraggedOrderData(DraggableTemplate);
      console.log("DraggableTemplate", DraggableTemplate);
    }
  }, [getSettingsCollection])

  // <------------------ EXPAND SCREEN ON CHANGE -------------------->
  const handleExpandScreen = () => {
    console.log("clicked")
    setExpandMode(true);
  }

  // <------------------- DRAG & DROP ON CHANGE HANDLER ------------------>
  const handleDragEnd = (e) => {
    console.log("drag end event", e);
    const { destination, source, type } = e;
    // if null return early
    if (!destination) return;
    // if source & destination same return early.
    if (source?.droppableId === destination?.droppableId && source?.index === destination?.index) return;
    // based on type & it's can be multiple so...
    if (type === "group") {
      if (draggedOrderData && draggedOrderData?.length > 0) {
        const ReOrderingData = [...draggedOrderData];
        const sourceIndex = source?.index;
        const destinationIndex = destination?.index;

        const [removedItem] = ReOrderingData?.splice(sourceIndex, 1);
        ReOrderingData?.splice(destinationIndex, 0, removedItem); // remove zero and added to particular index.

        // return Modified Data;
        return setDraggedOrderData(ReOrderingData);
      }
    }
  }

  //
  const onChangeCheckbox = (ev: React.FormEvent<HTMLInputElement>, isChecked: boolean) => {

    console.log("Checkbox =>", ev, "isChecked => ", isChecked)
  }

  //
  const onSubmit = () => {

  }
  // 
  const checkboxStyle: ICheckboxStyles = {
    text: {
      fontWeight: 600,
    },
    checkmark: {
      color: ThemesColor == 'light' ? 'var(--lightdarkColor)' : 'var(--lightdarkBGGray)',
      backgroundColor: '#fff',
      padding: '3px',
      width: '20px',
    },
    checkbox: {
      color: 'var(--lightdarkBGGray)',
      border: '1px solid #333 !important'
    },
    root: {
      "&:hover": {
        ".ms-Checkbox-checkbox": {
          color: 'var(--lightdarkBGGray)',
          backgroundColor: '#fff',
        }
      }
    }
  };
  console.log("draggedOrderData =>", draggedOrderData);
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

      {openModel &&
        <div className='draggable-model-root'>
          <Modal
            isOpen={openModel}
            onDismiss={() => setOpenModel(false)}
            isBlocking={true}
            styles={{
              main: {
                padding: "27px",
                minWidth: "600px",
                height: "500px"

              }
            }}
          >
            <div className='draggble-container'>
              {/* DRAGGABLE CONTENT */}
              <DragDropContext onDragEnd={handleDragEnd}>
                {/* HI from another side. */}
                <Droppable droppableId={"ROOT"} type={"group"}>
                  {
                    (provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        {draggedOrderData && draggedOrderData?.length > 0 && draggedOrderData?.map((item, index) =>
                          <Draggable draggableId={item?.id + ""} key={item?.id} index={index}>
                            {(provided) => (
                              <div
                                {...provided.dragHandleProps}
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                                className='draggble-content-root'
                              >
                                <div>
                                  <Icon iconName="GripperDotsVertical"></Icon>
                                </div>
                                <div>
                                  <Checkbox
                                    styles={checkboxStyle}
                                    checked={
                                      item?.isChecked
                                      // mandatoryFields?.some((items) => items === item?.Name)
                                    }
                                    title={item?.Name}
                                    id={item?.id + ""}
                                    onChange={onChangeCheckbox}
                                  />
                                </div>
                                <div>
                                  {item?.Name}
                                </div>

                              </div>
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
              <div className='draggable-default-content'>
                {/* <Label required>{"Teams"}</Label> */}
                <Dropdown
                  label={"Teams"}
                  options={propsData?.teamsoptionarray}
                  onChange={propsData?.handleTeamsOnChange}
                  placeholder="Select teams"
                  selectedKey={propsData?.defltTeam}
                />
                {/* Service ui */}
                <Dropdown
                  label={"Service"}

                  options={propsData?.serviceOption}
                  onChange={propsData?.handleServiceOnChange}
                  placeholder="Select services"
                  selectedKey={propsData?.defltService}
                />
                {/* Sub Service ui */}
                <Dropdown
                  label={"Sub Service"}

                  options={propsData?.subserviceOption}
                  onChange={propsData?.handleSubServiceOnChange}
                  placeholder="Select sub services"
                  selectedKey={propsData?.defltSubService}
                />
                {/* Priority */}
                <Dropdown
                  label={"Priority"}

                  options={propsData?.priorityoptions}
                  onChange={propsData?.handlePriorityOnChange}
                  placeholder="Select priority"
                  // defaultSelectedKey={propsData?.defltPriority}
                  selectedKey={propsData?.defltPriority}
                />

                {/* Request Type */}
                <Dropdown
                  label={"Request Type"}

                  options={propsData?.requestoptions}
                  onChange={propsData?.handleRequestTypeOnChange}
                  placeholder="Select request type"
                  selectedKey={propsData?.defltReq}
                />
              </div>
            </div>
            {/* Submit & Cancel Button */}
            <div style={{ gap: "20px" }} className='add-new-installation-common-style-btn-input'>
              <button className='add-new-installation-submit-btn' onClick={onSubmit}>Save</button>
              <button style={{ background: "gray" }} className='add-new-installation-submit-btn' onClick={onSubmit}>Cancel</button>
            </div>
          </Modal>
        </div>
      }


    </>
  )
}

export default SingleLayoutHeader




