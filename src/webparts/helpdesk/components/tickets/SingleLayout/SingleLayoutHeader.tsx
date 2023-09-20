import React, { useEffect, useState } from 'react'
import { useStore } from '../../../store/zustand';
const helpDeskLog = require('../../../../../../assets/help-desk.png');
const helpDeskLogDarkMode = require('../../../../../../assets/HD365-Icon-White-1200.png');
import { IIconProps, Icon } from '@fluentui/react/lib/Icon';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Checkbox, Dropdown, IButtonStyles, ICheckboxStyles, IconButton, Modal } from '@fluentui/react';
import { useRequestPost } from '../../../store/apis_add-new-tickts/add-new-api-post';
import { useAddNewApiStore } from '../../../store/apis_add-new-tickts/add-new-apis';

let mandatoryFields = [];

const SingleLayoutHeader = ({ propsData }) => {
  const ThemesColor = useStore((state) => state.ThemesColor)
  const setExpandMode = useStore((state) => state.setExpandMode);
  const getSettingsCollection = useStore((state) => state.getSettingsCollection());
  console.log("SITE DATA", getSettingsCollection)
  console.log("theme", ThemesColor);
  const setRequestFieldsCheckbox = useRequestPost((state)=>state.setRequestFieldsCheckbox);
  const setDefaultRequestSettings = useRequestPost((state)=>state.setDefaultRequestSettings);
  const fetchRequestFieldsCheckbox = useAddNewApiStore((state)=>state.fetchRequestFieldsCheckbox);
  const getRequestFieldsCheckbox = useAddNewApiStore((state)=>state.getRequestFieldsCheckbox());
  // <----------------------- MODEL ON/OFF STATES --------------->
  const [openModel, setOpenModel] = useState<boolean>(false);

  // <----------------------- DRAGGBLE STATES --------------->

  const [draggedOrderData, setDraggedOrderData] = useState<any[]>();
  useEffect(() => {
    if (getSettingsCollection) {
      mandatoryFields = []; // SET TO EMPTY.

      const DraggableTemplate = [
        { id: 0, Name: getSettingsCollection?.TeamDisplayName, isChecked: true },
        { id: 1, Name: getSettingsCollection?.ServiceName, isChecked: false },
        { id: 2, Name: getSettingsCollection?.SubServiceName, isChecked: false },
        { id: 3, Name: 'Priority', isChecked: false },
        { id: 4, Name: 'Request Type', isChecked: false },
        { id: 5, Name: 'Description', isChecked: true },
        { id: 6, Name: getSettingsCollection?.TicketTitleName, isChecked: true }
      ]
      mandatoryFields.push(getSettingsCollection?.TeamDisplayName)
      mandatoryFields.push(getSettingsCollection?.TicketTitleName);
      mandatoryFields.push('Description');
      setDraggedOrderData(DraggableTemplate);
      console.log("DraggableTemplate", DraggableTemplate);
    }
  }, [getSettingsCollection])

  // <----------------------- FETCH CHECKBOX FIELDS DATA --------------->

  useEffect(() => {
    const fetchRequestFieldsCheckboxData = async()=>{
      await fetchRequestFieldsCheckbox();
    }
    fetchRequestFieldsCheckboxData();

  }, []);

  useEffect(()=>{
    if(getRequestFieldsCheckbox && getRequestFieldsCheckbox?.length>0){
      const checkboxFields = getRequestFieldsCheckbox[0]?.RequestTicketsCheckedFields
      const data:any[] =  JSON.parse(checkboxFields);
      if(data && data?.length>0){
        console.log("data checkbox get",data);
        setDraggedOrderData(data);
      }
    }
  },[])
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

    console.log("Checkbox =>", ev, "isChecked => ", isChecked);
    if (isChecked) {
      console.log(ev);
      console.log(ev.target['title']);
      if (draggedOrderData && draggedOrderData?.length > 0) {
        let data = [...draggedOrderData];
        console.log("data", data);
        // const itemToModify = data?.find((item) => item?.Name?.includes(ev?.target['title']));
        data?.forEach((item) => {
          if (item?.Name === ev?.target['title']) {
            console.log(item);
            item.isChecked = true;
          }
        });
        console.log("data after modify", data);
        setDraggedOrderData(data);
      }
    } else {
      console.log(ev);
      if (!mandatoryFields?.includes(ev?.target['title'])) {
        if (draggedOrderData && draggedOrderData?.length > 0) {
          let data = [...draggedOrderData];
          data?.forEach((item) => {
            if (item?.Name?.includes(ev?.target['title'])) {
              console.log(item);
              item.isChecked = false;
            }
          });
          console.log("data after modify", data);
          setDraggedOrderData(data);
        }

      }
    }
  }

  //
  const onSubmit = (e) => {
   console.log("e checkbox submit",e);
   console.log("onSubmit",draggedOrderData);
   if(draggedOrderData && draggedOrderData?.length>0){
    // FILTERING MANDATORY FIELDS.
    //  const filteredData = draggedOrderData?.filter((item)=> {
    //   const isPresent = mandatoryFields?.some((items)=>items === item?.Name);
    //     return !isPresent;
    //  });
    //  console.log("filteredData",filteredData);

     // MERGE & POST 
    //  if(filteredData && filteredData?.length>0){
       setRequestFieldsCheckbox(draggedOrderData);
    //  }

   }
  }

// 
  const onDefaultSubmit = (e) => {

    console.log("propsData", propsData);
    const { defltTeam, defltService, defltSubService, defltReq, defltPriority } = propsData;
    if (defltTeam && defltService && defltSubService && defltReq && defltPriority) {
      const defaultData = {
        Teams: defltTeam,
        Service: defltService,
        'Sub Service': defltSubService,
        'Request Type': defltReq,
        Priority: defltPriority
      }
      console.log("defaultData", defaultData);
      if (defaultData) {
        setDefaultRequestSettings(defaultData);
      }
    }
  }

  //
  const cancelIcon: IIconProps = { iconName: 'Cancel' };
  const iconButtonStyles: Partial<IButtonStyles> = {
    root: {
      // color: theme.palette.neutralPrimary,
      marginLeft: 'auto',
      marginTop: '4px',
      marginRight: '2px',
    },
    rootHovered: {
      // color: theme.palette.neutralDark,
    },
  };
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
                minWidth: "600px",
                height: "500px"

              }
            }}
          >
            <IconButton
              styles={iconButtonStyles}
              className='draggable-model-close-btn'
              iconProps={cancelIcon}
              ariaLabel="Close popup modal"
              onClick={() => setOpenModel(false)}
            />
            <div className='draggble-container'>
              {/* DRAGGABLE CONTENT */}
              <div className='draggable-one'>
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
              </div>
              {/* DEFAULT CONTNET */}
              <div className='draggable-two draggable-default-content'>
                {/* <Label required>{"Teams"}</Label> */}
                <div onClick={onDefaultSubmit} style={{ textAlign: "end" }}> <Icon className='add-new-ticket-pointer' iconName="Save" /></div>
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
            <div style={{ gap: "20px", marginTop: "30px" }} className='add-new-installation-common-style-btn-input'>
              <button className='add-new-installation-submit-btn' onClick={onSubmit}>Save</button>
              <button style={{ background: "#fff", color: "#333", border: "1px solid gray" }} className='add-new-installation-submit-btn' onClick={() => setOpenModel(false)}>Cancel</button>
            </div>
          </Modal>
        </div>
      }


    </>
  )
}

export default SingleLayoutHeader




