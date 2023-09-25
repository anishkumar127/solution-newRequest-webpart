import React, { Fragment, useEffect, useState } from "react";
import { Link, TextField } from "@fluentui/react";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { useAddNewApiStore } from "../../../store/apis_add-new-tickts/add-new-apis";
import SingleLayoutHeader from "./SingleLayoutHeader";
import ContextService from "../../../loc/Services/ContextService";
import { useStore } from "../../../store/zustand";
import Typed from "../../../TypeSafety/Types";

// TEAMS DEPARTMENT
let defaultteamCode = "";
// PRIRORITY
let defaultPriority = ''

// REQUEST TYPE
let DefaultRequestType = ''

// DEFAULT ORDER
let DefaultLayoutItemsNames = [];


const SingleLayoutAddNewTicket = () => {

  // store
  // <-------------------------- FETCHING DATA ---------------------->
  const fetchTeamsDepartmentApi = useAddNewApiStore(
    (state) => state.fetchTeamsDepartmentApi
  );
  const fetchPriorityApi = useAddNewApiStore((state) => state.fetchPriorityApi);
  const fetchRequestType = useAddNewApiStore((state) => state.fetchRequestType);
  const fetchService = useAddNewApiStore((state) => state.fetchService);
  const fetchSubService = useAddNewApiStore((state) => state.fetchSubService);
  const initializeDataAddNewWebPart = useAddNewApiStore(
    (state) => state.initializeDataAddNewWebPart
  );
  const fetchEmailTemplate = useAddNewApiStore((state) => state.fetchEmailTemplate);
  const fetchUserLists = useAddNewApiStore((state) => state.fetchUserLists);

  // <-------------------------- GETTING DATA ---------------------->
  const getTeamsDepartmentApi = useAddNewApiStore((state) =>
    state.getTeamsDepartmentApi()
  );
  const getRequestFieldsCheckbox = useAddNewApiStore((state) => state.getRequestFieldsCheckbox());
  // const getSettingsCollection = useStore((state) => state.getSettingsCollection());

  const getPriorityApi = useAddNewApiStore((state) => state.getPriorityApi());
  const getRequestType = useAddNewApiStore((state) => state.getRequestType());
  const getService = useAddNewApiStore((state) => state.getService());
  const getSubService = useAddNewApiStore((state) => state.getSubService());

  // console.log("getSettingsCollection", getSettingsCollection);
  const getIsInstalled = useStore((state) => state.getIsInstalled());
  const setExpandMode = useStore((state) => state.setExpandMode);

  // console.log("? getIsInstalled",getIsInstalled)
  // STATES
  // < ----------- REQUEST TITLE STATES -------------------------->

  const [isMultiline, setIsMultiline] = useState<boolean>(false);

  // < ----------- TEAMS DEPARTMENTS STATES -------------------------->
  const [defltTeam, setDefltTeam] = React.useState<string>(null);
  const [defltService, setDefltService] = React.useState<string>(null);
  const [serviceOption, setServiceOption] = React.useState([]);
  const [defltSubService, setDefltSubService] = React.useState<string>(null);
  const [subserviceOption, setsubserviceOption] = React.useState([]);
  const [departmentName, setDepartmentName] = useState<string>("");
  const [teamsoptionarray, setteamsoptionarray] = React.useState([]); //M

  // < ----------- PRIORITY STATES -------------------------->
  const [priorityName, setpriorityName] = React.useState<string>();
  const [defltPriority, setDefltPriority] = React.useState<string>(null);
  const [priorityoptions, setpriorityoptions] = React.useState([]);
  const [requestername, setrequesterName] = React.useState([]);
  // < ----------- REQUEST TYPE STATES -------------------------->

  const [requestoptions, setrequestoptions] = React.useState([]);
  const [defltReq, setDefltReq] = React.useState<string>(null);
  const [requestname, setrequestName] = React.useState<string>();

  // < ----------- SERVICE STATES -------------------------->

  const [hroptions, sethroptions] = React.useState([]);
  // < ----------- SUB SERVICE STATES -------------------------->

  const [Suboptions, setSuboptions] = React.useState([]);

  const [layoutOrder, setLayoutOrder] = useState<any[]>([]);

  const [closePanel, setClosePanel] = useState<boolean>(false);

  // 
  const [ticketTitle, setTicketTitle] = useState<string>("");
  const [descriptionValue, setDescriptionValue] = useState<string>("");
  // VALIDATOR FUNCTION

  function isStringValidated(value) {
    if (value == null || value == undefined || value == "") {
      return false;
    } else {
      return true;
    }
  }

  // chaining...

  useEffect(() => {
    const fetchData = async () => {
      try {
        await initializeDataAddNewWebPart();

        try {
          await fetchService(); // Service
        } catch (error) {
          console.error("fetchService failed:", error);
        }

        try {
          await fetchSubService(); // SubService
        } catch (error) {
          console.error("fetchSubService failed:", error);
        }

        try {
          await fetchTeamsDepartmentApi();
        } catch (error) {
          console.error("fetchTeamsDepartmentApi failed:", error);
        }

        try {
          await fetchPriorityApi();
        } catch (error) {
          console.error("fetchPriorityApi failed:", error);
        }

        try {
          await fetchRequestType();
        } catch (error) {
          console.error("fetchRequestType failed:", error);
        }
      } catch (error) {
        console.error("initializeDataAddNewWebPart failed:", error);
      }
    };

    fetchData();
  }, [
    initializeDataAddNewWebPart,
    fetchTeamsDepartmentApi,
    fetchPriorityApi,
    fetchRequestType,
    fetchService,
    fetchSubService
  ]);

  useEffect(() => {
    const TeamsDepartment = getTeamsDepartmentApi;
    const Priority = getPriorityApi;
    const RequestType = getRequestType;
    const Service = getService;
    const SubService = getSubService;
    console.log("inside useeffect data", TeamsDepartment);
    if (TeamsDepartment && TeamsDepartment.length > 0) {
      getTeamDetails(TeamsDepartment); // Teams Department
    }

    if (Priority && Priority?.length > 0) {
      getPriorityFunction(Priority);
    }

    if (RequestType && RequestType?.length > 0) {
      getRequestTypeFunction(RequestType);
    }
    if (Service && Service?.length > 0) {
      getServiceFunction(Service);
    }
    if (SubService && SubService?.length > 0) {
      getSubServiceFunction(SubService);
    }
  }, [getTeamsDepartmentApi, getPriorityApi, getRequestType, getSubService, getService]);

  // <-------------------- FETCHING EMAIL TEMPLATES --------------------------->
  React.useEffect(() => {
    const fetchEmailTemplateFunction = async () => {
      await fetchEmailTemplate();
    }
    fetchEmailTemplateFunction();
  }, []);

  // <-------------------- FETCHING USER LISTS --------------------------->
  React.useEffect(() => {
    const fetchUserListsFunction = async () => {
      await fetchUserLists();
    }
    fetchUserListsFunction();
  }, []);


  //  ALL USEEFFECT WILL BE HERE.

  useEffect(() => {
    if (getRequestFieldsCheckbox && getRequestFieldsCheckbox?.length > 0) {
      const checkboxFields = getRequestFieldsCheckbox[0]?.RequestTicketsCheckedFields
      if (checkboxFields) {
        const data: any[] = JSON.parse(checkboxFields);
        if (data && data?.length > 0) {
          console.log("%c checkbox SET TO ORDER", "background-color:red", data);
          setLayoutOrder(data);
        }
      }

    }
  }, [getRequestFieldsCheckbox]);

  // <------------------------ LAYOUT OF ITEMS TO BE RENDER IN UI  ---------------------------------->

  useEffect(() => {
    // if (getSettingsCollection) {
    const DraggableTemplate = [
      { id: 6, Name: "Title", isChecked: true },
      { id: 0, Name: "Teams", isChecked: true },
      { id: 1, Name: "Services", isChecked: true },
      { id: 2, Name: "Sub Services", isChecked: true },
      { id: 3, Name: 'Priority', isChecked: false },
      { id: 4, Name: 'Request Type', isChecked: false },
      { id: 5, Name: 'Description', isChecked: true }
    ]
    DefaultLayoutItemsNames = DraggableTemplate;
    setLayoutOrder(DraggableTemplate);
    console.log("DraggableTemplate", DraggableTemplate);
    // }
  }, [])

  //
  useEffect(()=>{
console.log("re fetching & updating...")
  },[getIsInstalled?.ExpandView]);


  // <-------------------- TEAMS DEPARTMENT FUNCTION ------------------->

  // IT'S TEAMS BASED PRIORITY & REQUEST TYPE.
  function getTeamDetails(data) {
    console.log("inside departments function", data);
    let ProcessTypeoptions3 = [];
    for (var y = 0; y < data.length; y++) {
      if (data[y].Nextonqueue == "Yes" && !isStringValidated(defaultteamCode)) {
        setDefltTeam(data[y].Onqueue);
      }
      ProcessTypeoptions3.push({
        text: data[y].Title,
        key: data[y].Onqueue,
        label: data[y].Title,
        value: data[y].Title,
        name: data[y].Title,
      });
    }
    ProcessTypeoptions3?.sort((a, b) => a?.text.localeCompare(b?.text)); // Teams Option Sorting Based on Text.
    setteamsoptionarray(ProcessTypeoptions3);
    console.log("teams option =>", ProcessTypeoptions3)
  }
  // <-------------------- PRIRORITY FUNCTION ------------------->

  function getPriorityFunction(data) {
    let ProcessTypeoptions1 = [];
    for (var y = 0; y < data.length; y++) {
      if (data[y].DefaultType == "Yes" && !isStringValidated(defaultPriority)) {
        setpriorityName(data[y].Title);
        setDefltPriority(data[y].Title);
      }
      ProcessTypeoptions1.push({ text: data[y].Title, key: data[y].Title });
    }

    ProcessTypeoptions1 = ProcessTypeoptions1?.sort((a, b) =>
      a?.text?.localeCompare(b?.text)
    );

    setpriorityoptions(ProcessTypeoptions1);
    let currentuser = ContextService.GetCurrentUser();
    let userid = ContextService.GetCurentUserId();
    let userdetails = [];
    userdetails.push({ id: userid, name: currentuser.displayName });
    setrequesterName(userdetails);
  }
  // <-------------------- REQUESTTYPE FUNCTION ------------------->


  function getRequestTypeFunction(data) {
    let ProcessTypeoptions1 = [];
    for (var y = 0; y < data.length; y++) {
      if (
        data[y].DefaultRequest == "Yes" &&
        !isStringValidated(DefaultRequestType)
      ) {
        setDefltReq(data[y].Title);
        setrequestName(data[y].Title);
      }
      ProcessTypeoptions1.push({ text: data[y].Title, key: data[y].Title });
    }
    ProcessTypeoptions1 = ProcessTypeoptions1?.sort((a, b) =>
      a?.text?.localeCompare(b?.text)
    );
    setrequestoptions(ProcessTypeoptions1);
  }

  // <-------------------- SERVICE FUNCTION ------------------->

  function getServiceFunction(data) {
    let ProcessTypeoptions1 = [];
    for (var y = 0; y < data.length; y++) {
      ProcessTypeoptions1.push({
        text: data[y].SubCategory,
        key: data[y].SubCategory,
        team: data[y].DepartCode,
        default: data[y].DefaultType,

      });
    }
    sethroptions(ProcessTypeoptions1);
  }
  // <-------------------- SUB SERVICE FUNCTION ------------------->

  function getSubServiceFunction(data) {
    let ProcessTypeoptions1 = [];
    for (var y = 0; y < data.length; y++) {
      ProcessTypeoptions1.push({
        text: data[y].SubServices,
        key: data[y].SubServices,
        services: data[y].MainServices,
        default: data[y].Enable,
      });
    }
    setSuboptions(ProcessTypeoptions1);
  }
  // <------------------ TEAMS DEPARTMENT ONCHANGE -------------->
  const handleTeamsOnChange = (event,
    item) => {
    // Empty State.
    setDefltSubService(null);
    setDefltService(null);
    setDefltTeam(item.key as string);
    setDepartmentName(item.text as string);
    let filteredService = hroptions.filter((items) => {
      return items.team == item.key;
    });
    filteredService = filteredService?.sort((a, b) => a?.text?.localeCompare(b?.text));

    setServiceOption(filteredService);
  }
  // <------------------ SERVICE ONCHANGE -------------->

  const handleServiceOnChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ) => {
    // Empty State.
    setDefltSubService(null);
    setDefltService(item.key as string);
    let filteredSubService = Suboptions.filter((items) => {

      return items.services?.toLowerCase() == String(item.key)?.toLowerCase();

    });
    filteredSubService = filteredSubService?.sort((a, b) => a?.text?.localeCompare(b?.text));
    setsubserviceOption(filteredSubService);
  }
  // <------------------ SUB SERVICE ONCHANGE -------------->

  const handleSubServiceOnChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ) => {
    setDefltSubService(item.key as string);
  }

  // <------------------ REQUEST TITLE ONCHANGE -------------->

  const onChangeRequestTitle = (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newText: string
  ): void => {
    const newMultiline = newText.length > 50;
    if (newMultiline !== isMultiline) {
      setIsMultiline(!isMultiline);
    }
    setTicketTitle(newText);
  };

  const onChangeDescription = (e, newText: string) => {
    setDescriptionValue(newText);
  }


  // <------------------ PRIORITY ONCHANGE -------------->

  const handlePriorityOnChange = (event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption) => {
    setDefltPriority(item.key as string);
  }

  // <------------------ REQUEST TYPE ONCHANGE -------------->
  const handleRequestTypeOnChange = (event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption) => {
    setDefltReq(item.key as string);
  }
  
  const handleExpandView = () =>{
    console.log("clicked")
    setExpandMode(true);
  }
  return (
    <>
      <SingleLayoutHeader
        propsData={{
          teamsoptionarray, handleTeamsOnChange, serviceOption, handleServiceOnChange, defltService, subserviceOption, handleSubServiceOnChange, defltSubService, priorityoptions,
          defltPriority, handlePriorityOnChange, handleRequestTypeOnChange,
          requestoptions, defltTeam, defltReq, closePanel, setClosePanel, ticketTitle,
          descriptionValue, requestname, requestername, setDefltTeam,
          setDefltService, setDefltSubService, setDefltPriority, setDefltReq, setTicketTitle, setDescriptionValue, departmentName
        }} />
      {
        getIsInstalled?.ExpandView !== Typed.Yes ? <div className="add-new-ticket-ui-style">
          {layoutOrder?.map((item, index) => {
            return (
              <Fragment key={index}>
                {item?.Name === "Title" && item?.isChecked === true ? <TextField
                  placeholder="Enter request title"   // <--- TITLE --->
                  multiline={isMultiline}
                  value={ticketTitle}
                  onChange={onChangeRequestTitle}
                /> :
                  item?.Name === "Teams" && item?.isChecked === true ? <Dropdown
                    options={teamsoptionarray}   // <--- TEAMS --->
                    onChange={handleTeamsOnChange}
                    placeholder="Select teams"
                    selectedKey={defltTeam}
                  /> : item?.Name === "Services" && item?.isChecked === true ? <Dropdown
                    options={serviceOption}           // <--- SERVICE --->
                    onChange={handleServiceOnChange}
                    placeholder="Select services"
                    selectedKey={defltService}
                  /> : item?.Name === "Sub Services" && item?.isChecked === true ? <Dropdown
                    options={subserviceOption}
                    onChange={handleSubServiceOnChange}
                    placeholder="Select sub services"      // <--- SUBSERVICE --->
                    selectedKey={defltSubService}
                  /> : item?.Name === "Description" && item?.isChecked === true ? <TextField
                    placeholder="Description..."   // <--- DESCRIPTION --->
                    multiline
                    rows={3}
                    value={descriptionValue}
                    onChange={onChangeDescription}
                  /> : item?.Name === "Request Type" && item?.isChecked === true ? <Dropdown
                    options={requestoptions}     // <--- REQUEST TYPE --->
                    onChange={handleRequestTypeOnChange}
                    placeholder="Select request type"
                    selectedKey={defltReq}
                  /> : item?.Name === "Priority" && item?.isChecked === true ? <Dropdown
                    options={priorityoptions}      // <--- PROIRTY --->
                    onChange={handlePriorityOnChange}
                    placeholder="Select priority"
                    selectedKey={defltPriority}
                  /> : null}
              </Fragment>
            )
          })}
        </div>

          : <div className="expand-query-request">
           <p> If you have any queries, please <Link onClick={handleExpandView}>click here</Link> to raise a request.</p>
              </div>
      }



    </>
  );
};

export default SingleLayoutAddNewTicket;

