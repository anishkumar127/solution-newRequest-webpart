import React, { useEffect, useState } from 'react'
import { useStore } from '../../../store/zustand';
const helpDeskLog = require('../../../../../../assets/help-desk.png');
const helpDeskLogDarkMode = require('../../../../../../assets/HD365-Icon-White-1200.png');
import { IIconProps, Icon } from '@fluentui/react/lib/Icon';
import { IButtonStyles, ICheckboxStyles, IconButton, Modal, Pivot, PivotItem } from '@fluentui/react';
import { useRequestPost } from '../../../store/apis_add-new-tickts/add-new-api-post';
import { useAddNewApiStore } from '../../../store/apis_add-new-tickts/add-new-apis';
import ReusableSweetAlerts, { CustomAlertType } from '../../../utils/SweetAlerts/ReusableSweetAlerts';
import { isStringValidated } from '../../../utils/validator/isStringValidated';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import ContextService from '../../../loc/Services/ContextService';

import { isArrayValidated } from '../../../utils/validator/isArrayValidated';
import { sp } from '@pnp/sp/presets/all';
import { setTimedState } from '../../../utils/timeout/setTimedState';
import SelectionFields from '../SelectionFields';
import DefaultFields from '../DefaultFields';
import SettingsConfig from '../SettingsConfig';
import { alertsConfig } from '../../../utils/SweetAlerts/alertsConfig';

let mandatoryFields = [];
let finalticketID = '';
let ticketSequence = "";
let generatedIssueID;
let userName;
let AutoCCEmail;
let AutoAgentEmail;
let StopAutoAssignMail = 'No'
let lastAssignid = [];


const SingleLayoutHeader = ({ propsData }) => {
  const ThemesColor = useStore((state) => state.ThemesColor)
  console.log("theme", ThemesColor);

  // <-------------------------- SET DATA ---------------------->
  const setExpandMode = useStore((state) => state.setExpandMode);
  const setRequestFieldsCheckbox = useRequestPost((state) => state.setRequestFieldsCheckbox);
  const setDefaultRequestSettings = useRequestPost((state) => state.setDefaultRequestSettings);

  // <-------------------------- FETCHING DATA ---------------------->

  const fetchRequestFieldsCheckbox = useAddNewApiStore((state) => state.fetchRequestFieldsCheckbox);
  const fetchIsInstalled = useStore((state) => state.fetchIsInstalled);

  // <-------------------------- GETTING DATA ---------------------->
  const getSettingsCollection = useStore((state) => state.getSettingsCollection());
  const getRequestFieldsCheckbox = useAddNewApiStore((state) => state.getRequestFieldsCheckbox());
  const getEmailTemplate = useAddNewApiStore((state) => state.getEmailTemplate());
  const getUserLists = useAddNewApiStore((state) => state.getUserLists());
  const getTeamsDepartmentApi = useAddNewApiStore((state) => state.getTeamsDepartmentApi());
  const getIsInstalled = useStore((state) => state.getIsInstalled());

  console.log("SITE DATA", getSettingsCollection);

  // <----------------------- MODEL ON/OFF STATES --------------->
  const [openModel, setOpenModel] = useState<boolean>(false);

  // <----------------------- DRAGGBLE STATES --------------->

  const [draggedOrderData, setDraggedOrderData] = useState<any[]>();

  // <----------------------- UPDATE SWEET ALERT STATES --------------->
  const [configureRequestUpdate, setConfigureRequestUpdate] = useState<boolean>(false);
  const [maxSelect, setMaxSelect] = useState<boolean>(false);
  const [selectDefaultValue, setSelectDefaultValue] = useState<boolean>(false);


  // <----------------------- SUBMIT TICKET & SAVE TICKETS ID STATES --------------->
  const [TicketPropertiesValue, setTicketPropertiesValue] = React.useState([]);

  const [SLAResponseInfo, setSLAResponseInfo] = React.useState([]);
  const [SLAResolveInfo, setSLAResolveInfo] = React.useState([]);

  // <----------------------- SUBMIT TICKETS SWEET ALERT STATES --------------->
  const [emptyTitleMsg, setEmptyTitleMsg] = useState<boolean>(false);
  const [emptyDescriptionMsg, setEmptyDescriptionMsg] = useState<boolean>(false);
  const [emptyTeamsMsg, setEmptyTeamsMsg] = useState<boolean>(false);

  const [savedTicketsMsg, setSavedTicketsMsg] = useState<boolean>(false);

  // <------------------------------------ ADDING THE DEFAULT CHECKBOXES ----------------------------->
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

  // <----------------------- FETCHED GET & SET TO STATE CHECKBOX FIELDS DATA --------------->
  useEffect(() => {
    if (getRequestFieldsCheckbox && getRequestFieldsCheckbox?.length > 0) {
      const checkboxFields = getRequestFieldsCheckbox[0]?.RequestTicketsCheckedFields
      const data: any[] = JSON.parse(checkboxFields);
      if (data && data?.length > 0) {
        console.log("data checkbox get", data);
        setDraggedOrderData(data);
      }
    }
  }, [getRequestFieldsCheckbox[0]?.RequestTicketsCheckedFields, openModel]);

  React.useEffect(() => {
    const fetchedIsInstalled = async () => {
        await fetchIsInstalled();
    }
    fetchedIsInstalled();
}, [openModel]);

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

  const onSubmit = async (e) => {
    if (draggedOrderData && draggedOrderData?.length > 0) {
      // COUNT CHECK CHECKED 
      const checkedCount = draggedOrderData?.reduce((curr, item) => {
        return item?.isChecked === true ? curr + 1 : curr;
      }, 0);
      console.log('checkedCount', checkedCount);
      console.log("%c submitData", 'color:purple', draggedOrderData);

      if (checkedCount == 5) {
        try {
          await setRequestFieldsCheckbox(draggedOrderData); // POSTING Checkbox Data.
        } catch (error) {
          console.error("api checkbox selection post calls error", error)
        }
        setConfigureRequestUpdate(true);
        setTimedState(setConfigureRequestUpdate, true, 2000);
        setOpenModel(false);
      } else {
        setMaxSelect(true);
        setTimedState(setMaxSelect, true, 2000);
        console.log("you only able to select 5 items.")
      }
    }
  }

  // <----------------------------------   SUBMIT DEFAULT SETTINGS ---------------------------->
  const onDefaultSubmit = async () => {
    const { defltTeam, defltService, defltSubService, defltReq, defltPriority } = propsData;
    const defaultData = {
      Teams: defltTeam,
      Services: defltService,
      'Sub Services': defltSubService,
      'Request Type': defltReq,
      Priority: defltPriority
    }
    try {
      await setDefaultRequestSettings(defaultData); // POSTING Default Data.
      setConfigureRequestUpdate(true);
      setTimedState(setConfigureRequestUpdate, true, 2000);
      setOpenModel(false);
    } catch (error) {
      console.error("api default post calls error", error);
    }
  }

  // <----------------------------------   SUBMIT TICKETS  ---------------------------->
  const SubmitTicket = () => {
    let currentuser = ContextService.GetCurrentUser();
    let userid = ContextService.GetCurentUserId();
    const { departmentName, ticketTitle, descriptionValue, defltTeam, requestname, requestername,
      defltService: servicename, defltSubService: subservicename, defltPriority: priorityName
    } = propsData;
    let AlldesccolumnsValues = []
    let requester = " ";
    let requesterDisplayName = "";
    if (currentuser.length > 0) {
      requester = currentuser[0].id;
      requesterDisplayName = currentuser[0].name;
    } else {
      requester = null;
    }
    TicketPropertiesValue.push({
      TicketOpenDate: "",
      InternalExtrenal: "Internal",
      CCMail: '',
      Read: "Unread",
      DepartmentCode: propsData?.defltTeam,
      SubTickets: "",
      LastSubTicketCharacter: "",
      MediaSource: "Portal",
      CustomFormID: '',
      PushNotification: 'Active',
      TicketDescription: "Inside"
    });

    //for SLAResponse:
    SLAResponseInfo.push({
      SLAResponseBreach: "No",
      SLAResponseBreachOn: '',
      SLAResponseReplyTime: '',
      SLAResponseReplyDate: '',
      SLAResponseReplyDay: '', //(ex:Monday...)
      SLAResponseEscalateTime: '', //from Define SLAsettings
      SLAResponseAlertTime: '',
      SLAResponseNotifyType: '',
      SLAResponseAlertTo: '',
      SLAResponseMailSub: '', //from email notification subject
      SLAResponseMailBody: '',
    })
    //for SLAResponse:
    SLAResolveInfo.push({
      SLAResolveBreach: "No",
      SLAResolveBreachOn: '',
      SLAResolveReplyTime: '',
      SLAResolveReplyDate: '',
      SLAResolveReplyDay: '', //(ex:Monday...)
      SLAResolveEscalateTime: '', //from Define SLAsettings
      SLAResolveAlertTime: '',
      SLAResolveNotifyType: '',
      SLAResolveAlertTo: '',
      SLAResolveMailSub: '', //from email notification subject
      SLAResolveMailBody: '',
    })

    let flag = false;
    let flag1 = false;
    let flag4 = false;
    let flag5 = false;

    // check if a field is empty or undefined
    const isEmptyOrUndefined = (field) => field == null || field === "" || field === undefined;
    // handle timeouts
    const setTimedState = (setState, value, timeout) => {
      setState(value);
      setTimeout(() => {
        setState(!value);
      }, timeout);
    };
    if (isEmptyOrUndefined(ticketTitle) && mandatoryFields.includes("Title")) {
      setEmptyTitleMsg(true);
      setTimedState(setEmptyTitleMsg, true, 2000);
      flag = true;
    }

    if (isEmptyOrUndefined(requestname)) {
      flag1 = true;
    }

    if (isEmptyOrUndefined(descriptionValue) && mandatoryFields.includes("Description")) {
      setEmptyDescriptionMsg(true);
      setTimedState(setEmptyDescriptionMsg, true, 2000);

      flag4 = true;
    }

    if (isEmptyOrUndefined(defltTeam) && mandatoryFields.includes("Teams")) {
      setEmptyTeamsMsg(true);
      setTimedState(setEmptyTeamsMsg, true, 2000);

      flag5 = true;
    }

    let finalTemplate;
    finalTemplate = {
      Title:
        ticketTitle == "" || ticketTitle == null || ticketTitle == undefined
          ? ticketTitle
          : ticketTitle.trim(),
      DepartmentName: departmentName,
      Services: servicename,
      SubServices: subservicename,
      Priority: priorityName,
      RequestType: requestname,
      RequesterId: userid,
      TicketDescription: descriptionValue,
      TicketDescInTextformat: descriptionValue.replace(/<[^>]*>/g, ''),
      TicketProperties: JSON.stringify(TicketPropertiesValue),
      RequesterEmail: currentuser.email,
      RequesterName: requesterDisplayName,
      TicketCreatedDate: new (Date),
      SLAResponseDone: "No",
      SLAResolveDone: "No",
      SLAResponseInfo: JSON.stringify(SLAResponseInfo),
      SLAResolveInfo: JSON.stringify(SLAResolveInfo),
      ReadStatus: '',
    };

    if (AlldesccolumnsValues.length) {
      finalTemplate.TicketDescription = finalTemplate.TicketDescription + AlldesccolumnsValues.join('')
    }
    if (!flag && !flag1 && !flag4 && !flag5) {
      var updateurl =
        getIsInstalled?.SiteUrl +
        "/_api/web/lists/getbytitle('HR365HDMTickets')/items";
      ContextService.GetSPContext()
        .post(
          updateurl,
          SPHttpClient.configurations.v1,
          {
            headers: {
              Accept: "application/json;odata=nometadata",
              "Content-type": "application/json;odata=nometadata",
              "odata-version": "",
            },
            body: JSON.stringify(finalTemplate),
          }
        )
        .then((response: SPHttpClientResponse) => {
          return response.json();
        })
        .then((item: any) => {
          setSavedTicketsMsg(true);
          setTimeout(() => {
            setSavedTicketsMsg(false);
            saveTicketId(item?.Id);
          }, 1200);
          setTimeout(() => {
            const { setDefltTeam, setDefltService, setDefltSubService, setDefltPriority, setDefltReq, setTicketTitle, setDescriptionValue } = propsData;
            setDefltTeam(null);
            setDefltService(null);
            setDefltSubService(null);
            setDefltPriority(null);
            setTicketTitle('');
            setDescriptionValue('');
          }, 1700);
        });
    }
  }

  let TeamTicketSuffix = isStringValidated(getSettingsCollection?.SuffixDepartmentName) ? getSettingsCollection?.SuffixDepartmentName : "";

  let EmailsFromMailbox = isStringValidated(getSettingsCollection?.EmailsFromMailbox) ? getSettingsCollection?.EmailsFromMailbox : "";

  let AutoAssignTicket = isStringValidated(getSettingsCollection?.AutoAssign) ? getSettingsCollection?.AutoAssign : "";
  // <----------------------------------   SAVE TICKETS ID  ---------------------------->
  const saveTicketId = (rowId) => {
    console.log("saveTicketId...")
    let flag = false;
    let PrefixandID;
    PrefixandID = parseInt(getSettingsCollection?.TicketPrefix) + rowId;
    finalticketID = `Ticket#${rowId}`;
    let ticktsequencewithoutSuffix = `${getSettingsCollection?.SequenceTitle}#${PrefixandID}`;

    if (TeamTicketSuffix == "On") {
      ticketSequence = `${getSettingsCollection?.SequenceTitle}#${PrefixandID}-${propsData?.defltTeam}`;
    } else {
      ticketSequence = `${getSettingsCollection?.SequenceTitle}#${PrefixandID}`;
    }

    const generateRandomString = (length = 10) => Math.random().toString(20).substr(2, length)
    var ticketId = rowId.toString();

    var ylength = 12 - (4 + ticketId.length);
    var ylengthString = ylength.toString();
    let x = generateRandomString(4);
    let y = generateRandomString(parseInt(ylengthString));
    generatedIssueID = x.toUpperCase() + ticketId + y.toUpperCase();

    if (
      finalticketID == null ||
      finalticketID == "" ||
      finalticketID == undefined
    ) {
      flag = true;
    }
    let _AutoAssignTicket = "Unassigned";
    let finalTemplate = {
      TicketID: finalticketID,
      TicketseqWOsuffix: ticktsequencewithoutSuffix,
      TicketSeqnumber: ticketSequence,
      Status: _AutoAssignTicket,
      IssueId: generatedIssueID,
    };
    if (!flag) {
      var updateurl =
        getIsInstalled?.SiteUrl +
        "/_api/web/lists/getbytitle('HR365HDMTickets')/items('" +
        rowId +
        "')";
      ContextService.GetSPContext()
        .post(
          updateurl,
          SPHttpClient.configurations.v1,
          {
            headers: {
              Accept: "application/json;odata=nometadata",
              "Content-type": "application/json;odata=nometadata",
              "odata-version": "",
              "IF-MATCH": "*",
              "X-HTTP-Method": "MERGE",
            },
            body: JSON.stringify(finalTemplate),
          }
        )
        .then(
          (response: SPHttpClientResponse): void => {
            console.log("mailing...")
            sendEmailWOAuto();
          }
        )
    }
  }
  // <----------------------------------   SUBMITTED TICKETS MAIL  ---------------------------->

  function sendEmailWOAuto() {
    console.log("sending mail...")
    if (getEmailTemplate && getEmailTemplate?.length > 0) {
      // props destucturing.
      const emailTemplate = getEmailTemplate;
      const { ticketTitle: Titlename, descriptionValue: globalMessage, defltService: servicename, defltSubService: subservicename, defltPriority: priorityName, requestname } = propsData;

      // current email id & address
      let currentuser = ContextService.GetCurrentUser();
      let userid = ContextService.GetCurentUserId();
      let requester = " ";
      let requesterDisplayName = "";
      if (currentuser.length > 0) {
        requester = currentuser[0].id;
        requesterDisplayName = currentuser[0].name;
      } else {
        requester = null;
      }

      // ReqName
      let reqName;
      if (currentuser.displayName.indexOf("0#.f|membership|") > -1) {
        userName = currentuser.displayName.split('0#.f|membership|"')[1];
      } else {
        userName = currentuser.displayName;
      }
      reqName = userName;

      let AdminMails = [];
      let agent = emailTemplate.filter((i) => {
        return (i.Title == "Agent - New Ticket Created");
      });
      let superEmail = emailTemplate.filter((i) => {
        return (i.Title == "Supervisor - New Ticket Created");
      });
      let SuperAgent = emailTemplate.filter((i) => {
        return (i.Title == "All Supervisors & Agents - New Ticket Created");
      });

      let adminEmail = emailTemplate.filter((i) => {
        return (i.Title == "Admin - New Ticket Generated");
      });

      let requesterEmailTemp = emailTemplate.filter((i) => {
        return (i.Title == "Requester - New Ticket Created");
      });
      let supertitle = superEmail[0].Subject;
      let supertitle1 = supertitle.replaceAll('[ticket.subject]', Titlename);
      let supertitle2 = supertitle1.replaceAll('[ticket.id]', '[' + ticketSequence + ']');
      supertitle2 = supertitle2.replaceAll('[ticket.url]', "").replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', "").replaceAll('[ticket.agent.name]', "").replaceAll('[ticket.agent.email]', "").replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', "").replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.requester.name]', reqName).replaceAll('[ticket.from_email]', currentuser.email).replaceAll('[ticket.Service]', servicename).replaceAll('[ticket.SubService]', subservicename);
      supertitle2 = supertitle2.replaceAll(null, '').replaceAll(undefined, '').replaceAll('[ticket.survey_rating]', '');
      let currentContext = window.location.href.split("#")[0].split(".aspx")[0];
      let body = superEmail[0].Body;
      let body1 = body.replaceAll('[ticket.requester.name]', reqName);
      body1 = body1.replaceAll('[ticket.subject]', Titlename).replaceAll('[ticket.id]', ticketSequence).replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', "").replaceAll('[ticket.agent.name]', "").replaceAll('[ticket.agent.email]', "").replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', "").replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.requester.name]', reqName).replaceAll('[ticket.from_email]', currentuser.email);;
      body1 = body1.replaceAll(null, '').replaceAll(undefined, '').replaceAll('[ticket.Service]', servicename).replaceAll('[ticket.SubService]', subservicename).replaceAll('[ticket.survey_rating]', '');
      let taskUrl;

      if (currentContext) {
        taskUrl = currentContext + ".aspx#/Ticket/" + generatedIssueID;
        if (taskUrl.indexOf('SitePages') == -1) {
          taskUrl = taskUrl.split('.aspx')[0] + taskUrl.split('.aspx')[1]
        }
        if (currentContext.indexOf("teamshostedapp") != -1) {
          taskUrl = "https://teams.microsoft.com/_#/apps//sections/4d8856e9-d2a6-493f-ba99-2b34a6ee5377/launcher/launcher.html?url=" + currentContext + ".aspx#/Ticket/" + generatedIssueID;
        }
      }

      let body2 = body1.replaceAll('[ticket.url]', `<a href='${taskUrl}'>${ticketSequence}</a>`);
      let requesterEmailTempArray = [];
      let reqSub;
      let reqbody;
      if (requesterEmailTemp[0].CustomFormTemplate != null && requesterEmailTemp[0].CustomFormTemplate != undefined) {
        requesterEmailTempArray = JSON.parse(requesterEmailTemp[0].CustomFormTemplate);
        requesterEmailTempArray = requesterEmailTempArray.filter((IdV) => {
          // return IdV.FormGuid == DefaultFormGuid
          return IdV.FormGuid == ''
        })
        reqSub = isArrayValidated(requesterEmailTempArray) ? requesterEmailTempArray[0].EmailSubject : requesterEmailTemp[0].Subject;
        reqbody = isArrayValidated(requesterEmailTempArray) ? requesterEmailTempArray[0].EmailBody : requesterEmailTemp[0].Body;
      } else {
        requesterEmailTempArray = requesterEmailTemp;
        reqSub = requesterEmailTempArray[0].Subject;
        reqbody = requesterEmailTempArray[0].Body;
      }

      let reqSub1 = reqSub.replaceAll('[ticket.subject]', Titlename);
      let reqSub2 = reqSub1.replaceAll('[ticket.id]', '[' + ticketSequence + ']');
      reqSub2 = reqSub2.replaceAll('[ticket.url]', `<a href='${taskUrl}'>${ticketSequence}</a>`).replaceAll('[ticket.description]', "").replaceAll('[ticket.latest_comment]', "").replaceAll('[ticket.agent.name]', "").replaceAll('[ticket.agent.email]', "").replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', "").replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.requester.name]', reqName).replaceAll('[ticket.from_email]', currentuser.email);
      reqSub2 = reqSub2.replaceAll(null, '').replaceAll(undefined, '').replaceAll('[ticket.Service]', servicename).replaceAll('[ticket.SubService]', subservicename).replaceAll('[ticket.survey_rating]', '');

      let reqbody1 = reqbody.replaceAll('[ticket.requester.name]', reqName);
      let reqbody2 = reqbody1.replaceAll('[ticket.id]', ticketSequence);
      reqbody2 = reqbody2.replaceAll('[ticket.subject]', Titlename).replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', "").replaceAll('[ticket.agent.name]', "").replaceAll('[ticket.agent.email]', "").replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', "").replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.from_email]', currentuser.email).replaceAll('[ticket.Service]', servicename).replaceAll('[ticket.SubService]', subservicename);
      reqbody2 = reqbody2.replaceAll(null, '').replaceAll(undefined, '');
      let reqbody3 = reqbody2.replaceAll('[ticket.url]', `<a href='${taskUrl}'>${ticketSequence}</a>`).replaceAll('[ticket.survey_rating]', '');



      let _teamdata = getTeamsDepartmentApi?.filter((ele) => {
        return ele.Onqueue == propsData?.defltTeam;

      });

      if (adminEmail[0].IsActive == "Yes") {

        var filtered = getUserLists?.filter((item) => {
          return (item.Roles == "Admin");
        });

        let sendEmailIds = [];
        filtered.map((i) => {
          sendEmailIds.push(i.Email);
        });


        AdminMails = [...new Set(sendEmailIds)];
        if (AdminMails.length > 0) {
          let fromemail = "no-reply@sharepointonline.com";

          if (getSettingsCollection?.defaultAsignee == null || getSettingsCollection?.defaultAsignee == undefined || getSettingsCollection?.defaultAsignee == "") {
            fromemail = "no-reply@sharepointonline.com";
          } else {
            fromemail = getSettingsCollection?.defaultAsignee;
          }

          if (EmailsFromMailbox == "On") {
            postExternal(fromemail, AdminMails, body2, supertitle2, []);

          } else {
            sendEmailReply(supertitle2, body2, AdminMails, fromemail, AutoCCEmail);
          }



        }


      }

      if (agent[0].IsActive == "Yes") {
        let sendEmailIds = [];
        if (_teamdata[0].Teammembers1Id) {

          var filtered = getUserLists?.filter((item) => {
            return _teamdata[0].Teammembers1Id.indexOf(item.UsersId) !== -1;
          });

          filtered.map((i) => {
            sendEmailIds.push(i.Email);
          });
          if (AutoAgentEmail != null && AutoAgentEmail != undefined && AutoAgentEmail != '') {
            sendEmailIds.push(AutoAgentEmail)
          }


        }

        let uniqueEmails = [...new Set(sendEmailIds)];

        if (uniqueEmails.length > 0) {
          let fromemail = "no-reply@sharepointonline.com";

          if (getSettingsCollection?.defaultAsignee == null || getSettingsCollection?.defaultAsignee == undefined || getSettingsCollection?.defaultAsignee == "") {
            fromemail = "no-reply@sharepointonline.com";
          } else {
            fromemail = getSettingsCollection?.defaultAsignee;
          }
          if (uniqueEmails?.toString() != AdminMails?.toString()) {
            if (EmailsFromMailbox == "On") {
              postExternal(fromemail, uniqueEmails, body2, supertitle2, AutoCCEmail);

            } else {
              sendEmailReply(supertitle2, body2, uniqueEmails, fromemail, AutoCCEmail);
            }

          }

        }



      }
      if (superEmail[0].IsActive == "Yes") {
        let sendEmailIds = [];
        if (_teamdata[0].Supervisor1Id) {

          var filtered = getUserLists?.filter((item) => {
            return _teamdata[0].Supervisor1Id.indexOf(item.UsersId) !== -1;
          });

          filtered.map((i) => {
            sendEmailIds.push(i.Email);
          });


        }
        let uniqueEmails = [...new Set(sendEmailIds)];
        if (uniqueEmails.length > 0) {
          let fromemail = "no-reply@sharepointonline.com";

          if (getSettingsCollection?.defaultAsignee == null || getSettingsCollection?.defaultAsignee == undefined || getSettingsCollection?.defaultAsignee == "") {
            fromemail = "no-reply@sharepointonline.com";
          } else {
            fromemail = getSettingsCollection?.defaultAsignee;
          }
          if (uniqueEmails?.toString() != AdminMails?.toString()) {
            if (EmailsFromMailbox == "On") {
              postExternal(fromemail, uniqueEmails, body2, supertitle2, AutoCCEmail);

            } else {
              sendEmailReply(supertitle2, body2, uniqueEmails, fromemail, AutoCCEmail);
            }

          }

        }

      }
      if (SuperAgent[0].IsActive == "Yes") {


        let sendEmailIds = [];
        if (_teamdata[0].Supervisor1Id) {

          var filtered = getUserLists?.filter((item) => {
            return _teamdata[0].Supervisor1Id.indexOf(item.UsersId) !== -1;
          });
          //
          filtered.map((i) => {
            sendEmailIds.push(i.Email);
          });
        }

        if (_teamdata[0].Teammembers1Id) {

          var filtered = getUserLists?.filter((item) => {
            return _teamdata[0].Teammembers1Id.indexOf(item.UsersId) !== -1;
          });
          //
          filtered.map((i) => {
            sendEmailIds.push(i.Email);
          });


        }



        let uniqueEmails = [...new Set(sendEmailIds)];

        if (uniqueEmails.length > 0) {
          let fromemail = "no-reply@sharepointonline.com";

          if (getSettingsCollection?.defaultAsignee == null || getSettingsCollection?.defaultAsignee == undefined || getSettingsCollection?.defaultAsignee == "") {
            fromemail = "no-reply@sharepointonline.com";
          } else {
            fromemail = getSettingsCollection?.defaultAsignee;
          }
          if (uniqueEmails?.toString() != AdminMails?.toString()) {
            if (EmailsFromMailbox == "On") {
              postExternal(fromemail, uniqueEmails, body2, supertitle2, AutoCCEmail);

            } else {
              sendEmailReply(supertitle2, body2, uniqueEmails, fromemail, AutoCCEmail);
            }

          }

        }

      }
      if (isArrayValidated(requesterEmailTempArray) ? requesterEmailTempArray[0].IsActive == "Yes" : requesterEmailTemp[0].IsActive == "Yes") {
        let sendEmailIds = [currentuser.email];

        let uniqueEmails = [...new Set(sendEmailIds)];
        if (AutoCCEmail != '' && AutoCCEmail != undefined && AutoCCEmail != null) {
          uniqueEmails.push([]);
        }
        if (uniqueEmails.length > 0) {
          let fromemail = "no-reply@sharepointonline.com";

          if (getSettingsCollection?.defaultAsignee == null || getSettingsCollection?.defaultAsignee == undefined || getSettingsCollection?.defaultAsignee == "") {
            fromemail = "no-reply@sharepointonline.com";
          } else {
            fromemail = getSettingsCollection?.defaultAsignee;
          }
          if (EmailsFromMailbox == "On") {
            postExternal(fromemail, uniqueEmails, reqbody3, reqSub2, AutoCCEmail);

          } else {
            sendEmailReply(reqSub2, reqbody3, uniqueEmails, fromemail, AutoCCEmail);
          }


        }

      }
      if (AutoAssignTicket == "On" && StopAutoAssignMail == 'No') {
        let autoAssignEmal = emailTemplate.filter((i) => {
          return (i.Title == "Assignee - Ticket Assigned To Agent");
        });

        if (autoAssignEmal[0].IsActive == "Yes") {

          let autosub = autoAssignEmal[0].Subject;
          let autosub1 = autosub.replaceAll('[ticket.subject]', Titlename);
          let autosub2 = autosub1.replaceAll('[ticket.id]', '[' + ticketSequence + ']');
          autosub2 = autosub2.replaceAll('[ticket.url]', "").replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', "").replaceAll('[ticket.agent.name]', lastAssignid).replaceAll('[ticket.agent.email]', autoAssignEmal).replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', "").replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.requester.name]', reqName).replaceAll('[ticket.from_email]', currentuser.email).replaceAll('[ticket.service]', servicename).replaceAll('[ticket.subservice]', subservicename);
          autosub2 = autosub2.replaceAll(null, '').replaceAll(undefined, '');
          let reqbody = requesterEmailTemp[0].Body;
          let autobody = autoAssignEmal[0].Body;
          autobody = autobody.replaceAll('[ticket.id]', ticketSequence);
          autobody = autobody.replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', "").replaceAll('[ticket.agent.name]', lastAssignid).replaceAll('[ticket.agent.email]', autoAssignEmal).replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', "").replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.requester.name]', reqName).replaceAll('[ticket.from_email]', currentuser.email).replaceAll('[ticket.service]', servicename).replaceAll('[ticket.subservice]', subservicename);
          autobody = autobody.replaceAll(null, '').replaceAll(undefined, '');
          let autobody1 = autobody.replaceAll('[ticket.url]', `<a href='${taskUrl}'>${ticketSequence}</a>`);

          let sendEmailIds = [];
          var filtered = getUserLists?.filter((item) => {
            return (item.UsersId == lastAssignid);
          });
          filtered.map((i) => {
            sendEmailIds.push(i.Email);
          });


          let uniqueEmails = [...new Set(sendEmailIds)];


          if (uniqueEmails.length > 0) {
            let fromemail = "no-reply@sharepointonline.com";

            if (getSettingsCollection?.defaultAsignee == null || getSettingsCollection?.defaultAsignee == undefined || getSettingsCollection?.defaultAsignee == "") {
              fromemail = "no-reply@sharepointonline.com";
            } else {
              fromemail = getSettingsCollection?.defaultAsignee;
            }
            if (EmailsFromMailbox == "On") {
              postExternal(fromemail, uniqueEmails, autobody1, autosub2, AutoCCEmail);

            } else {
              sendEmailReply(autosub2, autobody1, uniqueEmails, fromemail, AutoCCEmail);
            }
          }

        }
      }


    }
  }


  function sendEmailReply(subject, body, toOwner, from, CC) {
    body = body.replaceAll('</p>', '<br>').replaceAll('<p>', '')
    sp.setup({
      spfxContext: ContextService.GetFullContext()
    });
    sp.utility.sendEmail({
      Body: body,
      Subject: subject,
      To: toOwner,
      From: from,
      CC: CC
    }).then((i) => {
    }).catch((i) => {
    });
  }

  function postExternal(from, to, body, sub, CC) {
    let currentTeam = getTeamsDepartmentApi?.filter(e => e.Onqueue == propsData?.defltTeam)
    if (currentTeam.length) {

      if (isStringValidated(currentTeam[0].MailBox)) {
        from = currentTeam[0].MailBox

      }
    }
    body = body.replaceAll('</p>', '<br>').replaceAll('<p>', '')
    let finalTemplate = {
      From: from,
      To: to.join(';'),
      Body: body,
      Subject: sub,
      CC: CC

    };
    var updateurl =
      getIsInstalled?.SiteUrl +
      "/_api/web/lists/getbytitle('HR365HDMExternalEmailData')/items";

    ContextService.GetSPContext()
      .post(
        updateurl,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "Content-type": "application/json;odata=nometadata",
            "odata-version": "",
          },
          body: JSON.stringify(finalTemplate),
        }
      )
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
        } else {
          response.json().then((responseJSON) => {
          });
        }
        return response.json();
      });

  }




  // <-------------- CHECKBOX STYLES ------------------------------->
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

  // <--------------------- SWEET ALERT CONFIG  ----------------------------

  const alerts = [
    {
      show: configureRequestUpdate,
      type: 'success' as CustomAlertType,
      text: 'Updated successfully!',
      id: 'ConfigureRequest',
      popupCustomClass: "general-settings",

    },
    {
      show: maxSelect,
      type: 'warning' as CustomAlertType,
      text: 'Please select up to 5.',
      id: 'ConfigureRequest2',
      popupCustomClass: "general-settings",

    },
    {
      show: selectDefaultValue,
      type: 'warning' as CustomAlertType,
      text: 'Please select default value',
      id: 'ConfigureRequest3',
      popupCustomClass: "general-settings",
    },
    {
      show: emptyTitleMsg,
      type: 'warning' as CustomAlertType,
      text: 'Please fill the title',
      id: 'ConfigureRequest4',
      popupCustomClass: "general-settings",
    },
    {
      show: emptyDescriptionMsg,
      type: 'warning' as CustomAlertType,
      text: 'Please fill the description',
      id: 'ConfigureRequest5',
      popupCustomClass: "general-settings",
    },
    {
      show: emptyTeamsMsg,
      type: 'warning' as CustomAlertType,
      text: 'Please select teams',
      id: 'ConfigureRequest6',
      popupCustomClass: "general-settings",
    },
    {
      show: savedTicketsMsg,
      type: 'success' as CustomAlertType,
      text: 'Request submitted successfully!',
      id: 'ConfigureRequest7',
      popupCustomClass: "general-settings",

    },
  ]
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
          <Icon className='send-on-submit-add-new-icon add-new-ticket-pointer' iconName="Send" onClick={SubmitTicket} />

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
                width: "600px",
                height: "540px"

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

            {/* Pivot */}

            <div className='pivot-add-new-webpart-container'>
              <Pivot aria-label="Basic Pivot Example">
                <PivotItem
                  headerText="Selection & Order"
                >
                  {/* Checkbox */}
                  <SelectionFields
                    onChangeCheckbox={onChangeCheckbox}
                    handleDragEnd={handleDragEnd}
                    draggedOrderData={draggedOrderData}
                    checkboxStyle={checkboxStyle}
                    onSubmit={onSubmit}
                    setOpenModel={setOpenModel}
                  />

                </PivotItem>
                <PivotItem
                  headerText="Default Choices"
                >
                  <DefaultFields
                    propsData={propsData}
                    onDefaultSubmit={onDefaultSubmit}
                    setOpenModel={setOpenModel}
                  />

                </PivotItem>
                <PivotItem
                  headerText="General Settings"
                >
                  <SettingsConfig
                  />
                </PivotItem>
              </Pivot>
            </div>
          </Modal>
        </div>
      }


      {/* <div id="ConfigureRequest" /> */}

      {alerts?.map((alert, index) => {
        {/* {alertsConfig?.map((alert, index) => { */ }
        // const show = state[key];
        // console.log("alerts",alert);
        const { show, type, text, id, popupCustomClass } = alert;
        return show && (
          <ReusableSweetAlerts
            key={index}
            type={type as CustomAlertType}
            title="Skip"
            text={text}
            isBehindVisible={false}
            isConfirmBtn={false}
            id={`#${id}`}
            countdown={2000}
            popupCustomClass={popupCustomClass || 'general-settings'}
          />
        );
      })}
    </>
  )
}

export default SingleLayoutHeader




