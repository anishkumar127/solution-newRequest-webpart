import React, { useEffect, useState } from 'react'
import { useStore } from '../../../store/zustand';
const helpDeskLog = require('../../../../../../assets/help-desk.png');
const helpDeskLogDarkMode = require('../../../../../../assets/HD365-Icon-White-1200.png');
import { IIconProps, Icon } from '@fluentui/react/lib/Icon';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Checkbox, Dropdown, IButtonStyles, ICheckboxStyles, IconButton, Modal } from '@fluentui/react';
import { useRequestPost } from '../../../store/apis_add-new-tickts/add-new-api-post';
import { useAddNewApiStore } from '../../../store/apis_add-new-tickts/add-new-apis';
import ReusableSweetAlerts from '../../../utils/SweetAlerts/ReusableSweetAlerts';

let mandatoryFields = [];

const SingleLayoutHeader = ({ propsData }) => {
  const ThemesColor = useStore((state) => state.ThemesColor)
  const setExpandMode = useStore((state) => state.setExpandMode);
  const getSettingsCollection = useStore((state) => state.getSettingsCollection());
  console.log("SITE DATA", getSettingsCollection)
  console.log("theme", ThemesColor);
  const setRequestFieldsCheckbox = useRequestPost((state) => state.setRequestFieldsCheckbox);
  const setDefaultRequestSettings = useRequestPost((state) => state.setDefaultRequestSettings);
  const fetchRequestFieldsCheckbox = useAddNewApiStore((state) => state.fetchRequestFieldsCheckbox);
  const getRequestFieldsCheckbox = useAddNewApiStore((state) => state.getRequestFieldsCheckbox());
  // <----------------------- MODEL ON/OFF STATES --------------->
  const [openModel, setOpenModel] = useState<boolean>(false);

  // <----------------------- DRAGGBLE STATES --------------->

  const [draggedOrderData, setDraggedOrderData] = useState<any[]>();

  // <----------------------- UPDATE SWEET ALERT STATES --------------->
  const [configureRequestUpdate, setConfigureRequestUpdate] = useState<boolean>(false);
  const [maxSelect, setMaxSelect] = useState<boolean>(false);
  const [selectDefaultValue, setSelectDefaultValue] = useState<boolean>(false);

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
    const fetchRequestFieldsCheckboxData = async () => {
      await fetchRequestFieldsCheckbox();
    }
    fetchRequestFieldsCheckboxData();

  }, [openModel]);

  useEffect(() => {
    if (getRequestFieldsCheckbox && getRequestFieldsCheckbox?.length > 0) {
      const checkboxFields = getRequestFieldsCheckbox[0]?.RequestTicketsCheckedFields
      const data: any[] = JSON.parse(checkboxFields);
      if (data && data?.length > 0) {
        console.log("data checkbox get", data);
        setDraggedOrderData(data);
      }
    }
  }, [getRequestFieldsCheckbox[0]?.RequestTicketsCheckedFields, openModel])
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

  // <---------------------------------- CHECKBOX ON CHANGE HANDLER ---------------------------->

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

  // <----------------------------------   SUBMIT CHECKBOX SETTINGS ---------------------------->

  const onSubmit = (e) => {
    if (draggedOrderData && draggedOrderData?.length > 0) {
      // COUNT CHECK CHECKED 
      const checkedCount = draggedOrderData?.reduce((curr, item) => {
        return item?.isChecked === true ? curr + 1 : curr;
      }, 0);
      console.log('checkedCount', checkedCount);
      console.log("%c submitData", 'color:purple', draggedOrderData);

      // FILTER NOT SELECTED ITEM & MAKE IT DEFAULT SELECT VALUE;
      const notSelected = draggedOrderData?.filter((item) => !item.isChecked)
      console.log("notSelected", notSelected);

      if (checkedCount == 5) {
        onDefaultSubmit(draggedOrderData, notSelected);
        setConfigureRequestUpdate(true);
        setTimeout(() => {
          setConfigureRequestUpdate(false);
        }, 2000);
      } else {
        setMaxSelect(true);
        setTimeout(() => {
          setMaxSelect(false);
        }, 2000);
        console.log("you only able to select 5 items.")
      }
    }
  }

  // <----------------------------------   SUBMIT DEFAULT SETTINGS ---------------------------->
  const onDefaultSubmit = async (draggedOrderData, notSelected) => {
    console.log("propsData", propsData);
    const { defltTeam, defltService, defltSubService, defltReq, defltPriority } = propsData;
    // if (defltTeam && defltService && defltSubService && defltReq && defltPriority) 
    const defaultData = {
      Teams: defltTeam,
      Services: defltService,
      'Sub Services': defltSubService,
      'Request Type': defltReq,
      Priority: defltPriority
    }

    // const isValue = !notSelected.some((item) => {
    //   const defaultItem = defaultData[item?.Name];
    //   return defaultItem === undefined || defaultItem === null;
    // });
    // if (!isValue) {
    //   setSelectDefaultValue(true);
    //   setTimeout(() => {
    //     setSelectDefaultValue(false);
    //   }, 2000);
    // } else {
      try {
        await setRequestFieldsCheckbox(draggedOrderData); // POSTING Checkbox Data.
        await new Promise((resolve) => setTimeout(resolve, 2000)); // wait few mintues avoid 409 error.
        await setDefaultRequestSettings(defaultData); // POSTING Default Data.
        setOpenModel(false);
      } catch (error) {
        console.error("api post calls error", error);
      }
    // }
  }

  // <----------------------------------   SUBMIT TICKETS  ---------------------------->
  // const SubmitTicket = () => {
  //   let AlldesccolumnsValues = []
  //   let autoAssignEmailId = null;
  //   let requester = " ";
  //   let requesterDisplayName = "";
  //   let internalexternal = "";
  //   if (requestername.length > 0) {
  //     requester = requestername[0].id;
  //     requesterDisplayName = requestername[0].name;
  //   } else {
  //     requester = null;
  //     // requesterDisplayName = "";
  //   }
  //   TicketPropertiesValue.push({
  //     TicketOpenDate: "",
  //     InternalExtrenal: "Internal",
  //     CCMail: ccemailid,
  //     Read: "Unread",
  //     DepartmentCode: teamname,
  //     SubTickets: "",
  //     LastSubTicketCharacter: "",
  //     MediaSource: mediaChoosed,
  //     CustomFormID: isStringValidated(CustomFormID) ? CustomFormID : '',
  //     PushNotification: 'Active',
  //     TicketDescription: "Inside"
  //   });

  //   //for SLAResponse:
  //   SLAResponseInfo.push({
  //     SLAResponseBreach: "No",
  //     SLAResponseBreachOn: '',
  //     SLAResponseReplyTime: '',
  //     SLAResponseReplyDate: '',
  //     SLAResponseReplyDay: '', //(ex:Monday...)
  //     SLAResponseEscalateTime: '', //from Define SLAsettings
  //     SLAResponseAlertTime: '',
  //     SLAResponseNotifyType: '',
  //     SLAResponseAlertTo: '',
  //     SLAResponseMailSub: '', //from email notification subject
  //     SLAResponseMailBody: '',
  //   })
  //   //for SLAResponse:
  //   SLAResolveInfo.push({
  //     SLAResolveBreach: "No",
  //     SLAResolveBreachOn: '',
  //     SLAResolveReplyTime: '',
  //     SLAResolveReplyDate: '',
  //     SLAResolveReplyDay: '', //(ex:Monday...)
  //     SLAResolveEscalateTime: '', //from Define SLAsettings
  //     SLAResolveAlertTime: '',
  //     SLAResolveNotifyType: '',
  //     SLAResolveAlertTo: '',
  //     SLAResolveMailSub: '', //from email notification subject
  //     SLAResolveMailBody: '',
  //   })



  //   let flag = false;
  //   let flag1 = false;
  //   let flag2 = false;
  //   let flag3 = false;
  //   let flag4 = false;
  //   let flag5 = false;
  //   let flag6 = false;
  //   let flag7 = false;
  //   if (
  //     (Titlename == null ||
  //       Titlename == "" ||
  //       Titlename == undefined ||
  //       Titlename.trim() == null ||
  //       Titlename.trim() == "" ||
  //       Titlename.trim() == undefined) && MandatoryFields.includes("Title")
  //   ) {
  //     setNewerror2(true);
  //     settitlename("");
     
  //     setTimeout(() => {
  //       messageDismiss();
  //     }, 2000);
  //     flag = true;
  //   }
  //   if (requestname == null || requestname == "" || requestname == undefined) {
  //     setNewerror3(true);
  //     setTimeout(() => {
  //       messageDismiss();
  //     }, 2000);
  //     flag1 = true;
  //   }
  //   if (
  //     (priorityName == null ||
  //       priorityName == "" ||
  //       priorityName == undefined) && MandatoryFields.includes("Priority")
  //   ) {
  //     setNewerror4(true);
  //     setTimeout(() => {
  //       messageDismiss();
  //     }, 2000);
  //     flag2 = true;
  //   }
  //   if (
  //     (servicename == null ||
  //       servicename == "" ||
  //       servicename == undefined) && MandatoryFields.includes("Services")
  //   ) {
  //     setNewerrorService(true);
  //     setTimeout(() => {
  //       messageDismiss();
  //     }, 2000);
  //     flag6 = true;
  //   }
  //   if (
  //     (subservicename == null ||
  //       subservicename == "" ||
  //       subservicename == undefined) && MandatoryFields.includes("Sub Services")
  //   ) {
  //     setNewerrorSubService(true);
  //     setTimeout(() => {
  //       messageDismiss();
  //     }, 2000);
  //     flag6 = true;
  //   }
  //   if (requester == null || requester == "" || requester == undefined) {
  //     setNewerror5(true);
  //     setTimeout(() => {
  //       messageDismiss();
  //     }, 2000);
  //     flag3 = true;
  //   }
  //   if (
  //     (globalMessage == null ||
  //       globalMessage == "" ||
  //       globalMessage == undefined) && MandatoryFields.includes("Ticket Description")
  //   ) {
  //     setNewerror6(true);
  //     setTimeout(() => {
  //       messageDismiss();
  //     }, 2000);
  //     flag4 = true;

  //   }
  //   if (
  //     (team == null ||
  //       team == "" ||
  //       team == undefined) && MandatoryFields.includes("Teams")
  //   ) {
  //     setNewerror7(true);
  //     setTimeout(() => {
  //       messageDismiss();
  //     }, 2000);
  //     flag5 = true;
  //   }

  //   if (AutoAssignTicket !== "Off") {
  //     if (AutoAssignTicketMethod == "RoundRobin") {
  //       RoundRobin();
  //     } else if (AutoAssignTicketMethod == "WeightedRoundRobin") {
  //       weightRound();
  //     }

  //     var filtered = userList.filter((item) => {
  //       return (item.UsersId == lastAssignid);
  //     });
  //     filtered.map((i) => {
  //       autoAssignEmailId = i.Email;
  //     });
  //   }
  //   let FilterWorkFlowFilterData;
  //   if (WorkFlowData != null && WorkFlowData.length > 0 && WorkFlowData != undefined) {
  //     // let withoutsubserviceWorkflow = WorkFlowData.filter(x => !isStringValidated(x.SubServiceName))      
  //     FilterWorkFlowFilterData = WorkFlowData.findIndex((i) => {
  //       if (!isStringValidated(i.SubServiceName)) {

  //         return (i.DepartmentName?.includes(team) && i.ServiceName?.split(',')?.includes(servicename))
  //       }
  //     })
  //     if (subservicename != null && subservicename != '' && subservicename != undefined) {
  //       let subserviceWorkflow = WorkFlowData.filter(x => isStringValidated(x.SubServiceName))


  //       let index = subserviceWorkflow.findIndex((i) => {
  //         if (isStringValidated(i.SubServiceName)) {
  //           return i.DepartmentName?.includes(team) && i.ServiceName?.split(',')?.includes(servicename) &&
  //             i.SubServiceNames?.startsWith(',') ? i.SubServiceName?.slice(1)?.split(',')?.includes(subservicename) :
  //             i.SubServiceName?.split(',')?.includes(subservicename)
  //         }
  //       })
  //       if (index > -1) {
  //         FilterWorkFlowFilterData = index

  //       }



  //     }
  //   }

  //   groups.forEach((e) => {
  //     if (e.name === "HDM365Admin" || e.name === "HDM365PowerUser" || e.name === "HDM365" + teamname) {
  //       allid.push(e.id)
  //     }
  //   })
  //   allid.push(requester)
  //   let finalTemplate;
  //   if (AutoAssignTicket == "Off" || FilterWorkFlowFilterData > -1) {
  //     finalTemplate = {
  //       Title:
  //         Titlename == "" || Titlename == null || Titlename == undefined
  //           ? Titlename
  //           : Titlename.trim(),
  //       DepartmentName: team,
  //       Services: servicename,
  //       SubServices: subservicename,
  //       SubServicesL2: level2SubServicedefault,
  //       SubServicesL3: level3Subservicedefault,
  //       Priority: priorityName,
  //       RequestType: requestname,
  //       RequesterId: requester,
  //       TicketDescription: globalMessage,
  //       TicketDescInTextformat: globalMessage.replace(/<[^>]*>/g, ''),
  //       //DepartmentCode: teamname,
  //       TicketProperties: JSON.stringify(TicketPropertiesValue),
  //       RequesterEmail: requesterEmailId,
  //       RequesterName: requesterDisplayName,
  //       TicketCreatedDate: new (Date),
  //       SLAResponseDone: "No",
  //       SLAResolveDone: "No",
  //       SLAResponseInfo: JSON.stringify(SLAResponseInfo),
  //       SLAResolveInfo: JSON.stringify(SLAResolveInfo),
  //       ...CustomDateData,
  //       ReadStatus: '',
  //       // ItemPermissionId:allid
  //     };
  //   } else {
  //     finalTemplate = {
  //       Title:
  //         Titlename == "" || Titlename == null || Titlename == undefined
  //           ? Titlename
  //           : Titlename.trim(),
  //       DepartmentName: team,
  //       Services: servicename,
  //       SubServices: subservicename,
  //       Priority: priorityName,
  //       RequestType: requestname,
  //       RequesterId: requester,
  //       SubServicesL2: level2SubServicedefault,
  //       SubServicesL3: level3Subservicedefault,
  //       TicketDescription: globalMessage,
  //       TicketDescInTextformat: globalMessage.replace(/<[^>]*>/g, ''),
  //       //DepartmentCode: teamname,
  //       TicketProperties: JSON.stringify(TicketPropertiesValue),
  //       AssignedToId: lastAssignid.length == 0 ? null : lastAssignid,
  //       // assignedT0:
  //       // finalTemplate.AssignedTo == null ? null : finalTemplate.AssignedTo.Title,
  //       RequesterEmail: requesterEmailId,
  //       RequesterName: requesterDisplayName,
  //       AssignedTomail: autoAssignEmailId,
  //       TicketCreatedDate: new (Date),
  //       SLAResponseDone: "No",
  //       SLAResolveDone: "No",
  //       SLAResponseInfo: JSON.stringify(SLAResponseInfo),
  //       SLAResolveInfo: JSON.stringify(SLAResolveInfo),
  //       ...CustomDateData,
  //       ReadStatus: '',
  //       // ItemPermissionId:allid
  //     };
  //   }

  //   if (dataText != null) {
  //     var key;
  //     for (let value of Object.entries(dataText)) {
  //       // finalTemplate[value[0].replace(' ','_x0020_')] = value[1];
  //       finalTemplate[value[0]] = value[1];
  //     }

  //   }
  //   if (dataNote != null) {
  //     var key;
  //     for (let value of Object.entries(dataNote)) {
  //       finalTemplate[value[0]] = value[1];
  //     }
  //   }
  //   if (dataNumber != null) {
  //     var key;
  //     for (let value of Object.entries(dataNumber)) {
  //       finalTemplate[value[0]] = value[1];
  //     }
  //   }


  //   if (dataChoice2 != null) {
  //     var key;
  //     for (let value of Object.entries(dataChoice2)) {
  //       finalTemplate[value[0]] = value[1];
  //     }
  //   }
  //   if (dataChoiceforsub != null) {
  //     var key;
  //     for (let value of Object.entries(dataChoiceforsub)) {
  //       finalTemplate[value[0]] = value[1];
  //     }
  //   }
  
  //   var Errmessage = "";


  //   ColumnProperties.map((item) => {
  //     const ExistingMainColumn = ticketOrder.filter((elem) => {
  //       return item[0].InternalName == elem.InternalName;
  //     });
  //     if (LicenseType.toLowerCase() == "p4" || LicenseType.toLowerCase() == "trial") {
  //       if (!isStringValidated(finalTemplate[item[0].InternalName]) && ((ExistingMainColumn.length > 0 && MandatoryFields.includes(item[0].InternalName)))) {
  //         Errmessage = "Please fill the " + item[0].DisplayName;
  //         RequiredColumnName = item[0].DisplayName;
  //       }
  //     }
  //   })

  //   for (let i = 0; i < allTicketDescriptionColumns.length; i++) {
  //     if (isStringValidated(finalTemplate[allTicketDescriptionColumns[i]['Title']])) {
  //       if (allTicketDescriptionColumns[i].Type1 == "DateTime") {
  //         AlldesccolumnsValues.push(`<p id=${allTicketDescriptionColumns[i]['Title']}><b>${allTicketDescriptionColumns[i]['ColumnName']}</b>: ${moment(finalTemplate[allTicketDescriptionColumns[i]['Title']]).format(dateFormart)}</p>`)
  //       }
  //       else if (allTicketDescriptionColumns[i].Type1 == "User") {
  //         let UserCulmData = isStringValidated(finalTemplate[allTicketDescriptionColumns[i]['Title']]) ? JSON.parse(finalTemplate[allTicketDescriptionColumns[i]['Title']]) : "";
  //         AlldesccolumnsValues.push(`<p id=${allTicketDescriptionColumns[i]['Title']}><b>${allTicketDescriptionColumns[i]['ColumnName']}</b>: ${UserCulmData[0].Name}</p>`)
  //       }
  //       else {

  //         AlldesccolumnsValues.push(`<p id=${allTicketDescriptionColumns[i]['Title']}><b>${allTicketDescriptionColumns[i]['ColumnName']}</b>: ${finalTemplate[allTicketDescriptionColumns[i]['Title']]}</p>`)
  //       }
  //     }
  //   }

  //   if (AlldesccolumnsValues.length) {
  //     finalTemplate.TicketDescription = finalTemplate.TicketDescription + AlldesccolumnsValues.join('')
  //   }
  //   if (!flag && !flag1 && !flag2 && !flag3 && !flag4 && !flag5 && !flag6 && !flag7 && Errmessage == "") {
  //     setLoading(true);
  //     setButtonSaveText("");
  //     var updateurl =
  //       getIsInstalled?.SiteUrl +
  //       "/_api/web/lists/getbytitle('HR365HDMTickets')/items";
  //     ContextService.GetSPContext()
  //       .post(
  //         updateurl,
  //         SPHttpClient.configurations.v1,
  //         {
  //           headers: {
  //             Accept: "application/json;odata=nometadata",
  //             "Content-type": "application/json;odata=nometadata",
  //             "odata-version": "",
  //           },
  //           body: JSON.stringify(finalTemplate),
  //         }
  //       )
  //       .then((response: SPHttpClientResponse) => {
  //         return response.json();
  //       })
  //       .then((item: any) => {
  //         // GETPriorityDropDown();
  //         setGlobalMessage("");
  //         ReactQuilRenderer((prev) => prev + "1");

  //         if (item['odata.error']) {
  //           if ((JSON.stringify(item['odata.error'])).includes("Access is denied")) {
  //             showDialogAccessDenied();
  //           };
  //           setTimeout(() => {
  //             setLoading(false);
  //             messageDismiss();
  //             setButtonSaveText(Language.Submit ? Language.Submit : "Submit");

  //           }, 2000);

  //         } else {
  //           if (attachFile2 || attachFile2 !== undefined) {
  //             saveFile(item.Id);
  //           }
  //           setatt = [];
  //           setatt1 = [];
  //           setattachFile1([]);
  //           setattachFile2([]);
  //           setTicketId(item.Id);
  //           WorkFlowFilterData(item.DepartmentName, item.Services, item.SubServices);
  //           UpdateTicketsProperties = isStringValidated(item.TicketProperties) ? JSON.parse(item.TicketProperties) : [];
  //           setTicketPropJOSNUpdate(UpdateTicketsProperties);

  //           rowId = item.Id;

  //           window.scrollTo(0, 0);
  //           setSaved(true);
  //           setTimeout(() => {
  //             setLoading(false);
  //             setButtonSaveText(Language.Submit ? Language.Submit : "Submit");
  //             // saveTicketId();
  //             messageDismiss();
  //           }, 1000);
  //           setTimeout(() => {
  //             getAutomationData(item);
  //             saveTicketId();


  //           }, 1200);
  //           setTimeout(() => {
  //           }, 2000);
  //           setTimeout(() => {
  //             CustomDateData = {};
  //             ResetFields();

  //           }, 1400);
  //         }
  //       })
  //       .catch((error) => {

  //         window.scrollTo(0, 0);
  //         setError(true);
  //         setLoading(false);
  //         setButtonSaveText(Language.Submit ? Language.Submit : "Submit");
  //         setTimeout(() => {
  //           messageDismiss();
  //         }, 2000);
  //       });
  //   } else if (Errmessage != "") {
  //     setRequiredColumnMessage(true);
  //     setLoading(false);
  //     setButtonSaveText(Language.Submit ? Language.Submit : "Submit");
  //     setTimeout(() => {
  //       setRequiredColumnMessage(false);
  //     }, 2000);
  //   }
  // }

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
                minWidth: "400px",
                height: "400px"

              }
            }}
          >
            <div style={{ display: "flex" }}>
              <span className='configure-request-title'>Configure Request Form</span>
              <IconButton
                styles={iconButtonStyles}
                className='draggable-model-close-btn'
                iconProps={cancelIcon}
                ariaLabel="Close popup modal"
                onClick={() => setOpenModel(false)}
              />
            </div>
            {/* <div className='draggble-container'> */}
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

                              >
                                <div className='draggble-content-label'>
                                  {item?.Name}
                                </div>
                                <div className='draggble-content-root'>

                                  <div style={{ width: "10px" }}>
                                    <Icon iconName="GripperDotsVertical"></Icon>
                                  </div>
                                  <div style={{ width: "20px" }}>
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
                                  <div style={{ width: "calc(100% - 40px)" }} className='draggable-model-dropdown'>
                                    {item?.Name === "Teams" ? <Dropdown
                                      // label={"Teams"}
                                      options={propsData?.teamsoptionarray}
                                      onChange={propsData?.handleTeamsOnChange}
                                      placeholder="Select teams"
                                      selectedKey={propsData?.defltTeam}
                                    /> : item?.Name === "Services" ? <Dropdown
                                      // label={"Service"}

                                      options={propsData?.serviceOption}
                                      onChange={propsData?.handleServiceOnChange}
                                      placeholder="Select services"
                                      selectedKey={propsData?.defltService}
                                    /> : item?.Name === "Sub Services" ?
                                      <Dropdown
                                        // label={"Sub Service"}

                                        options={propsData?.subserviceOption}
                                        onChange={propsData?.handleSubServiceOnChange}
                                        placeholder="Select sub services"
                                        selectedKey={propsData?.defltSubService}
                                      />
                                      : item?.Name === "Priority" ? <Dropdown
                                        //  label={"Priority"}

                                        options={propsData?.priorityoptions}
                                        onChange={propsData?.handlePriorityOnChange}
                                        placeholder="Select priority"
                                        // defaultSelectedKey={propsData?.defltPriority}
                                        selectedKey={propsData?.defltPriority}
                                      /> : item?.Name === "Request Type" ? <Dropdown
                                        //  label={"Request Type"}

                                        options={propsData?.requestoptions}
                                        onChange={propsData?.handleRequestTypeOnChange}
                                        placeholder="Select request type"
                                        selectedKey={propsData?.defltReq}
                                      /> : item?.Name === "Description" ? <Dropdown
                                        disabled
                                        options={propsData?.requestoptions}
                                        onChange={propsData?.handleRequestTypeOnChange}
                                        placeholder="Description"
                                        selectedKey={"Description"}
                                      /> : item?.Name === "Title" ? <Dropdown
                                        options={propsData?.requestoptions}
                                        onChange={propsData?.handleRequestTypeOnChange}
                                        placeholder="Title"
                                        disabled
                                        selectedKey={"Title"}
                                      /> : null}

                                  </div>
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
            {/* </div> */}
            {/* NOTES: */}
            <div style={{ padding: "10px 20px", display: "flex" }}><strong>Note:</strong>
              <div className='draggble-model-short-note'>
                {/* You can select a maximum of 5 fields at a time. For any field you do not select, please ensure you set its default value.</div> */}
                You can select upto 5 fields, for remaining fields you can select default values to be sent.</div> 
            </div>

            {/* Submit & Cancel Button */}
            <div style={{ gap: "20px", paddingBottom: "12px" }} className='add-new-installation-common-style-btn-input'>
              <button className='add-new-installation-submit-btn' onClick={onSubmit}>Save</button>
              <button style={{ background: "#fff", color: "#333", border: "1px solid gray" }} className='add-new-installation-submit-btn' onClick={() => setOpenModel(false)}>Cancel</button>
            </div>
          </Modal>
        </div>
      }

      <div id="ConfigureRequest" />
      {/* POPUP SWEET ALETS */}
      {
        configureRequestUpdate && <ReusableSweetAlerts
          type="success"
          title="Skip"
          text={
            "Updated successfully!"
          }
          isBehindVisible={false}
          isConfirmBtn={false}
          id={"#ConfigureRequest"}
          countdown={2000}
          popupCustomClass={"general-settings"}
        />

      }
      {
        maxSelect && <ReusableSweetAlerts
          type="warning"
          title="Skip"
          text={
            "Please select up to 5."
          }
          isBehindVisible={false}
          isConfirmBtn={false}
          id={"#ConfigureRequest"}
          countdown={2000}
          popupCustomClass={"general-settings"}
        />
      }

      {
        selectDefaultValue && <ReusableSweetAlerts
          type="warning"
          title="Skip"
          text={
            "Please select default value"
          }
          isBehindVisible={false}
          isConfirmBtn={false}
          id={"#ConfigureRequest"}
          countdown={2000}
          popupCustomClass={"general-settings"}
        />
      }
    </>
  )
}

export default SingleLayoutHeader




