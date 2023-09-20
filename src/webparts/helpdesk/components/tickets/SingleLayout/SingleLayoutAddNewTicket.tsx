import React, { useEffect, useState } from "react";
import { TextField } from "@fluentui/react";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { useAddNewApiStore } from "../../../store/apis_add-new-tickts/add-new-apis";

// TEAMS DEPARTMENT
let defaultteamCode = "";
// PRIRORITY
let defaultPriority = ''

// REQUEST TYPE
let DefaultRequestType = ''


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
  // <-------------------------- GETTING DATA ---------------------->
  const getTeamsDepartmentApi = useAddNewApiStore((state) =>
    state.getTeamsDepartmentApi()
  );
  const getPriorityApi = useAddNewApiStore((state) => state.getPriorityApi());
  const getRequestType = useAddNewApiStore((state) => state.getRequestType());
  const getService = useAddNewApiStore((state) => state.getService());
  const getSubService = useAddNewApiStore((state) => state.getSubService());

  // STATES
  // < ----------- REQUEST TITLE STATES -------------------------->

  const [isMultiline, setIsMultiline] = useState<boolean>(false);

  // < ----------- TEAMS DEPARTMENTS STATES -------------------------->
  const [defltTeam, setDefltTeam] = React.useState<string>(null);
  const [defltService, setDefltService] = React.useState<string>(null);
  const [serviceOption, setServiceOption] = React.useState([]);
  const [defltSubService, setDefltSubService] = React.useState<string>(null);
  const [subserviceOption, setsubserviceOption] = React.useState([]);

  const [teamsoptionarray, setteamsoptionarray] = React.useState([]); //M

  // < ----------- PRIORITY STATES -------------------------->
  const [priorityName, setpriorityName] = React.useState<string>();
  const [defltPriority, setDefltPriority] = React.useState<string>(null);
  const [priorityoptions, setpriorityoptions] = React.useState([]);

  // < ----------- REQUEST TYPE STATES -------------------------->

  const [requestoptions, setrequestoptions] = React.useState([]);
  const [defltReq, setDefltReq] = React.useState<string>(null);
  const [requestname, setrequestName] = React.useState<string>();

  // < ----------- SERVICE STATES -------------------------->

  const [hroptions, sethroptions] = React.useState([]);
  // < ----------- SUB SERVICE STATES -------------------------->

  const [Suboptions, setSuboptions] = React.useState([]);

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
  };
  return (
    <div className="add-new-ticket-ui-style">
      {/* Title ui */}
      <TextField
        placeholder="Enter request title"
        multiline={isMultiline}
        onChange={onChangeRequestTitle}
      />
      {/* Teams ui */}
      <Dropdown
        options={teamsoptionarray}
        onChange={handleTeamsOnChange}
        placeholder="Select teams"
        selectedKey={defltTeam}
      />

      {/* Service ui */}
      <Dropdown
        options={serviceOption}
        onChange={handleServiceOnChange}
        placeholder="Select services"
        selectedKey={defltService}
      />
      {/* Sub Service ui */}
      <Dropdown
        options={subserviceOption}
        onChange={handleSubServiceOnChange}
        placeholder="Select sub services"
        selectedKey={defltSubService}
      />
      {/* Description ui */}
      <TextField
        placeholder="Please Elaborate your query..."
        multiline
        rows={3}
      />
    </div>
  );
};

export default SingleLayoutAddNewTicket;
