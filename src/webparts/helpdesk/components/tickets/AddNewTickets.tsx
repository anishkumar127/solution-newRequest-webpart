import * as React from "react";
import {
  Dropdown,
  FontIcon,
  IChoiceGroupStyles,
  IDropdownOption,
  MessageBar,
  PrimaryButton,
  TextField,
  Shimmer,
  ShimmerElementType,
  ActionButton,
  IIconProps,
  DialogType,
  Dialog,
  DialogFooter,
  IDialogFooterStyles,
  IGroup,
  DatePicker
} from "office-ui-fabric-react";
import {
  ChoiceGroup,
  IChoiceGroupOption,
} from "@fluentui/react/lib/ChoiceGroup";
import { mergeStyleSets } from "office-ui-fabric-react/lib/Styling";
import { sp } from "@pnp/sp/presets/all";
import { ChoiceFieldFormatType, Items, Web, log } from "sp-pnp-js";
import { SPHttpClient, SPHttpClientResponse, MSGraphClientV3 } from "@microsoft/sp-http";
import {
  Label,
  Link,
  mergeStyles,
  ThemeProvider,

} from "@fluentui/react";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import ContextService from "../../loc/Services/ContextService";
import $ from "min-jquery";
import { IAttachmentFileInfo } from "@pnp/sp/attachments";
import styles from "../AllForm.module.scss";
import Homestyles from "../Homepage.module.scss";
import * as moment from 'moment';
import SettingService from "../../loc/Services/SettingService";
import Select from "react-select";
// let TicketDescription ='' // kam chalau -  dnt1 // issue coming from webpart. maybe creating list.etc.
// import { CurrentUser, From, SubServiceName, TicketDescription, TicketFields, Yes } from "HelpDeskWebPartStrings";
import { useBoolean } from "@fluentui/react-hooks";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { strings as Language, strings } from "../../loc/Strings";
import PropsUser from "../../loc/Services/PropsUser";
import ReusableSweetAlerts from "../../utils/SweetAlerts/ReusableSweetAlerts";
import { useCustomSwalContainerStyle } from "../../utils/SweetAlerts/useCustomSwalContainerStyle";
import { useCustomStyles } from "../../utils/SweetAlerts/useCustomStyles";
import AMDragDropAttach from "../attachments/AMDragDropAttach";
import { themeContext } from "../../context/userThemeContext";
import { useStore } from "../../store/zustand";
import Header from "./Header";


let _allItems;
let AprroversLevel = [];
let UpdateTicketsProperties
var currentLevel = 0;
let approvedOrPending = false;
let mgemail = "";
let defaultrole = "";
let rowId = "";
let servicesOptions = [];
let subservicesOptions = [];
let ticketSequence = "";
let ticketDescription = "";
let MSTeamsID = [];
let optionsArray2 = []
// let SiteUrl="";
let _groupOfColumnstoShow = [];
let _groupOfColumnstoShowandMand = [];
let _groupOfColumnstoHideandMand = [];
let Custom = [];
let userExist = true;
let setatt1 = [];
let setatt = [];
let fieldemploye = [];
let lastAssignid = [];
var SettingsCollection;
let TicketFieldsArrangementOrder;
let Choicearray = [];
let Choicesubarray = [];
let choicesubvalueoptions = [];
let Subcolumnvalueoption = [];
var dropvalues;
let selectedvalue = "";
let subcolumndropdownoptions = [];
var Suboptionsobject = {};
let generatedIssueID;
let Ticketarranageorder = [];
let FieldsNames;
let varTeamsPriorityOptions = "Off"
let MandatoryFields;
let allMandatoryFields;
let newMandatoryFields;
let RequiredColumnName;
let ColumnConditionValue;
let userName;
let HRoptionArray = [];
let ProcessTypeoptions1ForSubServices = [];
let ColumnProperties = [];
var AllColumnConditionsArray = [];
let MendetoryShowColumnConditionsArray = ['Title', 'Ticket Description', 'Teams', 'Requester', 'Request Type', 'Priority Type'];
let WorkFlowData = [];
let CustomEmailTemplates = [];
let varWorkFlowDataState = 'Yes'
let TicketFieldsForMember = [];
let TicketFieldsForUsers = [];
let TicketsFeidls = [];
let TicketFieldsMember = [];
let completeBusinessHours: any = [];
let TicketFieldsUsers = [];
let DargDropTicketFields = [];
let CustomDateData = {};
let varNewTickcets = '';
let VarNewTicketsTeams = [];
let MSTeamsCode = [];
let finalticketID = ''
var starRatinghtml = ''
let hrperurl1 = ''
let GetitemLeavlConut = [];
let ActionLeavlConut = [];
let varAutomationData = [];
let varPerformAutomationData = [];
let allTicketDescriptionColumns = []
let allDateTypeColumns = []
let _AutoAssignTicket = "";
let AutoAgentEmail;
let AutoRequestorEmail;
let AutoCCEmail;
let varAutoDelete = 'No';
let ExceptConstion = 'Yes';
let level2Subservices = []
let level3Subservices = [];
let StopAutoAssignMail = 'No'
let DefaultRequestType = ''
let defaultPriority = ''
let defaultteamCode = ''
let FinaltemplateForAutomation = {};
let columnConditionBasedRender = [];
function AddNewTickets(props) {
  // console.log("HHHHHHHHHHHH",SettingService);
  const getSettingsCollection = useStore((state) => state.getSettingsCollection());
  const getIsInstalled = useStore((state) => state.getIsInstalled());
  // console.log("OOOOOOOOOOOOK",getSettingsCollection);
  const { isTicketMailBox, RequestedFrom } = props;
  const customStylesselect = useCustomStyles(props.lightdarkmode);
  const [quillRender, ReactQuilRenderer] = React.useState('');
  const setExpandMode = useStore((state) => state.setExpandMode);

  let ThemeColor = React.useContext(themeContext)

  document.addEventListener('dragover', function (event) {
    // Check if the types array contains the "Files" string
    if (event.dataTransfer.types.indexOf('Files') !== -1) {

    } else {

    }
  });
  const [groups, setGroups] = React.useState<any[]>([])
  const [dateFormart, setDateFormat] = React.useState<any>("");
  const deleteIcon: IIconProps = { iconName: 'Cancel' };
  const [allDepartmentsData, setAllDepartmentsData] = React.useState([]);
  const AttachFontclass = mergeStyleSets({
    AttachColor: [{ color: props.lightdarkmode == 'light' ? 'var(--lightdarkColor) !important' : 'var(--lightdarkBGGray) !important' }],
  });

  React.useEffect(() => {
    const fetchGroups = async () => {
      // debugger

      let currentWebUrl = getIsInstalled?.SiteUrl;
      let requestUrl = currentWebUrl.concat('/_api/web/sitegroups');
      const response: SPHttpClientResponse = await
        ContextService.GetSPContext().get(
          `${requestUrl}`,
          SPHttpClient.configurations.v1
        );

      const data = await response.json();
      const groupData: IGroup[] = data?.value?.map((group: any) => {
        return {
          id: group.Id,
          name: group.Title
        };
      });
      setGroups(groupData);
    };

    fetchGroups();
  }, []);

  function addPermission(itemId) {


    var url = getIsInstalled?.SiteUrl + "/_api/web/roledefinitions/getbyname('Contribute')";
    ContextService.GetSPContext()
      .get(
        url,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "odata-version": "3.0",
          }
        }
      )
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((items: any) => {
        var url2 = getIsInstalled?.SiteUrl + `/_api/web/lists/getByTitle('HR365HDMTickets')/items(${parseInt(itemId)})/breakroleinheritance(copyRoleAssignments=false, clearSubscopes=true)`
        ContextService.GetSPContext()
          .post(
            url2,
            SPHttpClient.configurations.v1,
            {
              headers: {
                Accept: "application/json;odata=nometadata",
                "odata-version": "3.0",
              }


            }
          )
          .then((response: SPHttpClientResponse) => {
            return response.json();
          }).then(() => {

            for (var i = 0; i < allid.length; i++) {
              var urlassignment = getIsInstalled?.SiteUrl + `/_api/web/lists/GetByTitle('HR365HDMTickets')/items(${parseInt(itemId)})/RoleAssignments/AddRoleAssignment(PrincipalId=${allid[i]},RoleDefId=${items.Id})`
              ContextService.GetSPContext()
                .post(
                  urlassignment,
                  SPHttpClient.configurations.v1,
                  {
                    headers: {
                      Accept: "application/json;odata=nometadata",
                      "odata-version": "3.0",
                    }
                  }
                )
                .then((response: SPHttpClientResponse) => {
                  return response.json();
                })
            }
          })

      });
  }
  const reactQuillRef = React.useRef(null);
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]
  const [toolbarOptions] = React.useState([
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    // [{ 'direction': 'rtl' }],
    // [{ color: [] }, { background: [] }],
    // [{ script: "sub" }, { script: "super" }],
    // ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    // [{ indent: "-1" }, { indent: "+1" }],
    // [{ 'align': [] }],
    ["link", "image"],
    // ["clean"],
  ]);

  // let UnAssign = props.UnAssign;
  function CreateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  let DefaultCustomForm = [{ "FormName": "Default Ticket Request Form", "FormDescription": "This is the default ticket request form", "TicketField": "[{\"text\":\"Title\",\"MandCheck\":true,\"IntName\":\"Title\"},{\"text\":\"Teams\",\"MandCheck\":true,\"IntName\":\"Teams\"},{\"text\":\"Services\",\"MandCheck\":false,\"IntName\":\"Services\"},{\"text\":\"Sub Services\",\"MandCheck\":false,\"IntName\":\"Sub Services\"},{\"text\":\"Priority\",\"MandCheck\":true,\"IntName\":\"Priority\"},{\"text\":\"Requester\",\"MandCheck\":true,\"IntName\":\"Requester\"},{\"text\":\"Request Type\",\"MandCheck\":true,\"IntName\":\"Request Type\"},{\"text\":\"Ticket Description\",\"MandCheck\":true,\"IntName\":\"Ticket Description\"}]", "FormNumber": "1", "FormGuid": CreateGuid(), "DefaultForm": "Yes" }]
  const role = PropsUser.GetURole();
  let LicenseType = props.LicenseType;
  SettingsCollection = getSettingsCollection;
  function isArrayValidated(value) {
    if (value == null || value == undefined || value.length === 0) {
      return false;
    } else {
      return true;
    }
  }
  function isStringValidated(value) {
    if (value == null || value == undefined || value == "") {
      return false;
    } else {
      return true;
    }
  }


  const handlePaste = (e) => {
    const { items } = e.clipboardData || e.originalEvent.clipboardData;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.indexOf('image') === 0) {
        const file = item.getAsFile();
        const reader = new FileReader();

        reader.onload = () => {
          const quill = reactQuillRef.current.getEditor();
          const range = reactQuillRef.current.getSelection();

          quill.insertEmbed(range.index, 'image', reader.result, 'user');
          quill.setSelection(range.index + 1, 'silent');
        };

        reader.readAsDataURL(file);
      }
    }
  };

  const mediaOptions: IDropdownOption[] = [
    { key: 'Portal', text: Language.Portal ? Language.Portal : "Portal" },
    { key: 'Email', text: Language.Email ? Language.Email : "Email" },
    { key: 'Phone', text: Language.Phone ? Language.Phone : "Phone" },
    { key: 'Forms', text: Language.Forms ? Language.Forms : "Forms" },
    { key: 'Bot', text: Language.Bot ? Language.Bot : "Bot" },
    { key: 'Others', text: Language.Others ? Language.Others : "Others" },
  ]



  const [RichTextToolboxAddNew, setRichTextToolboxAddNew] = React.useState<string>('richTextToolboxAddnew');
  const [forrendeer, { toggle: forrendercontent }] = useBoolean(true);
  const [assignPlaceHolder, setAssignPlaceHolder] = React.useState<string>("");
  const [requestername, setrequesterName] = React.useState([]);
  const [requester, setrequester] = React.useState([]);
  const [Titlename, settitlename] = React.useState<string>();
  const [teamname, setteamname] = React.useState<string>();
  const [team, setteam] = React.useState<string>();
  const [servicename, setservicename] = React.useState<string>();
  const [servicename2, setservicename2] = React.useState<string>();
  const [subservicename, setsubservicename] = React.useState<string>();
  const [priorityName, setpriorityName] = React.useState<string>();
  const [requestname, setrequestName] = React.useState<string>();
  const [hroptions, sethroptions] = React.useState([]);
  const [Suboptions, setSuboptions] = React.useState([]);
  const [attachname, setattachName] = React.useState<string>();
  const [priorityoptions, setpriorityoptions] = React.useState([]);
  const [serviceOption, setServiceOption] = React.useState([]);
  const [subserviceOption, setsubserviceOption] = React.useState([]);
  const [globalMessage, setGlobalMessage] = React.useState<string>("");
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [newerror, setNewerror] = React.useState(false);
  const [RequiredColumnMessage, setRequiredColumnMessage] = React.useState(false);
  const [newerror2, setNewerror2] = React.useState(false);
  const [newerror3, setNewerror3] = React.useState(false);
  const [newerror4, setNewerror4] = React.useState(false);
  const [newerror5, setNewerror5] = React.useState(false);
  const [newerror6, setNewerror6] = React.useState(false);
  const [newerror7, setNewerror7] = React.useState(false);
  const [newerror8, setNewerror8] = React.useState(false);
  const [newerrorService, setNewerrorService] = React.useState(false);
  const [newerrorSubService, setNewerrorSubService] = React.useState(false);
  const [MultipalChoiceData, setMultipalChoiceData] = React.useState([]);
  // const [FinalForAutomationCall, setFinalForAutomationCall] = React.useState([]);
  // AllColumnConditionsArray = AllColumnConditionsArray.concat(ColumnConditionValue);
  const [allid, setallid] = React.useState<any>([])
  const [AllColumnConditionsArrayState, setAllColumnConditionsArrayState] = React.useState([]);
  const [attachFile1, setattachFile1] = React.useState([]);
  const [attachFile2, setattachFile2] = React.useState([]);
  const [attachFile, setattachFile] = React.useState([]);
  const [attachFilename, setattachFilename] = React.useState([]);
  const [attachFileUrl1, setattachFileUrl1] = React.useState<any>();
  const [ticketId, setTicketId] = React.useState<string>("");
  const [selectedPrefix, setSelectedPrefix] = React.useState<string>();
  const [selectedTitle, setSelectedTitle] = React.useState<string>();
  const SendIcon: IIconProps = { iconName: "Send" };
  // const [ticketSuffixTeam, setTicketSuffixTeam] = React.useState<string>("");
  // const [ticketteam, setTicketTeam] = React.useState<String>("");
  const [fullname, setFullName] = React.useState(false);//M
  const [MediaFieldToShow, setMediaFieldToShow] = React.useState(false);
  const [ColumnConditions, setColumnConditions] = React.useState([]);
  const [level2SubServiceOptions, setlevel2SubServiceOptions] = React.useState([]);
  const [level3SubserviceOptions, setlevel3SubserviceOptions] = React.useState([]);
  const [level2SubServiceAllOptions, setlevel2SubServiceAllOptions] = React.useState([]);
  const [level3SubserviceAllOptions, setlevel3SubserviceAllOptions] = React.useState([]);
  const [level2SubServicedefault, setlevel2SubServicedefault] = React.useState('');
  const [level3Subservicedefault, setlevel3Subservicedefault] = React.useState('');
  //for Consition based
  const [isTeamsCondition, setisTeamsCondition] = React.useState(false);
  const [isServicesCondition, setisServicesCondition] = React.useState(false);
  const [isSubServCondition, setisSubServCondition] = React.useState(false);
  const [isReqTypeCondition, setisReqTypeCondition] = React.useState(false);
  const [isPriorityCondition, setisPriorityCondition] = React.useState(false);



  // const [autoTicket, setAutoTicket] = React.useState<string>("");
  // const [autoAssignMethod, setAutoAssignMethod] = React.useState<string>("");
  const [teamsData, setTeamsData] = React.useState([]);
  const [userList, setTUserList] = React.useState([]);
  const [lastAssign, setLastAssign] = React.useState([]);
  const [assignTo, setAssignTo] = React.useState([]);
  const [requesterEmailId, setRequesterEmailId] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [ticketOrder, setTicketOrder] = React.useState([]);
  // const [FieldsNames, setFieldsNames] = React.useState([]);
  const [WorkFlowDataIndex, setWorkFlowDataIndex] = React.useState<Number>();
  const [ButtonSaveText, setButtonSaveText] = React.useState<string>(
    Language.Submit ? Language.Submit : "Submit"
  );
  const [generatedTicketID, setgeneratedTicketID] = React.useState('');
  const [ccemailid, setccemailid] = React.useState<string>("");


  const wrapperClass = mergeStyles({
    padding: 2,
    // background: transparent !important,#1f1f1f
    background: ThemeColor == "dark" ? "#141414 !important" : "#ffffff",
    // background:"transparent !important",
    ".ms-Shimmer-shimmerWrapper": {
      background: ThemeColor === "dark" ? "#313131" : "#f3f2f1"
    },
    ".ms-Shimmer-shimmerGradient": {
      background: ThemeColor === "dark" ? "linear-gradient(to right, rgb(49, 49, 49) 0%, rgb(63, 63, 63) 50%, rgb(49, 49, 49) 100%) 0px 0px / 90% 100% no-repeat rgb(49, 49, 49)" : "linear-gradient(to right, rgb(243, 242, 241) 0%, rgb(237, 235, 233) 50%, rgb(243, 242, 241) 100%) 0px 0px / 90% 100% no-repeat rgb(243, 242, 241)"

    },
    ".ms-ShimmerGap-root": {
      background: ThemeColor === "dark" ? "#141414 !important" : "#ffffff",

      borderColor: ThemeColor === "dark" ? "#141414 !important" : "#ffffff",
    },
    ".ms-ShimmerLine-topLeftCorner": {
      fill: ThemeColor === "dark" ? "#313131" : "#ffffff",

    },
    ".ms-ShimmerLine-topRightCorner": {
      fill: ThemeColor === "dark" ? "#313131" : "#ffffff",

    },
    ".ms-ShimmerLine-bottomLeftCorner": {
      fill: ThemeColor === "dark" ? "#313131" : "#ffffff",

    },
    ".ms-ShimmerLine-bottomRightCorner": {
      fill: ThemeColor === "dark" ? "#313131" : "#ffffff",

    },
    selectors: {
      "& > .ms-Shimmer-container": {
        margin: "10px 0",
      },
    },
  });

  const shimmerWithElementFirstRow = [
    { type: ShimmerElementType.line, height: 30, width: '50%' },
    { type: ShimmerElementType.gap, width: '2%' },
    { type: ShimmerElementType.line, height: 30, width: '50%' },
    { type: ShimmerElementType.gap, height: 30 },
    // { type: ShimmerElementType.gap, width: '100%' }
  ];
  const shimmerWithElementSecondRow = [
    { type: ShimmerElementType.line, height: 30, width: '50%' },
    { type: ShimmerElementType.gap, width: '2%' },
    { type: ShimmerElementType.line, height: 30, width: '50%' },
    { type: ShimmerElementType.gap, height: 30 },
    // { type: ShimmerElementType.gap, width: '100%' }
  ];
  const shimmerWithElementThirdRow = [
    { type: ShimmerElementType.line, height: 30, width: '50%' },
    { type: ShimmerElementType.gap, width: '2%' },
    { type: ShimmerElementType.line, height: 30, width: '50%' },
    { type: ShimmerElementType.gap, height: 30 },
  ];
  const shimmerWithElementFourthRow = [
    { type: ShimmerElementType.line, height: 30, width: '50%' },
    { type: ShimmerElementType.gap, width: '2%' },
    { type: ShimmerElementType.line, height: 30, width: '50%' },
    { type: ShimmerElementType.gap, height: 30 },
  ];
  const shimmerWithElementFifthRow = [
    { type: ShimmerElementType.line, height: 60, width: '100%' },
    { type: ShimmerElementType.gap, height: 30 },
    // { type: ShimmerElementType.gap, width: '2%' },
  ];
  // const AttachmentIcon: any = require("../../../../../assets/Attachment.png");
  const [TicketPropertiesValue, setTicketPropertiesValue] = React.useState([]);
  const [TicketPropJOSNUpdate, setTicketPropJOSNUpdate] = React.useState([]);
  const [columnProprties, setColumnProprties] = React.useState([]);
  const [subcolumnProprties, setSubColumnProprties] = React.useState([]);
  const [columnDescription, setColumnDescription] = React.useState([]);
  const [externalDomain, setExternalDomain] = React.useState<string>("");
  const [defaultAsignee, setDefaultAsignee] = React.useState("");
  const [teamsoption, setteamsoptions] = React.useState([]);
  const [CustomFormData, setCustomFormData] = React.useState([]);
  const [SelectedCustomFormData, setSelectedCustomFormData] = React.useState([]);
  const [CustomFormOptions, setCustomFormOptions] = React.useState([]);
  const [teamsoptionarray, setteamsoptionarray] = React.useState([]);  //M
  const [teamDisable, setTeamDisable] = React.useState(false);
  const [priorityDisable, setPriorityDisable] = React.useState(false);
  const [requestDisable, setRequestDisable] = React.useState(false);
  const [serviceDisable, setServiceDisable] = React.useState(false);
  const [subserviceDisable, setsubserviceDisable] = React.useState(false);
  const [DescBox, setDescBox] = React.useState(false);
  const [IgnoreUptoMBValue, setIgnoreUptoMBValue] = React.useState<any>();
  const [selectdefaultservies2, setselectdefaultservies2] = React.useState<string>("");
  const [defaultserviesvalidation, setdefaultserviesvalidation] = React.useState(false);
  const [defaultsubserviesvalidation, setdefaultsubserviesvalidation] = React.useState(false);

  const [defltPriority, setDefltPriority] = React.useState<string>(null);
  const [defltTeam, setDefltTeam] = React.useState<string>(null);
  const [CustomFormID, setCustomFormID] = React.useState<string>('');
  const [defltReq, setDefltReq] = React.useState<string>(null);
  const [defltService, setDefltService] = React.useState<string>(null);
  const [defltSubService, setDefltSubService] = React.useState<string>(null);
  const [emailTemplate, setEmailTemplate] = React.useState([]);
  const [reqName, setReqName] = React.useState<string>("");
  const [TicketreqName, setTicketreqName] = React.useState<string>("");
  const [mediaChoosed, setMediaChoosed] = React.useState("Portal");
  const [DefaultFormGuid, setDefaultFormGuid] = React.useState("");
  const [DefaultFormGuidValue, setDefaultFormGuidValue] = React.useState("");

  const [isCustomFormChoice, isetsCustomFormChoice] = React.useState(false);


  // const [SiteUrlstate,setSiteUrlstate]=React.useState<string>("");
  //Single Line Text
  const [dataText, setdataText] = React.useState({});
  const [dataNote, setdataNote] = React.useState({});
  const [dataNumber, setdataNumber] = React.useState({});
  const [dataLink, setdataLink] = React.useState({});
  const [dataChoiceforsub, setdataChoiceforsub] = React.useState({});
  const [dataChoice2, setdataChoice2] = React.useState({});
  const [Dateofbirth, setDateofbirth] = React.useState<Date | undefined>();
  // const [CustomDateData, setCustomDateData] = React.useState([]);
  const [requestoptions, setrequestoptions] = React.useState([]);
  const [obpeople, setobpeople] = React.useState([]);
  const [optionsexcusers, setoptionsexcusers] = React.useState([]);
  const [iconHideMBNavClass, seticonHideMBNavClass] =
    React.useState("hideMBCancel");
  const [iconHideMBNavClassnew, seticonHideMBNavClassnew] =
    React.useState("hideMBCancelnew");


  const [SLAResponseDone, setSLAResponseDone] = React.useState("No");
  const [SLAResponseInfo, setSLAResponseInfo] = React.useState([]);
  const [SLAResolveDone, setSLAResolveDone] = React.useState("No");
  const [SLAResolveInfo, setSLAResolveInfo] = React.useState([]);


  const choiceGroupStyles: IChoiceGroupStyles = {
    root: {
      flex: "0 1 25%",
      "label::after": {
        borderColor: props.lightdarkmode == 'light' ? 'var(--lightdarkColor) !important' : 'var(--lightdarkBGGray) !important',
      },
      "label:hover::after": {
        borderColor: props.lightdarkmode == 'light' ? 'var(--lightdarkColor) !important' : 'var(--lightdarkBGGray) !important',
      },
      "label::before": {
        borderColor: props.lightdarkmode == 'light' ? 'var(--lightdarkColor) !important' : 'var(--lightdarkBGGray) !important',
      },
      "label:hover::before": {
        borderColor: props.lightdarkmode == 'light' ? 'var(--lightdarkColor) !important' : 'var(--lightdarkBGGray) !important',
      },
    },
    flexContainer: {
      display: "flex",
      justifyContent: "initial",
      width: "100%",
      // columnGap: '50px',
    },
  };


  let TeamTicketSuffix = isStringValidated(SettingsCollection.SuffixDepartmentName) ? SettingsCollection.SuffixDepartmentName : "";
  let FullDepartmentName = isStringValidated(SettingsCollection.FullDepartmentName) ? SettingsCollection.FullDepartmentName : "";
  let AutoAssignTicket = isStringValidated(SettingsCollection.AutoAssign) ? SettingsCollection.AutoAssign : "";
  let AutoAssignTicketMethod = isStringValidated(SettingsCollection.AutoAssignMethod) ? SettingsCollection.AutoAssignMethod : "";
  let TicketFieldsArrangement = isStringValidated(SettingsCollection.TicketFieldsArrangement) ? SettingsCollection.TicketFieldsArrangement : "";
  let EmailsFromMailbox = isStringValidated(SettingsCollection.EmailsFromMailbox) ? SettingsCollection.EmailsFromMailbox : "";
  // let FullDepartmentName = SettingsCollection.FullDepartmentName

  const [isDialogVisibleAccessDenied, { setTrue: showDialogAccessDenied, setFalse: hideDialogAccessDenied }] = useBoolean(false);
  const dialogContentAccessDenied = {
    type: DialogType.normal,
    title: `${Language.AccessDenied ? Language.AccessDenied : 'Access Denied'}`,
    // subText: `${strings.AccessDeniedMessage}`
  }

  const dialogModalProps = {
    isBlocking: true,
    styles: { main: { maxWidth: 450 } },
  };

  const onHideDialogAccessDenied = React.useCallback(
    ev => {
      ev.preventDefault();
      hideDialogAccessDenied();
    },
    [hideDialogAccessDenied],
  );

  function accessDenied() {
    hideDialogAccessDenied()
  }

  const DialogFooterStyles: IDialogFooterStyles = {
    actions: "",
    actionsRight: {
      textAlign: 'center',
      marginRight: '0px',
    },
    action: ""
  }


  React.useEffect(() => {
    getCustomCoulmns();
    getSubServiceFunction();
    getServiceFunction();
    getSubServiceLevelsFunction();
    getBusinessHours();
    //fillOptionsOfTeamsDropdown();
    if (FullDepartmentName == "On") {
      setFullName(true);
    }
    else {
      setFullName(false);
    }

  }, []);

  React.useEffect(() => {

  }, [CustomDateData]);

  function getSettings() {
    let web = new Web(getIsInstalled?.SiteUrl);
    web.lists
      .getByTitle("HR365HDMSettings")
      .items.get().then(async (rawdata) => {
        //var _all = rawdata.d.results;
        for (var y = 0; y < rawdata?.length; y++) {
          // 
          var id = rawdata[y]?.ID;
          var Titlename = rawdata[y]?.TitlenameName;
          var teamtile = rawdata[y]?.TeamDisplayName;
          var SequenceTitle = rawdata[y]?.SequenceTitle;
          var TicketPrefix = rawdata[y]?.TicketPrefix;
          let getDate = rawdata[y]?.Dateformat;
          setDateFormat(getDate);
          var CustomFormData = isStringValidated(rawdata[y]?.CustomFormSettings) ? JSON.parse(rawdata[y]?.CustomFormSettings) : [];
          let varBotSettings = isStringValidated(rawdata[y]?.BotSettings) ? (JSON.parse(rawdata[y]?.BotSettings)) : []
          let TeamsPriorityOptions = isArrayValidated(rawdata[y]?.TeamsPriorityOptions) ? rawdata[y]?.TeamsPriorityOptions : 'Off';
          if (TeamsPriorityOptions == 'On') {
            varTeamsPriorityOptions = "On"
          } else {
            varTeamsPriorityOptions = "Off"
          }
          // setIgnoreUptoMBValue(rawdata[y]?.IgnoreUptoMBValue);
          varNewTickcets = isArrayValidated(varBotSettings) ? varBotSettings[0]?.NewTicketsToggle : '';
          VarNewTicketsTeams = isArrayValidated(varBotSettings) ? varBotSettings[0]?.NewTicketsTeams : '';

          for (let i = 0; i < VarNewTicketsTeams?.length; i++) {

            let SplitName = VarNewTicketsTeams[i]?.substr(('Helpdesk 365 ')?.length);

            MSTeamsCode?.push(SplitName);
          };
          if (rawdata[y]?.ColumnConditions == null || rawdata[y]?.ColumnConditions == undefined || rawdata[y]?.ColumnConditions == "") {
            ColumnConditionValue = "";
          } else {
            ColumnConditionValue = JSON.parse(rawdata[y]?.ColumnConditions);

            let ConditionBaseCulms = []
            ColumnConditionValue?.map((x) => {
              if (x?.Conditions) {
                x?.Conditions?.map(y => ConditionBaseCulms?.push(y))
              }
            })
            // columnConditionBasedRender =ColumnConditionValue;
            columnConditionBasedRender = columnConditionBasedRender.concat(ConditionBaseCulms);

            console.log(ConditionBaseCulms);
            // AllColumnConditionsArray = AllColumnConditionsArray?.concat(ConditionBaseCulms);

            // AllColumnConditionsArray.map((item)=>{
            //   return(

            //    // document.getElementById(item.IntName).style.display = 'none'
            //   )
            // })

            // setAllColumnConditionsArrayState(AllColumnConditionsArray);
            // setColumnConditions([...ConditionBaseCulms]);
          }


          // var SuffixDepartmentName = rawdata[y].SuffixDepartmentName;
          // var FullDepartmentName = rawdata[y].FullDepartmentName;
          // var AutoAssignTicket = rawdata[y].AutoAssign;
          // var autoAsTicketMethod = rawdata[y].AutoAssignMethod;
          var Ticketarranage = rawdata[y]?.TicketFieldsArrangement;
          var TicketFieldsArrangement = rawdata[y]?.TicketFieldsArrangement;
          var defaultAssigneename = rawdata[y]?.DefaultAssignee;
          var externalDomain = rawdata[y]?.AllowedExtrenalDomain;
          WorkFlowData = JSON.parse(rawdata[y]?.WorkFlows);
          // var SiteUrl = rawdata[y].SiteUrl;
          // setTeamTitle(teamtile);
          if (externalDomain == null) {
            externalDomain = "notpresent";
          }
          // setSiteUrlstate(SiteUrl);

          // let newval = SuffixDepartmentNamevl.;
          setExternalDomain(externalDomain);
          setDefaultAsignee(defaultAssigneename);
          isArrayValidated(CustomFormData) ?
            setCustomFormData(CustomFormData) :
            setCustomFormData([]);
          let _CustomFormData = isArrayValidated(CustomFormData) ? CustomFormData : [];
          let _Options = [];
          if (_CustomFormData?.length > 1) {
            isetsCustomFormChoice(true);
          } else if (_CustomFormData?.length <= 1) {
            isetsCustomFormChoice(false);
          }

          if (_CustomFormData != "" || _CustomFormData.length != 0) {
            // {isArrayValidated(_CustomFormData) ? 
            _CustomFormData?.map((item) => {
              _Options?.push({ text: item?.FormName, key: item?.FormGuid, label: item?.FormName, value: item?.FormGuid });
            })
            // : null}
            _Options = _Options?.sort((a, b) => a?.text?.localeCompare(b?.text));
            setCustomFormOptions(_Options);
            // let DefalutData;
            let DefalutData = _CustomFormData?.filter((itemValue) => {
              return itemValue?.DefaultForm == "Yes";
            })
            setSelectedCustomFormData(DefalutData);
            if (DefalutData != "" || DefalutData.length != 0) {
              setDefaultFormGuid(DefalutData[0]?.FormGuid);

              if (DefalutData[0]?.DefaultTeamCode != "" || DefalutData[0]?.DefaultTeamCode != null || DefalutData[0]?.DefaultTeamCode != undefined) {
                var filteredService = HRoptionArray?.filter((items) => {
                  return items?.team == DefalutData[0]?.DefaultTeamCode;
                });
                filteredService = filteredService?.sort((a, b) => a?.text?.localeCompare(b?.text));
                setServiceOption(filteredService);

                if (defaultserviesvalidation == true) {
                  var dfltser = filteredService?.filter((items) => {
                    return items?.default == "Yes";
                  });
                }
                var subservicefilter = Suboptions?.filter((items) => {
                  if (dfltser?.length > 0) {
                    return items?.services == dfltser[0]?.key;
                  }
                });
                if (defaultsubserviesvalidation == true) {
                  var dfltsubser = subservicefilter?.filter((items) => {
                    return items?.default == "Yes";
                  });
                }
                if (dfltser != undefined || dfltser != null) {
                  if (dfltser?.length > 0) {
                    setDefltService(dfltser[0]?.key);
                    console.log("setDefltService", setDefltService)
                    setservicename(dfltser[0]?.key);
                  }
                }
                if (dfltser != undefined || dfltser != null) {
                  if (dfltsubser?.length > 0) {
                    setDefltSubService(dfltsubser[0]?.key);
                    setsubservicename(dfltsubser[0]?.key);
                  }
                }
                subservicefilter = subservicefilter?.sort((a, b) => a?.text?.localeCompare(b?.text));
                setsubserviceOption(subservicefilter);
              }
              setDefltReq(DefalutData[0]?.DefaultRequestType);
              DefaultRequestType = DefalutData[0]?.DefaultRequestType;
              setrequestName(DefalutData[0]?.DefaultRequestType);
              setpriorityName(DefalutData[0]?.DefaultPriority);
              defaultPriority = DefalutData[0]?.DefaultPriority;
              setDefltPriority(DefalutData[0]?.DefaultPriority);
              setDefaultFormGuidValue(DefalutData[0]?.FormName);
              setDefltTeam(DefalutData[0]?.DefaultTeamCode);
              setCustomFormID(DefalutData[0]?.FormGuid);
              setteamname(DefalutData[0]?.DefaultTeamCode);
              defaultteamCode = DefalutData[0]?.DefaultTeamCode
              setteam(DefalutData[0]?.DefaultTeamName);
              let TicFields = JSON.parse(DefalutData[0]?.TicketField)
              let _FNames = [];
              let TicketFieldsCustomArrange;
              let _FNamesAndMand = [];

              TicFields?.map((i) => {
                let _customcolValues = ColumnProperties?.filter((I) => {
                  return I[0]?.InternalName == i?.IntName
                })
                let _cusTvalues = "";
                if (_customcolValues?.length > 0) {
                  //  _cusTvalues = _customcolValues[0][0].ChoiceValue;
                  _FNames?.push({ DisplayName: i?.text, InternalName: i?.IntName, Type: i?.Type, values: _customcolValues[0][0]?.ChoiceValue, DefultValue: _customcolValues[0][0].DefultValue });
                } else {
                  if (!i?.IntName?.includes("HDPCC")) {
                    _FNames?.push({ DisplayName: i?.text, InternalName: i?.IntName, Type: i?.Type, values: "", DefultValue: i?.DefultValue });
                  }
                }

                if (i?.MandCheck == true) {
                  _FNamesAndMand?.push(i?.IntName);
                }
              })
              Ticketarranage = _FNames;
              FieldsNames = _FNames;
              MandatoryFields = _FNamesAndMand;
              newMandatoryFields = MandatoryFields
              allMandatoryFields = _FNamesAndMand
              TicketFieldsCustomArrange = _FNames;
              Ticketarranageorder = [];
              // Ticketarranage = Ticketarranage.split('|,|')
              // for (var i = 0; i < Ticketarranage.length; i++) {
              //   if (Ticketarranage[i] == 'Title') {

              //     Ticketarranageorder.push("titleOrder");

              //   } else if (Ticketarranage[i] == 'Priority') {

              //     Ticketarranageorder.push("prioOrder");

              //   } else if (Ticketarranage[i] == "Request Type") {

              //     Ticketarranageorder.push("requestTypeOrder");

              //   } else if (Ticketarranage[i] == 'Services') {

              //     Ticketarranageorder.push("serviceOrder");

              //   } else if (Ticketarranage[i] == 'Sub Services') {

              //     Ticketarranageorder.push("subserviceOrder");

              //   } else if (Ticketarranage[i] == "Requester") {

              //     Ticketarranageorder.push("requesterOrder");

              //   } else if (Ticketarranage[i] == "Teams") {

              //     Ticketarranageorder.push("teamOrder");

              //   } else if (Ticketarranage[i] == 'Ticket Description') {

              //     Ticketarranageorder.push("DescriptionOrder");

              //   }

              // }



              // setTicketOrder(Ticketarranageorder);
              setTicketOrder(TicketFieldsCustomArrange);



              // await getCustomCoulmns();
              // setTimeout(function () {

              //   $.grep(AllColumnConditionsArray, function (v) {
              //     if (v.IntName != null && v.IntName != "") {
              //       var allsubcols = v.IntName.split(',');
              //       allsubcols.forEach(element => {
              //         var found_column = $.grep(TicketFieldsCustomArrange, (ele) => {
              //           return v.mainColumnIntName.toLowerCase() == ele.InternalName.toLowerCase();
              //         })
              //         if (document.getElementById(element) != null && found_column.length != 0) {
              //           MandatoryFields = MandatoryFields?.filter((J) => {
              //             return element != J
              //           });
              //           document.getElementById(element).style.display = 'none';
              //         }
              //       });
              //     }
              //   });
              // }, 1000)
              setServiceDisable(true);
              setRequestDisable(true);
              setTeamDisable(true);
              setPriorityDisable(true);
              setsubserviceDisable(true);
              // getCustomCoulmns();
            } else {
              //  setColumnProprties([]);
              // else{
              Ticketarranageorder = [];
              let UptdatedTicketarranage = [];
              if (TicketFieldsUsers == null || TicketFieldsUsers == undefined || TicketFieldsMember == null || TicketFieldsMember == undefined || TicketFieldsMember.length == 0 || TicketFieldsUsers.length == 0) {

                Ticketarranage = Ticketarranage.concat('|,|Ticket Description');
                Ticketarranage = Ticketarranage.split('|,|')

              } else {
                if (role == 'User') {
                  Ticketarranage = TicketFieldsUsers;
                  Ticketarranage = Ticketarranage

                } else {
                  Ticketarranage = TicketFieldsMember;
                  Ticketarranage = Ticketarranage
                }
              }
              //Ticketarranage = Ticketarranage.concat('Ticket Description')
              Ticketarranage.map((item) => {
                UptdatedTicketarranage.push({ InternalName: item, DisplayName: item, Type: "NotSet" })
              })
              ColumnProperties.map((i) => {
                if (i[0].ChoiceValue.length > 0) {
                  UptdatedTicketarranage.push({ DisplayName: i[0].DisplayName, InternalName: i[0].InternalName, Type: i[0].Type, values: i[0].ChoiceValue, DefultValue: i[0].DefultValue });
                } else {
                  UptdatedTicketarranage.push({ DisplayName: i[0].DisplayName, InternalName: i[0].InternalName, Type: i[0].Type, values: "", DefultValue: i[0].DefultValue });
                }
              })
              MandatoryFields = "Title,Priority,Request Type,Ticket Description,Requester,Teams";
              allMandatoryFields = MandatoryFields?.split(',');
              MandatoryFields = MandatoryFields?.split(',');
              newMandatoryFields = MandatoryFields
              Ticketarranage = Ticketarranage.concat('Ticket Description');
              //Ticketarranage = Ticketarranage.split('|,|')
              setTicketOrder(UptdatedTicketarranage);


              setTimeout(function () {

                $.grep(AllColumnConditionsArray, function (v) {
                  if (v.IntName != null && v.IntName != "") {
                    var allsubcols = v.IntName.split(',');
                    allsubcols.forEach(element => {
                      var found_column = $.grep(UptdatedTicketarranage, (ele) => {
                        return v.mainColumnIntName.toLowerCase() == ele.InternalName.toLowerCase();
                      })

                      if (document.getElementById(element) != null && found_column.length == 0) {
                        document.getElementById(element).style.display = 'none';
                      }
                    });
                  }
                });
              }, 1500)
              forrendercontent();
              // await getCustomCoulmns();

              // }


            }

          }
          else {
            //  setColumnProprties([]);
            // else{
            Ticketarranageorder = [];
            let UptdatedTicketarranage = [];
            // Ticketarranage = Ticketarranage.concat('|,|Ticket Description');
            // Ticketarranage = Ticketarranage.split('|,|')
            if (TicketFieldsUsers == null || TicketFieldsUsers == undefined || TicketFieldsMember == null || TicketFieldsMember == undefined || TicketFieldsMember.length == 0 || TicketFieldsUsers.length == 0) {

              Ticketarranage = Ticketarranage.concat('|,|Ticket Description');
              Ticketarranage = Ticketarranage.split('|,|')

            } else {

              if (role == 'User') {
                Ticketarranage = TicketFieldsUsers;
                Ticketarranage = Ticketarranage
              } else {
                Ticketarranage = TicketFieldsMember;
                Ticketarranage = Ticketarranage
              }
              //Ticketarranage = Ticketarranage.concat('Ticket Description');
              ///Ticketarranage = Ticketarranage.split('|,|')
            }
            Ticketarranage.map((item) => {
              UptdatedTicketarranage.push({ InternalName: item, DisplayName: item, Type: "NotSet" })
            })
            if (LicenseType.toLowerCase() == "p4" || LicenseType.toLowerCase() == "trial") {
              ColumnProperties.map((i) => {
                if (i[0].ChoiceValue.length > 0) {
                  if (Ticketarranage.includes(i[0].DisplayName)) {

                    UptdatedTicketarranage.push({ DisplayName: i[0].DisplayName, InternalName: i[0].InternalName, Type: i[0].Type, values: i[0].ChoiceValue, DefultValue: i[0].DefultValue });
                  }
                } else {
                  if (Ticketarranage.includes(i[0].DisplayName)) {

                    UptdatedTicketarranage.push({ DisplayName: i[0].DisplayName, InternalName: i[0].InternalName, Type: i[0].Type, values: "", DefultValue: i[0].DefultValue });
                  }
                }
              })
            }

            MandatoryFields = "Title,Priority,Request Type,Ticket Description,Requester,Teams";
            allMandatoryFields = MandatoryFields?.split(',')
            MandatoryFields = MandatoryFields?.split(',');
            newMandatoryFields = MandatoryFields
            // for (var i = 0; i < Ticketarranage.length; i++) {
            //   if (Ticketarranage[i] == 'Title') {

            //     Ticketarranageorder.push("titleOrder");

            //   } else if (Ticketarranage[i] == 'Priority') {

            //     Ticketarranageorder.push("prioOrder");

            //   } else if (Ticketarranage[i] == "Request Type") {

            //     Ticketarranageorder.push("requestTypeOrder");

            //   } else if (Ticketarranage[i] == 'Services') {

            //     Ticketarranageorder.push("serviceOrder");

            //   } else if (Ticketarranage[i] == 'Sub Services') {

            //     Ticketarranageorder.push("subserviceOrder");

            //   } else if (Ticketarranage[i] == "Requester") {

            //     Ticketarranageorder.push("requesterOrder");

            //   } else if (Ticketarranage[i] == "Teams") {

            //     Ticketarranageorder.push("teamOrder");

            //   } else if (Ticketarranage[i] == 'Ticket Description') {

            //     Ticketarranageorder.push("DescriptionOrder");

            //   }

            // }
            setTicketOrder(UptdatedTicketarranage);
            setTimeout(function () {

              $.grep(AllColumnConditionsArray, function (v) {
                if (v.IntName != null && v.IntName != "") {
                  var allsubcols = v.IntName.split(',');
                  // document.getElementById(v.IntName).style.display = 'none';
                  allsubcols.forEach(element => {
                    var found_column = $.grep(UptdatedTicketarranage, (ele) => {
                      return v.mainColumnIntName.toLowerCase() == ele.InternalName.toLowerCase();
                    })
                    if (document.getElementById(element) != null && found_column.length != 0) {
                      document.getElementById(element).style.display = 'none';
                    }
                  });
                }
              });
            }, 1500)
            forrendercontent();
            // await getCustomCoulmns();

            // }


          }
          // else{
          //   Ticketarranageorder = [];
          //   Ticketarranage = Ticketarranage.concat('|,|Ticket Description');
          //   Ticketarranage = Ticketarranage.split('|,|')
          //   MandatoryFields="Title,Priority,Request Type,Ticket Description,Requester,Teams";
          //   MandatoryFields=MandatoryFields?.split(',');
          // for (var i = 0; i < Ticketarranage.length; i++) {
          //   if(Ticketarranage[i]=='Title'){

          //     Ticketarranageorder.push( "titleOrder");

          //   }else  if(Ticketarranage[i]=='Priority'){

          //     Ticketarranageorder.push( "prioOrder");

          //   }else  if(Ticketarranage[i]=="Request Type"){

          //     Ticketarranageorder.push( "requestTypeOrder");

          //   }else  if(Ticketarranage[i]=='Services'){

          //     Ticketarranageorder.push( "serviceOrder");

          //   }else if (Ticketarranage[i] == 'Sub Services') {

          //     Ticketarranageorder.push("subserviceOrder");

          //   }else  if(Ticketarranage[i]=="Requester"){

          //     Ticketarranageorder.push( "requesterOrder");

          //   }else  if(Ticketarranage[i]=='Teams'){

          //     Ticketarranageorder.push( "teamOrder");

          //   }else  if(Ticketarranage[i]=='Ticket Description'){

          //     Ticketarranageorder.push( "DescriptionOrder");

          //   }

          // }
          // setTicketOrder(Ticketarranageorder);
          // }



          // getCustomCoulmns();
          // setTicketSuffixTeam(SuffixDepartmentName);
          // setTicketTeam(FullDepartmentName);
          //setEditId(id);
          setSelectedTitle(SequenceTitle);
          setSelectedPrefix(TicketPrefix);
          // setAutoTicket(AutoAssign);
          // setAutoAssignMethod(AutoAssignTicketMethod);
          setTimeout(function () {
            setDescBox(true)
            divHide();
          }, 800);
        }
        // }).then(()=>{
        //   getCustomCoulmns();
      });
  }

  // Hide Div's
  const divHide = () => {
    const data = columnConditionBasedRender;
    if (data && data.length > 0) {
      data?.forEach((value) => {
        const Ids = value.IntName;
        let divIds = document.getElementById(Ids);
        if (divIds) {
          divIds.style.display = "none";
        }
      });
    }
  }
  const [updateMe, setUpdateMe] = React.useState<Boolean>(false);
  const selectedValueVerify = (selectedValue) => {

    switch (selectedValue) {
      case "Services":
        console.log("Inside Switch defltService", defltService);
        return defltService;
      case "Sub Services":
        return defltSubService;
      case "Teams":
        return defltTeam;
      case "Request Type":
        return defltReq;
      case "Priority Type":
        return defltPriority;
      default:
        return CustomDateData[selectedValue]
    }
  }
  // Show Div's
  const divShow = () => {
    divHide();
    const data = columnConditionBasedRender;
    let mandatoryfileds = []
    let excludedmandatoryFields = []
    if (data && data.length > 0) {
      data?.forEach((value) => {
        mandatoryfileds.push(value?.IntName)
        if (value?.Name === selectedValueVerify(value?.mainColumnIntName)) {
          excludedmandatoryFields.push(value?.IntName)
          const Ids = value.IntName;
          let divIds = document.getElementById(Ids);
          if (divIds) {
            divIds.style.display = "block";
          }
        }

      })
      mandatoryfileds = mandatoryfileds.filter(x => !excludedmandatoryFields.includes(x))
      MandatoryFields = newMandatoryFields?.filter((v) => {
        return !mandatoryfileds?.includes(v)
      });
    }
    forrendercontent()
  }

  React.useEffect(() => {
    divShow();
  }, [updateMe, defltService, defltSubService, defltPriority, defltTeam, defltReq]);





  const CheckUri = (uri: string) => {
    let string = '';
    try {
      string = decodeURIComponent(uri).replaceAll('|$|', '"');
    }
    catch {
      string = uri
    }
    return string;
  }

  let id = JSON.stringify(props.editdata);
  // TICKET MAILBOX SUBJECT TITLE GETTER
  React.useLayoutEffect(() => {

    ContextService.GetSPContext()
      .get(
        `${getIsInstalled?.SiteUrl}/_api/web/lists/getbytitle('HR365HDMTicketsMailBox')/items/?$select=Subject,Body&$top=5000&$filter=ID eq '${id}'`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "odata-version": "",
          },
        }
      )
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then(async (items: any) => {

        items.value.map((templ) => {
          if (isTicketMailBox === "Yes") {
            settitlename(templ.Subject);
            setGlobalMessage(templ.Body);
          }
        });

      });

  }, []);
  const validateAllSteps = (finaltemp, item) => {


    if (finaltemp.AutomationsActionData[0] != null && finaltemp.AutomationsActionData[0] != '' && finaltemp.AutomationsActionData[0] != undefined) {
      // for (let i = 0; i < Object.keys(finaltemp.AutomationsActionData[0].Action).length; i++) {

      //   const step = finaltemp.AutomationsActionData[0].Action[i];
      //   GetitemLeavlConut.push(step);
      //   switch (step.ActionTaken) {
      //     case 'Set priority as':
      //       Finaltemplate['Priority'] = step.ActionValue
      //       break;
      //     case 'Set Status as':
      //       Finaltemplate['Status'] = step.ActionValue
      //       break;
      //     case 'Set Request type as':
      //       Finaltemplate['RequestType'] = step.ActionValue
      //       break;
      //     case 'Add note to the ticket':
      //       Finaltemplate['TicketDescription'] = CheckUri(item.TicketDescription) + step.ActionValue
      //       break;
      //     case 'Add a CC':
      //       TicketPropJOSNUpdate[0]['CCMail'] = step.ActionValue
      //       Finaltemplate['TicketProperties'] = JSON.stringify(TicketPropJOSNUpdate)
      //       break;
      //     case 'Send email to agent':
      //       AutoAgentEmail = step.ActionValue;
      //       break;
      //     case 'Send email to requester':
      //       AutoRequestorEmail = step.ActionValue
      //       break;
      //     case 'Assign to Agent':

      //       AutoRoundRobin(finaltemp.AutomationsActionData[0].Action)

      //       break;
      //     case 'Delete the ticket':

      //       AutoDeleteTickets();

      //       break;
      //   }

      // }
      [finaltemp.AutomationsActionData[0].Action[0]].map(async (item: any, index, array) => {
        const step: any = array[index];
        let falagforpostcall: boolean = false
        GetitemLeavlConut.push(step);
        switch (step.ActionTaken) {
          case 'Set priority as':
            FinaltemplateForAutomation['Priority'] = step.ActionValue
            falagforpostcall = true
            break;
          case 'Set Status as':
            FinaltemplateForAutomation['Status'] = step.ActionValue
            falagforpostcall = true
            break;
          case 'Set Request type as':
            FinaltemplateForAutomation['RequestType'] = step.ActionValue
            falagforpostcall = true
            break;
          case 'Add note to the ticket':
            FinaltemplateForAutomation['TicketDescription'] = globalMessage.replace(/<[^>]*>/g, '') + step.ActionValue
            falagforpostcall = true
            break;
          case 'Add a CC':
            UpdateTicketsProperties[0]['CCMail'] = step.ActionValue
            FinaltemplateForAutomation['TicketProperties'] = JSON.stringify(UpdateTicketsProperties)
            falagforpostcall = true
            break;
          case 'Send email to agent':
            AutoAgentEmail = step.ActionValue;
            break;
          case 'Send email to requester':
            AutoRequestorEmail = step.ActionValue
            break;
          case 'Assign to Agent':

            await AutoRoundRobin(finaltemp.AutomationsActionData[0].Action)

            break;
          case 'Delete the ticket':

            AutoDeleteTickets();

            break;
        }


        // if (Finaltemplate != null && Finaltemplate != undefined && falagforpostcall) {
        //  await PostAutomationData(Finaltemplate);
        // }

      });
    }

    // if(Object.keys(finaltemp.AutomationsActionData[0].Action)[0].result == true && Object.keys(finaltemp.AutomationsActionData[1].Action)[1].result == true){
    // }
  };

  function AutoRoundRobin(Data) {
    let filteredUser = []
    let FinalTemp;
    let TikcetHistory = [];
    let WeightRobinUser: any = Data[0].ActionValue;
    var currentData = ContextService.GetCurrentUser();
    for (let i = 0; i < Object.entries(Data).length; i++) {
      if (Data[i].Value == 'Weighted Round Robin') {
        let currentId;
        userList.map((item) => {
          Data[i].ActionValue.filter((val) => {
            if (item.UsersId === val.ID) {
              filteredUser.push(item)
            }
          })
        });
        filteredUser.sort((a, b) => {
          return a.TicketCount - b.TicketCount;
        });
        let finalUser = filteredUser[0];
        lastAssignid = finalUser.UsersId;
        currentId = finalUser.ID;
        let count;
        if (
          finalUser.TicketCount == null ||
          finalUser.TicketCount == "" ||
          finalUser.TicketCount == undefined
        ) {
          count = 0;
        } else {
          count = parseInt(finalUser.TicketCount);
        }
        let currentCount = count + 1;
        postTicketCount(currentId, currentCount);

      } else {
        if (Data[i].ActionValue[0]?.Email) {
          let RendomUser = Data[i].ActionValue[parseInt((Math.random() * Data[i].ActionValue?.length).toString())]
          console.log(RendomUser);
          TikcetHistory.push({
            action: "Status",
            oldvalue: 'Unassigned',
            newvalue: 'Open',
            modifiedby: currentData.displayName,
            date: new Date(),
          })
          TikcetHistory.push({
            action: "Assigned To",
            oldvalue: "Unassigned",
            newvalue: RendomUser.Name,
            modifiedby: currentData.displayName,
            date: new Date(),
          })
          FinalTemp = {
            Status: 'Open',
            AssignedToId: RendomUser.ID,
            AssignedTomail: RendomUser.Email,
            ActionOnTicket: JSON.stringify(TikcetHistory)
          }
          setTimeout(() => {

            PostAutomationData(FinalTemp);
          }, 500);
          SendAssignAgentMail(RendomUser);
          SendRequestorAgentAssignMail(RendomUser);
          StopAutoAssignMail = 'Yes'
        }
      }
    }
  }

  function SendAssignAgentMail(MailData) {

    let autoAssignEmal = emailTemplate.filter((i) => {
      return (i.Title == "Assignee - Ticket Assigned To Agent");
    });

    let taskUrl;

    let currentContext = window.location.href.split("#")[0].split(".aspx")[0];

    if (currentContext) {
      taskUrl = currentContext + ".aspx#/Ticket/" + generatedIssueID;
      if (taskUrl.indexOf('SitePages') == -1) {
        taskUrl = taskUrl.split('.aspx')[0] + taskUrl.split('.aspx')[1]
      }
      if (currentContext.indexOf("teamshostedapp") != -1) {
        taskUrl = "https://teams.microsoft.com/_#/apps//sections/4d8856e9-d2a6-493f-ba99-2b34a6ee5377/launcher/launcher.html?url=" + currentContext + ".aspx#/Ticket/" + generatedIssueID;
      }
    }

    if (autoAssignEmal[0].IsActive == "Yes") {

      let autosub = autoAssignEmal[0].Subject;
      let autosub1 = autosub.replaceAll('[ticket.subject]', Titlename);
      let autosub2 = autosub1.replaceAll('[ticket.id]', '[' + ticketSequence + ']');
      autosub2 = autosub2.replaceAll('[ticket.url]', "").replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', "").replaceAll('[ticket.agent.name]', MailData.Name).replaceAll('[ticket.agent.email]', MailData.Email).replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', "").replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.requester.name]', reqName).replaceAll('[ticket.from_email]', requesterEmailId).replaceAll('[ticket.service]', servicename).replaceAll('[ticket.subservice]', subservicename);
      autosub2 = autosub2.replaceAll(null, '').replaceAll(undefined, '');
      let autobody = autoAssignEmal[0].Body;
      autobody = autobody.replaceAll('[ticket.id]', ticketSequence);
      autobody = autobody.replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', "").replaceAll('[ticket.agent.name]', MailData.Name).replaceAll('[ticket.agent.email]', MailData.Emial).replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', "").replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.requester.name]', reqName).replaceAll('[ticket.from_email]', requesterEmailId).replaceAll('[ticket.service]', servicename).replaceAll('[ticket.subservice]', subservicename);
      autobody = autobody.replaceAll(null, '').replaceAll(undefined, '');
      let autobody1 = autobody.replaceAll('[ticket.url]', `<a href='${taskUrl}'>${ticketSequence}</a>`);

      let sendEmailIds = [];
      var filtered = userList.filter((item) => {
        return (item.UsersId == MailData.ID);
      });
      filtered.map((i) => {
        sendEmailIds.push(i.Email);
      });


      let uniqueEmails = [...new Set(sendEmailIds)];


      if (uniqueEmails.length > 0) {
        let fromemail = "no-reply@sharepointonline.com";

        if (defaultAsignee == null || defaultAsignee == undefined || defaultAsignee == "") {
          fromemail = "no-reply@sharepointonline.com";
        } else {
          fromemail = defaultAsignee;
        }
        if (externalDomain || externalDomain != undefined || externalDomain != "") {
          if (fromemail.includes(externalDomain.trim()) || EmailsFromMailbox == "On") {
            postExternal(fromemail, uniqueEmails, autobody1, autosub2, AutoCCEmail);

          } else {
            sendEmailReply(autosub2, autobody1, uniqueEmails, fromemail, AutoCCEmail);
          }

        }

      }

    }
  }
  function SendRequestorAgentAssignMail(MailData) {

    let autoAssignEmal = emailTemplate.filter((i) => {
      return (i.Title == "Requester - Ticket Assigned to Agent");
    });

    let taskUrl;

    let currentContext = window.location.href.split("#")[0].split(".aspx")[0];

    if (currentContext) {
      taskUrl = currentContext + ".aspx#/Ticket/" + generatedIssueID;
      if (taskUrl.indexOf('SitePages') == -1) {
        taskUrl = taskUrl.split('.aspx')[0] + taskUrl.split('.aspx')[1]
      }
      if (currentContext.indexOf("teamshostedapp") != -1) {
        taskUrl = "https://teams.microsoft.com/_#/apps//sections/4d8856e9-d2a6-493f-ba99-2b34a6ee5377/launcher/launcher.html?url=" + currentContext + ".aspx#/Ticket/" + generatedIssueID;
      }
    }

    if (autoAssignEmal[0].IsActive == "Yes") {

      let autosub = autoAssignEmal[0].Subject;
      let autosub1 = autosub.replaceAll('[ticket.subject]', Titlename);
      let autosub2 = autosub1.replaceAll('[ticket.id]', '[' + ticketSequence + ']');
      autosub2 = autosub2.replaceAll('[ticket.url]', "").replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', "").replaceAll('[ticket.agent.name]', MailData.Name).replaceAll('[ticket.agent.email]', MailData.Email).replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', "").replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.requester.name]', reqName).replaceAll('[ticket.from_email]', requesterEmailId).replaceAll('[ticket.service]', servicename).replaceAll('[ticket.subservice]', subservicename);
      autosub2 = autosub2.replaceAll(null, '').replaceAll(undefined, '');
      let autobody = autoAssignEmal[0].Body;
      autobody = autobody.replaceAll('[ticket.id]', ticketSequence);
      autobody = autobody.replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', "").replaceAll('[ticket.agent.name]', MailData.Name).replaceAll('[ticket.agent.email]', MailData.Emial).replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', "").replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.requester.name]', reqName).replaceAll('[ticket.from_email]', requesterEmailId).replaceAll('[ticket.service]', servicename).replaceAll('[ticket.subservice]', subservicename);
      autobody = autobody.replaceAll(null, '').replaceAll(undefined, '');
      let autobody1 = autobody.replaceAll('[ticket.url]', `<a href='${taskUrl}'>${ticketSequence}</a>`);

      let sendEmailIds = [];
      var filtered = userList.filter((item) => {
        return (item.UsersId == MailData.ID);
      });
      filtered.map((i) => {
        sendEmailIds.push(i.Email);
      });


      let uniqueEmails = [requesterEmailId];


      if (uniqueEmails.length > 0) {
        let fromemail = "no-reply@sharepointonline.com";

        if (defaultAsignee == null || defaultAsignee == undefined || defaultAsignee == "") {
          fromemail = "no-reply@sharepointonline.com";
        } else {
          fromemail = defaultAsignee;
        }
        if (externalDomain || externalDomain != undefined || externalDomain != "") {
          if (fromemail.includes(externalDomain.trim()) || EmailsFromMailbox == "On") {
            postExternal(fromemail, uniqueEmails, autobody1, autosub2, AutoCCEmail);

          } else {
            sendEmailReply(autosub2, autobody1, uniqueEmails, fromemail, AutoCCEmail);
          }

        }

      }

    }
  }
  function getBusinessHours() {
    ContextService.GetSPContext()
      .get(
        `${getIsInstalled?.SiteUrl}/_api/web/lists/getbytitle('HR365HDMBusinessHours')/items`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "odata-version": "",
          },
        }
      )
      .then((response: SPHttpClientResponse) => {
        return response.json();
      }).then((items: any) => {
        completeBusinessHours = items.value

      })
  }
  function FinddayinBuisnessHours() {
    let today = new Date().getDay()
    switch (today) {
      case 0:
        return 'SundayTime'
        break;
      case 1:
        return 'MondayTime'
        break;
      case 2:
        return 'TuesdayTime'
        break;
      case 3:
        return 'WednesdayTime'
        break;
      case 4:
        return 'ThursdayTime'
        break;
      case 5:
        return 'SundayTime'
        break;
      case 6:
        return 'FridayTime'
        break;
    }
  }

  function convertbusinessHoursIntoObject(BusinessHours, WorkingDays) {
    const inputDaysDict = {
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6,
      'Sunday': 0
    }

    // Define the input string
    const inputString = BusinessHours;

    // Split the input string into start and end times
    const [startTime, startMeridian, endTime, endMeridian] = inputString.split('||');

    // Convert the start and end times to 24-hour format
    let startHour = parseInt(startTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1]);
    if (startMeridian === 'PM') {
      startHour += 12;
    }
    const start = ('0' + startHour).slice(-2) + ':' + ('0' + startMinute).slice(-2);

    let endHour = parseInt(endTime.split(':')[0]);
    const endMinute = parseInt(endTime.split(':')[1]);
    if (endMeridian === 'PM') {
      endHour += 12;
    }
    const end = ('0' + endHour).slice(-2) + ':' + ('0' + endMinute).slice(-2);

    // Create an object with the start and end times
    let WorkingDaysArray = JSON.parse(WorkingDays)
    let WorkingDaysNumberFormat = []
    WorkingDaysArray.map(x => {
      WorkingDaysNumberFormat.push(inputDaysDict[x])
    })
    const outputObject = { start, end, days: WorkingDaysNumberFormat };
    return outputObject;
  }


  function getAutomationData(item) {

    ContextService.GetSPContext()
      .get(
        `${getIsInstalled?.SiteUrl}/_api/web/lists/getbytitle('HR365HDMAutoMation')/items?$select=*&$filter=Active eq 'Active'&$orderby=RulePriority asc`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "odata-version": "",
          },
        }
      )
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((items: any) => {
        console.log(items);
        items.value?.map((templ) => {

          let AutomationsFlowData = isArrayValidated(templ.AutoMationFlow) ? JSON.parse(templ.AutoMationFlow) : '';
          let AutomationsActionData = isArrayValidated(templ.Action) ? JSON.parse(templ.Action) : '';
          let ExceptData = isArrayValidated(templ.ExceptData) ? JSON.parse(templ.ExceptData) : '';

          console.log(AutomationsFlowData);
          console.log(AutomationsActionData);
          console.log(ExceptData);

          let finaltemp = {
            ID: templ.ID,
            Active: templ.Active,
            Name:
              templ.Title == null ||
                templ.Title == undefined ||
                templ.Title == ""
                ? ""
                : templ.Title,
            AutomationsFlowData: AutomationsFlowData,
            AutomationsActionData: AutomationsActionData,
            ExceptData: ExceptData,

          };
          console.log(finaltemp);
          varPerformAutomationData = GetitemLeavlConut

          console.log(varPerformAutomationData);
          if (finaltemp.AutomationsFlowData[0] != '' && finaltemp.AutomationsFlowData[0] != null && finaltemp.AutomationsFlowData[0] != undefined) {
            for (let i = 0; i < Object.keys(finaltemp.AutomationsFlowData[0].AutoMationFlow).length; i++) {

              const step = finaltemp.AutomationsFlowData[0].AutoMationFlow[i];
              step.Result = false
              switch (step.Trigger) {
                case 'Priority':
                  console.log('Enter in switch');
                  AutoPriorityCheck(step);
                  break;
                case 'Attachment':
                  AutoAttechmentCheck(step);
                  break;
                case 'Assigned agent':
                  AutoAssignedAgentCheck(step);
                  break;
                case 'Ticket Created':
                  AutoTicketsCraetedCheck(step, item);
                  break;
                case 'Description':
                  AutoDescriptionCheck(step);
                  break;
                case 'Group':
                  AutoGroupCheck(step);
                  break;
                case 'Reqester email':
                  AutoReqesterEmailCheck(step);
                  break;
                case 'Title':
                  AutoTitleCheck(step);
                  break;
                case 'Title or dercription':
                  AutoTitleAndDescCheck(step);
                  break;
                case 'Status':
                  AutoStatusCheck(step);
                  break;
                case 'Source':
                  AutoSourceCheck(step);
                  break;
                case 'To email':
                  AutoToEmailCheck(step);
                  break;
                case 'Service':
                  AutoServiceCheck(step);
                  break;
                case 'SubService':
                  AutoSubServiceCheck(step);
                  break;
                case 'Type':
                  AutoTypeCheck(step);
                  break;
              }
            }

            if (Object.keys(finaltemp.AutomationsFlowData[0].AutoMationFlow).length == 1) {
              if (finaltemp.AutomationsFlowData[0].AutoMationFlow[0].Result == true) {
                CheckExceptOptionsValidation(finaltemp);

                if (ExceptConstion != 'No') {
                  validateAllSteps(finaltemp, item);
                }
              }
            } else if (Object.keys(finaltemp.AutomationsFlowData[0].AutoMationFlow).length > 1) {
              CheckAndorConditions(0, 1, finaltemp, (finaltemp.AutomationsFlowData[0].AutoMationFlow), item, (finaltemp.AutomationsFlowData[0].AutoMationFlow)[0]?.Result);
            }

          }


        });
        setTimeout(() => {

          PostAutomationData(FinaltemplateForAutomation);
        }, 1000);
        setTimeout(() => {
          FinaltemplateForAutomation = {};
        }, 2000);

      });

  };

  function CheckExceptOptionsValidation(finaltemp) {
    console.log(finaltemp);
    for (let i = 0; i < Object.keys(finaltemp.ExceptData[0].ExceptData).length; i++) {
      const step = finaltemp.ExceptData[0].ExceptData[i];
      switch (step.Except) {
        case 'The requestor':
          ExceptAutoReqesterEmailCheck(step);
          break;
        case 'Source':
          ExceptAutoSourceCheck(step);
          break;
        case 'Any attachment':
          ExceptAutoAttechmentCheck(step);
          break;
        case 'The description':
          ExceptAutoDescriptionCheck(step);
          break;
        case 'Priority':
          ExceptAutoPriorityCheck(step);
          break;
      }
    }
  };

  function ExceptAutoReqesterEmailCheck(step) {
    let requesterDisplayName = "";
    let requester = " ";
    if (requestername.length > 0) {
      requester = requestername[0].id;
      requesterDisplayName = requestername[0].text;
    } else {
      requester = null;
      // requesterDisplayName = "";
    }
    if (step.Condition == 'Is') {
      if (step.Value == requesterDisplayName) {
        ExceptConstion = 'No'
      }
    }
    else if (step.Condition == 'Is not') {
      if (step.Value != requesterDisplayName) {
        ExceptConstion = 'No'
      }
    }
    else if (step.Condition == 'Contains') {
      if (requesterDisplayName.includes(step.Value)) {
        ExceptConstion = 'No'
      }
    }
    else if (step.Condition == 'Dose not Contains') {
      if (!requesterDisplayName.includes(step.Value)) {
        ExceptConstion = 'No'
      }
    }
    else if (step.Condition == 'Is any of') {
      if (requesterDisplayName.includes(step.Value)) {
        ExceptConstion = 'No'
      }
    }
    else if (step.Condition == 'Is none of') {
      if (!requesterDisplayName.includes(step.Value)) {
        ExceptConstion = 'No'
      }
    }

  };

  function ExceptAutoDescriptionCheck(step) {
    if (step.Condition == 'Is') {
      if (step.Value.includes(globalMessage)) {
        ExceptConstion = 'No'
      }
    }
    else if (step.Condition == 'Is not') {
      if (!globalMessage.includes(step.Value)) {
        ExceptConstion = 'No'
      }
    }
    else if (step.Condition == 'Contains') {
      if (globalMessage.includes(step.Value)) {
        ExceptConstion = 'No'
      }
    }
    else if (step.Condition == 'Dose not Contains') {
      if (!globalMessage.includes(step.Value)) {
        ExceptConstion = 'No'
      }
    }
    else if (step.Condition == 'Has any of these words') {
      if (globalMessage.includes(step.Value)) {
        ExceptConstion = 'No'
      }
    }
    else if (step.Condition == 'Has none of these words') {
      if (!globalMessage.includes(step.Value)) {
        ExceptConstion = 'No'
      }
    }
    else if (step.Condition == 'Starts with') {
      if (globalMessage.startsWith(step.Value)) {
        ExceptConstion = 'No'
      }
    }
    else if (step.Condition == 'Ends with') {
      if (globalMessage.endsWith(step.Value)) {
        ExceptConstion = 'No'
      }
    }

  };
  function ExceptAutoAttechmentCheck(step) {

    if (step.Condition == 'Is present') {
      ExceptConstion = 'No'
    }
    else if (step.Condition == 'Is not present') {
      ExceptConstion = 'No'
    }

  };

  function ExceptAutoSourceCheck(step) {
    if (step.Condition == 'Is') {
      if (step.Value == mediaChoosed) {
        ExceptConstion = 'No'
      }
    }
    else if (step.Condition == 'Is not') {
      if (step.Value != mediaChoosed) {
        ExceptConstion = 'Yes'
      }
    }

  };

  function ExceptAutoPriorityCheck(step) {
    if (step.Condition == 'Is') {
      if (step.Value.includes(defltPriority)) {
        ExceptConstion = 'No'
      }
    }
    else if (step.Condition == 'Is not') {
      if (!defltPriority.includes(step.Value)) {
        ExceptConstion = 'Yes'
      }
    }

  };
  function CheckAndorConditions(firstindex, secondindex, ActionData, result, item, previousresult) {


    // if (result[firstindex].AndOrCondition == "or") {

    //   // if (firstindex[1] == true || secondindex[2] == true){

    //   if (result[firstindex].Result == true || result[secondindex].Result == true) {
    //     if (result[secondindex + 1] != null && result[secondindex + 1] != undefined)
    //       CheckAndorConditions(firstindex + 1, secondindex + 1, ActionData, result, item,true)
    //   }
    // } else if (result[firstindex].AndOrCondition == "and") {
    //   if (result[firstindex].Result == true && secondindex.Result == true) {
    //     if (result[secondindex + 1] != null && result[secondindex + 1] != undefined)
    //       CheckAndorConditions(firstindex + 1, secondindex + 1, ActionData, result, item,true)
    //   }
    // }
    // if (secondindex == Object.keys(result).length - 1) {
    //   validateAllSteps(ActionData, item)

    // }

    let finalresult = evaluateConditions(Object.values(result))
    console.log(finalresult);

    if (finalresult) {
      validateAllSteps(ActionData, item)
    }
  }
  function evaluateConditions(conditions) {
    let FinalResult = 'Yes';
    let result: boolean // Initialize the result as true
    result = conditions[0]?.Result

    for (let i = 1; i < conditions.length; i++) {
      if (conditions[i - 1].AndOrCondition === "or" || conditions[i - 1].AndOrCondition == '') {

        // Apply "or" logic
        result = result || conditions[i].Result
      } else {
        // Apply "and" logic
        result = result && conditions[i].Result;
      }


    }

    // for (const condition of conditions) {
    //     if (condition.AndOrCondition === "or" || condition.AndOrCondition == '') {

    //         // Apply "or" logic
    //         result = result || condition.Result
    //     }else {
    //         // Apply "and" logic
    //         result = result && condition.Result;
    //     }

    // }

    return result;
  }

  function AutoTypeCheck(step) {
    if (step.Condition == 'Is') {
      if (step.Value == defltReq) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Is not') {
      if (step.Value != defltReq) {
        step.Result = true;
      }
    }

  };
  function AutoToEmailCheck(step) {
    if (step.Condition == 'Is') {
      if (step.Value == requesterEmailId) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Is not') {
      if (step.Value != requesterEmailId) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Contains') {
      if (requesterEmailId.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Dose not Contains') {
      if (!requesterEmailId.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Is any of') {
      if (!requesterEmailId.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Is none of') {
      if (!requesterEmailId.includes(step.Value)) {
        step.Result = true;
      }
    }

  };
  function AutoSourceCheck(step) {
    if (step.Condition == 'Is') {
      if (step.Value == mediaChoosed) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Is not') {
      if (step.Value != mediaChoosed) {
        step.Result = true;
      }
    }

  };
  function AutoStatusCheck(step) {
    if (step.Condition == 'Is') {
      if (step.Value == _AutoAssignTicket) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Is not') {
      if (step.Value != _AutoAssignTicket) {
        step.Result = true;
      }
    }

  };
  function AutoServiceCheck(step) {
    if (step.Condition == 'Is') {
      if (step.Value == servicename) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Is not') {
      if (step.Value != servicename) {
        step.Result = true;
      }
    }

  };
  function AutoSubServiceCheck(step) {
    if (step.Condition == 'Is') {
      if (step.Value == subservicename) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Is not') {
      if (step.Value != subservicename) {
        step.Result = true;
      }
    }

  };
  function AutoTitleAndDescCheck(step) {
    if (step.Condition == 'Is') {
      if (step.Value == Titlename && step.Value == globalMessage) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Is not') {
      if (step.Value != Titlename && step.Value != globalMessage) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Contains') {
      if (Titlename.includes(step.Value) || globalMessage.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Dose not Contains') {
      if (!Titlename.includes(step.Value) && !globalMessage.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Has any of these words') {
      if (Titlename.includes(step.Value) || globalMessage.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Has none of these words') {
      if (Titlename.includes(step.Value) || globalMessage.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Starts with') {
      if (Titlename.startsWith(step.Value) || globalMessage.startsWith(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Ends with') {
      if (Titlename.endsWith(step.Value) || globalMessage.endsWith(step.Value)) {
        step.Result = true;
      }
    }

  };
  function AutoTitleCheck(step) {
    if (step.Condition == 'Is') {
      if (step.Value == Titlename) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Is not') {
      if (step.Value != Titlename) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Contains') {
      if (Titlename.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Dose not Contains') {
      if (!Titlename.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Has any of these words') {
      if (Titlename.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Has none of these words') {
      if (!Titlename.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Starts with') {
      if (Titlename.startsWith(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Ends with') {
      if (Titlename.endsWith(step.Value)) {
        step.Result = true;
      }
    }

  };
  function AutoReqesterEmailCheck(step) {
    if (step.Condition == 'Is') {
      if (step.Value == requesterEmailId) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Is not') {
      if (step.Value != requesterEmailId) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Contains') {
      if (requesterEmailId.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Dose not Contains') {
      if (!requesterEmailId.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Is any of') {
      if (requesterEmailId.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Is none of') {
      if (!requesterEmailId.includes(step.Value)) {
        step.Result = true;
      }
    }

  };
  function AutoDescriptionCheck(step) {
    if (step.Condition == 'Is') {
      if (globalMessage.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Is not') {
      if (!globalMessage.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Contains') {
      if (globalMessage.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Dose not Contains') {
      if (!globalMessage.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Has any of these words') {
      if (globalMessage.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Has none of these words') {
      if (!globalMessage.includes(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Starts with') {
      if (globalMessage.startsWith(step.Value)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Ends with') {
      if (globalMessage.endsWith(step.Value)) {
        step.Result = true;
      }
    }

  };
  function AutoGroupCheck(step) {
    if (step.Condition == 'Is') {
      if (step.Value == 'None') {
        step.Result = true;
      }
      else if (step.Value == 'Billing') {
        step.Result = true;
      }
      else if (step.Value == 'Customer Support') {
        step.Result = true;
      }
      else if (step.Value == 'Escalations') {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Is not') {
      if (step.Value == 'None') {
        step.Result = true;
      }
      else if (step.Value == 'Billing') {
        step.Result = true;
      }
      else if (step.Value == 'Customer Support') {
        step.Result = true;
      }
      else if (step.Value == 'Escalations') {
        step.Result = true;
      }
    }

  };
  function AutoPriorityCheck(step) {
    if (step.Condition == 'Is') {
      if (step.Value.includes(defltPriority)) {
        step.Result = true;
      }
    }
    else if (step.Condition == 'Is not') {
      if (!defltPriority.includes(step.Value)) {
        step.Result = true;
      }
    }

  };
  function AutoTicketsCraetedCheck(step, TicketData) {
    console.log(TicketData);
    if (step.Condition == 'During') {
      if (step.Value === 'Business Hours') {
        let CreatedTime: any = TicketData.TicketCreatedDate
        const activeBusinessHours = completeBusinessHours.filter(b => b.IsActive == "Yes");

        if (activeBusinessHours.length > 0) {

          const businessHours = convertbusinessHoursIntoObject(activeBusinessHours[0][FinddayinBuisnessHours()], activeBusinessHours[0].Holiday);

          const now = new Date();
          const Created = new Date(CreatedTime);

          // Extract the hour and minute components from the current time
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();
          const CreatedHour = Created.getHours();
          const CreatedMinute = Created.getMinutes();

          // Combine the hour and minute components into a string in the format 'HH:mm'
          const currentTime = ('0' + currentHour).slice(-2) + ':' + ('0' + currentMinute).slice(-2);
          const CreatedTimeHours = ('0' + CreatedHour).slice(-2) + ':' + ('0' + CreatedMinute).slice(-2);
          if (currentTime >= businessHours.start && currentTime <= businessHours.end) {
            step.Result = true;
          } else {
            step.Result = false;
          }
        }
      } else if (step.Value === 'Non-Business Hours') {
        let CreatedTime: any = TicketData.TicketCreatedDate
        const activeBusinessHours = completeBusinessHours.filter(b => b.IsActive == "Yes");
        if (activeBusinessHours.length > 0) {
          const businessHours = convertbusinessHoursIntoObject(activeBusinessHours[0][FinddayinBuisnessHours()], activeBusinessHours[0].Holiday);

          const now = new Date();
          const Created = new Date(CreatedTime);

          // Extract the hour and minute components from the current time
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();
          const CreatedHour = Created.getHours();
          const CreatedMinute = Created.getMinutes();

          // Combine the hour and minute components into a string in the format 'HH:mm'
          const currentTime = ('0' + currentHour).slice(-2) + ':' + ('0' + currentMinute).slice(-2);
          const CreatedTimeHours = ('0' + CreatedHour).slice(-2) + ':' + ('0' + CreatedMinute).slice(-2);
          if (currentTime >= businessHours.start && currentTime <= businessHours.end) {
            step.Result = false;
          } else {
            step.Result = true;
          }
        }
      }
    }

    // else if(step.Condition == 'Is not'){
    //   if (step.Value.includes(defltPriority)) {
    //     step.Result = true;
    //   }
    // }

  };
  function AutoAttechmentCheck(step) {

    if (step.Condition == 'Is present') {
      step.Result = true;
    }
    else if (step.Condition == 'Is not present') {
      step.Result = false;
    }

  };
  function AutoAssignedAgentCheck(step) {

    if (step.Condition == 'Is') {
      step.Result = true;
    }
    else if (step.Condition == 'Is not') {
      step.Result = false;
    }

  };

  // React.useEffect(() => {
  //   let web = new Web(getIsInstalled?.SiteUrl);
  //   web.lists
  //     .getByTitle("HR365HDMSettings")
  //     .items.get().then((rawdata) => {
  //       //var _all = rawdata.d.results;
  //       for (var y = 0; y < rawdata.length; y++) {
  //         // 
  //         var id = rawdata[y].ID;
  //         var teamtile = rawdata[y].TeamDisplayName;
  //         var SequenceTitle = rawdata[y].SequenceTitle;
  //         var TicketPrefix = rawdata[y].TicketPrefix;
  //         // var SuffixDepartmentName = rawdata[y].SuffixDepartmentName;
  //         // var FullDepartmentName = rawdata[y].FullDepartmentName;
  //         // var AutoAssignTicket = rawdata[y].AutoAssign;
  //         // var autoAsTicketMethod = rawdata[y].AutoAssignMethod;
  //         // var TicketFieldsArrangement = rawdata[y].TicketFieldsArrangement;
  //         var defaultAssigneename = rawdata[y].DefaultAssignee;
  //         var externalDomain = rawdata[y].AllowedExtrenalDomain;
  //         // var SiteUrl = rawdata[y].SiteUrl;
  //         // setTeamTitle(teamtile);
  //         if (externalDomain == null) {
  //           externalDomain = "notpresent";
  //         }
  //         // setSiteUrlstate(SiteUrl);

  //         // let newval = SuffixDepartmentNamevl.;
  //         setExternalDomain(externalDomain);
  //         setDefaultAsignee(defaultAssigneename);
  //         TicketFieldsArrangement = TicketFieldsArrangement.split("|,|");
  //         TicketFieldsArrangementOrder = [];
  //         for (var i = 0; i < TicketFieldsArrangement.length; i++) {
  //           if (TicketFieldsArrangement[i] == 'Title') {

  //             TicketFieldsArrangementOrder.push("titleOrder");

  //           } else if (TicketFieldsArrangement[i] == 'Priority') {

  //             TicketFieldsArrangementOrder.push("prioOrder");

  //           } else if (TicketFieldsArrangement[i] == "Request Type") {

  //             TicketFieldsArrangementOrder.push("requestTypeOrder");

  //           } else if (TicketFieldsArrangement[i] == 'Services') {

  //             TicketFieldsArrangementOrder.push("serviceOrder");

  //           } else if (TicketFieldsArrangement[i] == 'Sub Services') {

  //             TicketFieldsArrangementOrder.push("subserviceOrder");

  //           }
  //           else if (TicketFieldsArrangement[i] == "Requester") {

  //             TicketFieldsArrangementOrder.push("requesterOrder");

  //           } else if (TicketFieldsArrangement[i] == 'Teams') {

  //             TicketFieldsArrangementOrder.push("teamOrder");

  //           }

  //         }


  //         // setTicketOrder(TicketFieldsArrangmentOrder);
  //         // setTicketSuffixTeam(SuffixDepartmentName);
  //         // setTicketTeam(FullDepartmentName);
  //         //setEditId(id);
  //         setSelectedTitle(SequenceTitle);
  //         setSelectedPrefix(TicketPrefix);
  //         // setAutoTicket(AutoAssign);
  //         // setAutoAssignMethod(AutoAssignTicketMethod);
  //         setTimeout(function(){
  //           setDescBox(true)
  //         },100);
  //       }
  //     });
  // },


  //   []);
  // React.useEffect(() => {
  //   getPriorityFunction();
  //   getServiceFunction();
  //   getSubServiceFunction();
  //   getRequestType();
  //   // getCustomCoulmns();
  //   if (FullDepartmentName == "On") {
  //     setFullName(true);
  //   }
  //   else {
  //     setFullName(false);
  //   }
  // }, []);


  function getPriorityFunction() {
    let web = new Web(getIsInstalled?.SiteUrl);
    web.lists
      .getByTitle("HR365HDMPriority")
      .items.select("Title,DefaultType")
      .get()
      .then((data) => {

        let ProcessTypeoptions1 = [];
        //  let file = attachFile[0];

        for (var y = 0; y < data.length; y++) {
          if (data[y].DefaultType == "Yes" && !isStringValidated(defaultPriority)) {
            setpriorityName(data[y].Title);
            setDefltPriority(data[y].Title);
          }
          ProcessTypeoptions1.push({ text: data[y].Title, key: data[y].Title });
        }

        ProcessTypeoptions1 = ProcessTypeoptions1?.sort((a, b) => a?.text?.localeCompare(b?.text));

        setpriorityoptions(ProcessTypeoptions1);
      });

    var currentuser = ContextService.GetCurrentUser();
    var userid = ContextService.GetCurentUserId();
    let userdetails = [];
    userdetails.push({ id: userid, name: currentuser.displayName });
    setrequesterName(userdetails);

    if (currentuser.displayName.indexOf("0#.f|membership|") > -1) {
      userName = currentuser.displayName.split('0#.f|membership|"')[1];
    } else {
      userName = currentuser.displayName;
    }
    setReqName(userName);
    setTicketreqName(currentuser.displayName);


    let user = [];
    user.push(currentuser.displayName);
    // setrequester(isTicketMailBox ==="Yes" ? RequestedFrom : user);
    setrequester(user);

    setRequesterEmailId(currentuser.loginName);

  }
  // var currentuser = ContextService.GetCurrentUser();
  // setRequesterEmailId(currentuser.loginName);
  function getServiceFunction() {
    let web = new Web(getIsInstalled?.SiteUrl);
    web.lists
      .getByTitle("HR365HDMServices")
      .items.get()
      .then((data) => {
        let ProcessTypeoptions1 = [];
        //  let file = attachFile[0];

        for (var y = 0; y < data.length; y++) {
          // 
          ProcessTypeoptions1.push({
            text: data[y].SubCategory,
            key: data[y].SubCategory,
            team: data[y].DepartCode,
            default: data[y].DefaultType,

          });

          servicesOptions.push({
            text: data[y].SubCategory,
            key: data[y].SubCategory,
            team: data[y].DepartCode,
            default: data[y].DefaultType,
          });
        }
        console.log(Suboptions);
        sethroptions(ProcessTypeoptions1);
        HRoptionArray = ProcessTypeoptions1;
        HRoptionArray = HRoptionArray?.sort((a, b) => a?.text?.localeCompare(b?.text));
        getTeamDetails();

        var servicesvalidation = servicesOptions.filter((items) => {
          return items.default == "Yes";
        });

        //sethroptions(servicesvalidation);
        if (
          servicesvalidation != null ||
          servicesvalidation.length != 0 ||
          servicesvalidation != undefined
        ) {
          setdefaultserviesvalidation(true);
        }

      }).then(() => {
        // getSettings();
      });

    return () => {
      servicesOptions = [];

    };
  }
  const onChangeSubservice2 = (ev, item) => {

    setlevel2SubServicedefault(item.key)

    if (level3SubserviceAllOptions != null && level3SubserviceAllOptions != undefined && level3SubserviceAllOptions.length > 0) {
      setlevel3SubserviceOptions(level3SubserviceAllOptions.filter(x => x.parent == item.key));
      let defaultSubservice = level3SubserviceAllOptions.filter(x => x.parent == item.key && x.default == "Yes");

      if (defaultSubservice.length) {
        setlevel3Subservicedefault(defaultSubservice[0].key)
      }
    }

  }
  const onChangeSubservice3 = (ev, item) => {
    setlevel3Subservicedefault(item.key)


  }
  function getSubServiceFunction() {
    let web = new Web(getIsInstalled?.SiteUrl);
    web.lists
      .getByTitle("HR365HDMSubServices")
      .items.get()
      .then((data) => {
        let ProcessTypeoptions1 = [];
        //  let file = attachFile[0];

        for (var y = 0; y < data.length; y++) {



          ProcessTypeoptions1.push({
            text: data[y].SubServices,
            key: data[y].SubServices,
            services: data[y].MainServices,
            default: data[y].Enable,
          });

          subservicesOptions.push({
            text: data[y].SubServices,
            key: data[y].SubServices,
            services: data[y].MainServices,
            default: data[y].Enable,
          });
        }

        setSuboptions(ProcessTypeoptions1);
        getTeamDetails();
      });
    var subservicesvalidation = subservicesOptions.filter((items) => {
      return items.default == "Yes";
    });

    if (
      subservicesvalidation != null ||
      subservicesvalidation.length != 0 ||
      subservicesvalidation != undefined
    ) {
      setdefaultsubserviesvalidation(true);
    }

    return () => {
      subservicesOptions = [];

    };
  }
  function getSubServiceLevelsFunction() {
    let allItems = [];
    let allItems1 = [];
    let web = new Web(getIsInstalled?.SiteUrl);
    web.lists
      .getByTitle("HR365HDMSubServicesLevelWise")
      .items.get()
      .then((data) => {
        let ProcessTypeoptions1 = [];
        //  let file = attachFile[0];
        level2Subservices = data.filter(x => x.Type == "L2")
        level3Subservices = data.filter(x => x.Type == "L3")
        level2Subservices.map((item) => {
          let level2Options = {
            parent: item.SubServicesL1,
            key: item.SubServicesL2,
            text: item.SubServicesL2,
            value: item.SubServicesL2,
            label: item.SubServicesL2,
            default: item.Default
          }
          allItems.push(level2Options)
          setlevel2SubServiceAllOptions(allItems)
        })
        level3Subservices.map((item) => {
          let level3Options = {
            parent: item.SubServicesL2,
            key: item.SubServicesL3,
            text: item.SubServicesL3,
            value: item.SubServicesL3,
            label: item.SubServicesL3,
            default: item.Default
          }
          allItems1.push(level3Options)
          setlevel3SubserviceAllOptions(allItems1)
        })
        if (defltSubService != null && defltSubService != undefined && defltSubService != "") {
          setlevel2SubServiceOptions(allItems.filter(x => x.parent == defltSubService));
          let defaultSubservice = allItems.filter(x => x.parent == defltSubService && x.default == "Yes");
          if (defaultSubservice.length) {
            setlevel2SubServicedefault(defaultSubservice[0].key)

            setlevel3SubserviceOptions(allItems1.filter(x => x.parent == defaultSubservice[0].key));
            let defaultSubservice1 = allItems1.filter(x => x.parent == defaultSubservice[0].key && x.default == "Yes");
            if (defaultSubservice1.length) {
              setlevel3Subservicedefault(defaultSubservice1[0].key);

            }
          }

        }
      });
    var subservicesvalidation = subservicesOptions.filter((items) => {
      return items.default == "Yes";
    });

    if (
      subservicesvalidation != null ||
      subservicesvalidation.length != 0 ||
      subservicesvalidation != undefined
    ) {
      setdefaultsubserviesvalidation(true);
    }

    return () => {
      subservicesOptions = [];

    };
  }


  function getRequestType() {
    let web = new Web(getIsInstalled?.SiteUrl);
    web.lists
      .getByTitle("HR365HDMRequestType")
      .items.select("Title,DefaultRequest")
      .get()
      .then((data) => {
        let ProcessTypeoptions1 = [];
        //  let file = attachFile[0];

        for (var y = 0; y < data.length; y++) {

          if (data[y].DefaultRequest == "Yes" && !isStringValidated(DefaultRequestType)) {
            setDefltReq(data[y].Title);
            setrequestName(data[y].Title);
          }
          ProcessTypeoptions1.push({ text: data[y].Title, key: data[y].Title });
        }
        ProcessTypeoptions1 = ProcessTypeoptions1?.sort((a, b) => a?.text?.localeCompare(b?.text));

        setrequestoptions(ProcessTypeoptions1);
      });
    // checkUserExist();
    getEmailTemplate();
  }

  // function checkUserExist() {
  //   let currentuserid = ContextService.GetCurentUserId();
  //   ContextService.GetSPContext()
  //     .get(
  //       `${getIsInstalled?.SiteUrl}/_api/web/lists/getbytitle('HR365HDMUsers')/items?$select=ID,Roles,UserRole&$filter=UsersId eq ${currentuserid}`,
  //       SPHttpClient.configurations.v1,
  //       {
  //         headers: {
  //           Accept: "application/json;odata=nometadata",
  //           "odata-version": "",
  //         },
  //       }
  //     )
  //     .then((response: SPHttpClientResponse) => {
  //       return response.json();
  //     }).then((items: any) => {
  //       
  //       
  //       if (items.value.length == 0) {
  //         userExist = false;
  //       } else {
  //         userExist = true;
  //       }
  //     });


  // }

  // function postNewUser() {
  //   
  //   let currentuser = ContextService.GetCurrentUser();
  //   let userid = ContextService.GetCurentUserId();
  //   let finalTemplate = {
  //     UsersId: userid,
  //     Email: currentuser.loginName,
  //     Roles: "User",
  //     UserRole: "Restrictedaccess",
  //     // ImageUrl:imgUrl,
  //   };
  //   ContextService.GetSPContext()
  //     .post(
  //       `${getIsInstalled?.SiteUrl}/_api/web/lists/getbytitle('HR365HDMUsers')/items`,
  //       SPHttpClient.configurations.v1,
  //       {
  //         headers: {
  //           Accept: "application/json;odata=nometadata",
  //           "Content-type": "application/json;odata=nometadata",
  //           "odata-version": "",
  //         },
  //         body: JSON.stringify(finalTemplate),
  //       }
  //     )
  //     .then((response: SPHttpClientResponse) => {
  //       if (response.ok) {
  //         userExist = true;
  //         

  //       } else {
  //         response.json().then((responseJSON) => {
  //           

  //         });
  //       }
  //       return response.json();
  //     });


  // }
  function getTeamDetails() {
    // 
    let web = new Web(getIsInstalled?.SiteUrl);
    web.lists.getByTitle("HR365HDMDepartments").items.select("*,Supervisor1/Title,Supervisor1/Id&$filter=EscalationTeam eq 'No'&$expand=Supervisor1")
      .get()
      .then((data) => {
        let ProcessTypeoptions2 = [];
        let ProcessTypeoptions3 = [];
        let selectedService = []
        //  let file = attachFile[0];
        setAllDepartmentsData(data)
        for (var y = 0; y < data.length; y++) {

          if (data[y].Nextonqueue == "Yes" && !isStringValidated(defaultteamCode)) {
            setDefltTeam(data[y].Onqueue);
            setteamname(data[y].Onqueue);
            setteam(data[y].Title);
            var filteredService = servicesOptions.filter((items) => {
              //  if(items.default =="Yes"){
              //   setDefltService(items.key);
              //   setservicename(items.key);

              //  }
              return items.team == data[y].Onqueue;
            });
            filteredService.map((item) => {
              if (item.default == "Yes") {
                selectedService = item.key
                setDefltService(item.key);
                setservicename(item.key);
              }

            });
            setServiceOption(filteredService);



          }
          var filteredSubService = subservicesOptions.filter((items) => {
            //  if(items.default =="Yes"){
            //   setDefltService(items.key);
            //   setservicename(items.key);

            //  }
            return items.services == selectedService;
          });
          filteredSubService.map((item) => {
            if (item.default == "Yes") {
              setDefltSubService(item.key);
              setsubservicename(item.key);
            }

          });
          filteredSubService = filteredSubService?.sort((a, b) => a?.text?.localeCompare(b?.text));
          setsubserviceOption(filteredSubService)

          ProcessTypeoptions2.push({
            text: data[y].Onqueue,
            key: data[y].Onqueue,
            name: data[y].Title,
          });
          ProcessTypeoptions3.push({
            text: data[y].Title,
            key: data[y].Onqueue,
            name: data[y].Title,
          });
        }
        setTeamsData(data);
        //For Code
        setteamsoptions(ProcessTypeoptions2);
        //for full Name
        ProcessTypeoptions3?.sort((a, b) => a?.text.localeCompare(b?.text)); // Teams Option Sorting Based on Text.
        setteamsoptionarray(ProcessTypeoptions3);
      }).then(() => {
        getPriorityFunction();
        getRequestType();

      })
      .then(() => {
        // getSettings();
      })
  }


  //TO FETCH CUSTOM COLUMNS
  async function getCustomCoulmns() {
    // 
    // let teamArray = [];
    let ColumnPropertiesvalue = {};
    let ColumnDecriptionvalue = [];
    ColumnProperties = [];
    let _SubColumnProperties = [];
    let ColumnDescription = [];
    fieldemploye = [];
    Choicesubarray = [];
    let _ConditionsofColumn = []
    AllColumnConditionsArray = [];
    // _Choicesubarray = [];
    ContextService.GetSPContext()
      .get(
        `${getIsInstalled?.SiteUrl}/_api/web/lists/getbytitle('HR365HDMCustomColumns')/items?$select=*&$filter=Active eq 'Yes'`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "odata-version": "",
          },
        }
      )
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((items: any) => {
        allTicketDescriptionColumns = []
        allDateTypeColumns = [];
        items.value.map((templ) => {
          if (templ.Type1 == 'DateTime') {
            allDateTypeColumns.push(templ)
          }
          if (templ.Category == "Ticket Description") {
            allTicketDescriptionColumns.push(templ);
          }
          var _dropsubvalues;
          Choicearray = [];
          // Choicesubarray = [];
          if (templ.Type1 == "Choice" || templ.Type1 == "MultipleChoice") {
            if (templ.ColumnValues == null || templ.ColumnValues == undefined || templ.ColumnValues == "") {
              dropvalues = "";
            } else {
              // dropvalues.push(templ.ColumnValues)
              dropvalues = templ.ColumnValues.split(",");
              dropvalues.map((i) => {
                Choicearray.push({
                  key: i, text: i
                })
              })
            }
            if (templ.ColumnConditions == null || templ.ColumnConditions == undefined || templ.ColumnConditions == "") {
              ColumnConditionValue = "";
            } else {
              ColumnConditionValue = JSON.parse(templ.ColumnConditions);
              columnConditionBasedRender = ColumnConditionValue;
              // AllColumnConditionsArray = AllColumnConditionsArray.concat(ColumnConditionValue);

              // setAllColumnConditionsArrayState(AllColumnConditionsArray);
              // setColumnConditions([...ColumnConditionValue]);
            }

          }
          if (templ.DefultValue != null && templ.DefultValue != undefined) {
            if (templ.Type1 == "MultipleChoice") {

              CustomDateData[templ.Title] = templ.DefultValue;
              forrendercontent();
            }
            if (templ.Type1 == "Choice") {
              dataChoice2[templ.Title] = templ.DefultValue;
            }
          }
          // if (templ.Category == "Ticket Property") {
          let ColumnPropertiesvalue = [{
            InternalName: templ.Title,
            DisplayName: templ.ColumnName,
            Type: templ.Type1,
            ChoiceValue: Choicearray,
            TicketProperty: templ.Category,
            DefultValue: templ.DefultValue
          }];
          let ColumnPropertiesvalueforPicker = {
            InternalName: templ.Title,
            DisplayName: templ.ColumnName,
            Type: templ.Type1,
            ChoiceValue: Choicearray,
            TicketProperty: templ.Category,
            DefultValue: templ.DefultValue
          }
          ColumnProperties.push([...ColumnPropertiesvalue]);

          fieldemploye.push(ColumnPropertiesvalueforPicker);
          setColumnProprties(ColumnProperties);



          // let _AccordingForm = ColumnProperties.filter((item)=>{
          //       item.DisplayName.includes(ticketOrder)
          // })


          if (templ.Type1 == "Choice" || templ.Type1 == "MultipleChoice") {
            if (templ.SubColumnValues == null || templ.SubColumnValues == undefined || templ.SubColumnValues == "") {
              _dropsubvalues = "";
            } else {
              // _dropsubvalues.push(templ.SubColumnValues)
              _dropsubvalues = JSON.parse(templ.SubColumnValues);
              // _dropsubvalues = templ.SubColumnValues.map((i)=> {
              // i.split('$')
              // })
              _dropsubvalues.map((i) => {
                Choicesubarray.push({
                  key: i.maincolumn,
                  text: i.SubColumnValues
                  //  key: i.split("|_|")[0],
                  //  text: i.split("|_|")[1]
                });
              })




              //  _Choicesubarray.map((i) =>{
              //     choicesubvalueoptions.push({
              //     key: i
              //   })
              //   // text:templ.ColumnValues
              // })
              // })
            }
          }

          let _SubColumnPropertiesvalue = [{
            InternalName: templ.Title,
            DisplayName: templ.ColumnName,
            ParentColumnName: templ.SubColumnParentName,
            SubColumnType: templ.SubColumnType,
            ChoiceValue: Choicesubarray,
            TicketProperty: templ.Category,
            IsSubColumn: templ.IsSubColumn,
            DefultValue: templ.DefultValue,
          }];
          _SubColumnProperties.push([..._SubColumnPropertiesvalue].filter((item) => {
            return item.IsSubColumn == "Yes";
          })
          )



          setSubColumnProprties(_SubColumnProperties);


        });


        // var filteredArray = ColumnProperties.filter((item) => {
        //   return FieldsNames.includes(item[0].InternalName);
        // })
        // 
        // let filteredX = ColumnProperties.filter(itemX => !FieldsNames.includes(itemX.DisplayName));
        // 
        // var filteredArray  = FieldsNames.filter(function(array_el){
        //   return ColumnProperties.filter(function(anotherOne_el){
        //      return anotherOne_el[0].DisplayName == array_el;
        //   }).length == 0
        // });
        // setColumnProprties(filteredArray);

        // setColumnProprties(filteredArray);
        forrendercontent();
      }).then(() => {
        getSettings();
      })
  }

  //for ticket prefix

  React.useEffect(() => {
    let web = new Web(getIsInstalled?.SiteUrl);
    web.lists
      .getByTitle("HR365HDMUsers")
      .items.select('*,ID,Roles,Users/Id,Users/Title,UsersId,Email,Department,Roles,TicketCount&$expand=Users').get()
      .then((data) => {
        let ProcessTypeoptions1 = [];
        //  let file = attachFile[0];

        // for(var y = 0; y < data.length; y++){
        //   

        //   ProcessTypeoptions1.push({text:data[y].SubCategory,key:data[y].SubCategory,team:data[y].DepartCode});

        // }

        setTUserList(data);

      });
  }, []);

  var qwe = getIsInstalled?.SiteUrl;
  React.useEffect(() => {

    var url = getIsInstalled?.SiteUrl + "/_api/web/lists/getbytitle('HR365HDMTicketFieldSettings')/items?$top=1&$orderby=Created desc";
    ContextService.GetSPContext()
      .get(url, SPHttpClient.configurations.v1, {
        headers: {
          Accept: "application/json;odata=nometadata",
          "odata-version": "",
        },
      })
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((data) => {

        if (isArrayValidated(data.value[0])) {
          let TicketFieldsMemberData = data.value[0].TicketFieldsForMember?.split(',');
          let TicketFieldsUsersData = data.value[0].TicketFieldsForUser?.split(',');
          DargDropTicketFields = data.value[0].TicketsFieldsDrag?.split(',');
          if (DargDropTicketFields != null && DargDropTicketFields != undefined) {
            TicketFieldsUsers = DargDropTicketFields?.filter(item => TicketFieldsUsersData.includes(item));

            if (!TicketFieldsUsers.includes('Ticket Description') && !TicketFieldsUsers.includes('Description')) {
              TicketFieldsUsers.push('Ticket Description');
            }

            TicketFieldsMember = DargDropTicketFields?.filter(item => TicketFieldsMemberData.includes(item));

            if (!TicketFieldsMember.includes('Ticket Description') && !TicketFieldsMember.includes('Description')) {
              TicketFieldsMember.push('Ticket Description');
            }
          }



          if (TicketFieldsMemberData == null || TicketFieldsMemberData == '' || TicketFieldsMemberData == undefined || TicketFieldsUsersData == '' || TicketFieldsUsersData == null || TicketFieldsUsersData == undefined) {

            var y = data.value[0].Priority;
            if (y == "Yes") {
              setPriorityDisable(true);
            } else {
              setPriorityDisable(false);
            }
            var x = data.value[0].Teams;
            if (x == "Yes") {
              setTeamDisable(true);
            } else {
              setTeamDisable(false);
            }

            var z = data.value[0].Requesttype;
            if (z == "Yes") {
              setRequestDisable(true);
            } else {
              setRequestDisable(false);
            }

            var a = data.value[0].Services;
            if (a == "Yes") {
              setServiceDisable(true);
            } else {
              setServiceDisable(false);
            }

            var d = data.value[0].SubServices;
            if (d == "Yes") {
              setsubserviceDisable(true);
            } else {
              setsubserviceDisable(false);
            }
          }
        }
        setServiceDisable(true);
        setRequestDisable(true);
        setTeamDisable(true);
        setPriorityDisable(true);
        setsubserviceDisable(true);



      });


  }, []);

  const onTextChange = (newText: string) => {
    setGlobalMessage(newText);
    //setBirthday(newText);

    return newText;
  };


  function _getPeoplePickerItems(items: any[]) {
    let currentuser = ContextService.GetCurrentUser();
    // 
    // 
    if (items.length == 0) {
      setrequesterName([]);
      setRequesterEmailId("");
      setReqName("");
    }
    else {
      setrequesterName(items);
      setRequesterEmailId(items[0].secondaryText);
      setReqName(items[0].text);
    }


    if (items[0].secondaryText != currentuser.loginName) {
      setMediaFieldToShow(true);
    } else if (items[0].secondaryText == currentuser.loginName) {
      setMediaFieldToShow(false);
    } else {
      setMediaFieldToShow(false);

    }
  }

  const messageDismiss = () => {
    setSaved(false);
    setError(false);
    setNewerror(false);
    // setNewerror1(false);
    setNewerror2(false);
    setNewerror3(false);
    setNewerror4(false);
    setNewerror5(false);
    setNewerror6(false);
    setNewerror7(false);
    setNewerror8(false);
    setNewerrorService(false);
    setNewerrorSubService(false);

  };



  function RoundRobin() {
    let _Team = team;
    let _RoundRobin = [];
    let lastassignuser = [];
    let currentId;
    let flag = false;
    _RoundRobin = teamsData.filter((data) => {
      if (data.Title == _Team) {
        currentId = data.ID;
        lastassignuser.push(data.LastAssignTicketId);
      }
      return data.Title == _Team;
    });
    if (
      _RoundRobin[0].Teammembers1Id == null ||
      _RoundRobin[0].Teammembers1Id == "" ||
      _RoundRobin[0].Teammembers1Id == undefined
    ) {
      AutoAssignTicket = "Off";
      flag = true;
    }
    let RoundRobinUsers = _RoundRobin[0].Teammembers1Id;
    let index = "";
    if (
      (lastassignuser[0] != null &&
        lastassignuser[0] != "" &&
        lastassignuser[0] != undefined
      )
      &&
      (RoundRobinUsers != null &&
        RoundRobinUsers != "" &&
        RoundRobinUsers != undefined
      )
    ) {
      index = RoundRobinUsers.findIndex((fruit) => fruit === lastassignuser[0]);
    }
    // let  userFromList = userList.filter(item => RoundRobinUsers.includes(item.UsersId));
    if (!flag) {
      if (
        lastassignuser[0] == null ||
        lastassignuser[0] == "" ||
        lastassignuser[0] == undefined ||
        parseInt(index) == RoundRobinUsers.length - 1
      ) {
        setAssignTo(RoundRobinUsers[0]);
        lastAssignid = RoundRobinUsers[0];
        postlastAssign(currentId);
      } else {
        for (var i = 0; i < RoundRobinUsers.length; i++) {
          if (RoundRobinUsers.includes(lastassignuser[0])) {

            if (RoundRobinUsers[i] == lastassignuser[0]) {
              // if(i<(RoundRobinUsers.length-1)){
              let user = RoundRobinUsers[i + 1] == undefined ? RoundRobinUsers[0] : RoundRobinUsers[i + 1];
              lastAssignid = user;
              setAssignTo(user);
              postlastAssign(currentId);
              // }else{
              //   setAssignTo(RoundRobinUsers[0]);
              // }
            }
          }
          else {
            let user = RoundRobinUsers[0]
            lastAssignid = user;
            setAssignTo(user);
            postlastAssign(currentId);
          }
        }
      }

    }
  }

  function weightRound() {
    let _Team = team;
    let currentId;
    let _RoundRobin = [];
    let flag = false;
    _RoundRobin = teamsData.filter((data) => {
      // if (data.Title == _Team){
      //   currentId= data.ID;
      //   lastassignuser.push(data.LastAssignTicketId);
      // }
      return data.Title == _Team;
    });
    if (
      _RoundRobin[0].Teammembers1Id == null ||
      _RoundRobin[0].Teammembers1Id == "" ||
      _RoundRobin[0].Teammembers1Id == undefined
    ) {
      AutoAssignTicket = "Off";
      flag = true;
    }
    if (!flag) {
      let WeightRobinUser = _RoundRobin[0].Teammembers1Id;
      const filteredUser = userList.filter((value) =>
        WeightRobinUser.includes(value.UsersId)
      );

      filteredUser.sort((a, b) => {
        return a.TicketCount - b.TicketCount;
      });
      let finalUser = filteredUser[0];

      lastAssignid = finalUser.UsersId;
      currentId = finalUser.ID;
      let count;
      if (
        finalUser.TicketCount == null ||
        finalUser.TicketCount == "" ||
        finalUser.TicketCount == undefined
      ) {
        count = 0;
      } else {
        count = parseInt(finalUser.TicketCount);
      }
      let currentCount = count + 1;
      postTicketCount(currentId, currentCount);
    }
  }

  function postTicketCount(currentId, currentCount) {
    let data = `${currentCount}`;
    const body: string = JSON.stringify({
      TicketCount: data,
    });
    var _url =
      getIsInstalled?.SiteUrl +
      "/_api/web/lists/getbytitle('HR365HDMUsers')/items('" +
      currentId +
      "')";
    ContextService.GetSPContext()
      .post(_url, SPHttpClient.configurations.v1, {
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-type": "application/json;odata=nometadata",
          "odata-version": "",
          "IF-MATCH": "*",
          "X-HTTP-Method": "MERGE",
        },
        body: body,
      })
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          // setSaved(true);
          // setTimeout(() => {
          //   messageDismiss();
          // }, 1000);
        } else {
          response.json().then((responseJSON) => {

            // setError(true);
          });
        }
      });
  }

  function postlastAssign(currentId) {
    const body: string = JSON.stringify({
      LastAssignTicketId: lastAssignid,
    });
    var _url =
      getIsInstalled?.SiteUrl +
      "/_api/web/lists/getbytitle('HR365HDMDepartments')/items('" +
      currentId +
      "')";
    ContextService.GetSPContext()
      .post(_url, SPHttpClient.configurations.v1, {
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-type": "application/json;odata=nometadata",
          "odata-version": "",
          "IF-MATCH": "*",
          "X-HTTP-Method": "MERGE",
        },
        body: body,
      })
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
          // setSaved(true);
          // setTimeout(() => {
          //   messageDismiss();
          // }, 1000);
        } else {
          response.json().then((responseJSON) => {

            // setError(true);
          });
        }
      });
  }

  //  for(var i=0; i<userFromList.length; i++){
  //   if(userFromList[i].RoundRobin==null){
  //     userFromList[i].RoundRobin=true;
  //     break;
  //   }
  // }
  //   if(userFromList[i].RoundRobin==null){
  //     userFromList[i].RoundRobin=true;
  //     if( userFromList[i].TicketCount==null){
  //       userFromList[i].TicketCount=0;
  //     }
  //     userFromList[i].TicketCount=userFromList[i].TicketCount+1;
  //     ticketAsigned=true;
  //     break;
  //   }

  // }
  //  if(ticketAsigned!=true){
  //    for(var i=0; i<userFromList.length; i++){
  //   if(userFromList[i+1].TicketCount==null){

  //     userFromList[i].TicketCount=userFromList[i].TicketCount+1;

  //     break;
  //   }
  //   if(userFromList[i+1].TicketCount)

  // }

  //   }
  // }

  // function Savetheme() {
  //   //
  //   // 
  //   let requester = " ";
  //   if (requestername.length > 0) {
  //     requester = requestername[0].id;
  //   } else {
  //     requester = null;
  //   }

  //   let flag = false;
  //   let flag1 = false;
  //   let flag2 = false;
  //   let flag3 = false;
  //   let flag4 = false;
  //   if (
  //     Titlename == null ||
  //     Titlename == "" ||
  //     Titlename == undefined ||
  //     Titlename.trim() == null ||
  //     Titlename.trim() == "" ||
  //     Titlename.trim() == undefined
  //   ) {
  //     setNewerror(true);
  //     setTimeout(() => {
  //       messageDismiss();
  //     }, 2000);
  //     flag = true;
  //   }
  //   if (requestname == null || requestname == "" || requestname == undefined) {
  //     if(requestDisable == true){
  //     setNewerror(true);
  //     setTimeout(() => {
  //       messageDismiss();
  //     }, 2000);
  //     flag1 = true;
  //   }
  //   }
  //   if (priorityName == null ||priorityName == "" || priorityName == undefined) {
  //     if(priorityDisable == true){
  //     setNewerror(true);
  //     setTimeout(() => {
  //       messageDismiss();
  //     }, 2000);
  //     flag2 = true;
  //   }
  //   }
  //   if (requester == null || requester == "" || requester == undefined) {
  //     setNewerror(true);
  //     setTimeout(() => {
  //       messageDismiss();
  //     }, 2000);
  //     flag3 = true;
  //   }
  //   if (
  //     globalMessage == null ||
  //     globalMessage == "" ||
  //     globalMessage == undefined
  //   ) {
  //     setNewerror(true);
  //     setTimeout(() => {
  //       messageDismiss();
  //     }, 2000);
  //     flag4 = true;
  //   }
  //   if (autoTicket !== "Off") {
  //     if (autoAssignMethod == "RoundRobin") {
  //       RoundRobin();
  //     } else if (autoAssignMethod == "WeightedRoundRobin") {
  //       weightRound();
  //     }
  //   }

  //   // let useridofAuto=${autoTicket=="Off"?[]:lastAssignid}

  //   // alert("SAVED")
  //   let finalTemplate;
  //   if (autoTicket == "Off") {
  //     finalTemplate = {
  //       Title:
  //         Titlename == "" || Titlename == null || Titlename == undefined
  //           ? Titlename
  //           : Titlename.trim(),
  //       DepartmentName: team,
  //       Services: servicename,
  //       Priority: priorityName,
  //       RequestType: requestname,
  //       RequesterId: requester,
  //       Body: globalMessage,
  //       DepartmentCode: teamname,
  //       RequesterEmail: requesterEmailId,
  //     };
  //   } else {
  //     finalTemplate = {
  //       Title:
  //         Titlename == "" || Titlename == null || Titlename == undefined
  //           ? Titlename
  //           : Titlename.trim(),
  //       DepartmentName: team,
  //       Services: servicename,
  //       Priority: priorityName,
  //       RequestType: requestname,
  //       RequesterId: requester,
  //       Body: globalMessage,
  //       DepartmentCode: teamname,
  //       AssignedToId: lastAssignid,
  //       RequesterEmail: requesterEmailId,
  //     };
  //   }
  //   if (!flag && !flag1 && !flag2 && !flag3 && !flag4) {
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
  //       //.then((response: SPHttpClientResponse):void => {

  //       //   if (response.ok) {
  //       //     setSaved(true);
  //       //     //getmailboxmgr();
  //       //     setTimeout(() => {
  //       //       messageDismiss();
  //       //       //getTeams();
  //       //     }, 5000);

  //       //     } else {
  //       //       response.json().then((responseJSON) => {
  //       //         
  //       //         setError(true);
  //       //       });
  //       //     }
  //       //  }
  //       //  return response.json();
  //       //  )

  //       .then((item: any) => {
  //         if (attachFile2 != null || attachFile2 !== undefined) {
  //           saveFile(item.Id);
  //         }
  //         setTicketId(item.Id);
  //         rowId = item.Id;

  //         
  //         setSaved(true);
  //         setTimeout(() => {
  //           setLoading(false);
  //           setButtonSaveText(Language.Submit? Language.Submit:"Submit");
  //           // saveTicketId();
  //           messageDismiss();
  //         }, 1000);
  //         setTimeout(() => {
  //           saveTicketId();
  //         }, 1200);
  //         setTimeout(() => {
  //           UnAssign();
  //           props.closePanel();
  //         }, 1500);
  //       })
  //       .catch((error) => {
  //         
  //         setError(true);
  //         setLoading(false);
  //         setButtonSaveText(Language.Submit? Language.Submit:"Submit");
  //         setTimeout(() => {
  //           messageDismiss();
  //         }, 3000);
  //       });
  //   }
  // // }
  // function eventhandle(e){
  //   e.preventDefault();
  // const Toast = Swal.mixin({
  //   // target: '#TitlePopup',
  //   toast: true,
  //   position: 'bottom-end',
  //   showConfirmButton: true,
  //   timer: 30000,
  //   timerProgressBar: true,
  //   didOpen: (toast) => {

  //     toast.addEventListener('mouseenter', Swal.stopTimer)
  //     toast.addEventListener('mouseleave', Swal.resumeTimer)
  //   }
  // })
  // }

  function _getCCMailPeoplePicker(items: any[]) {

    if (items.length == 0) {
      setccemailid("");

    }
    else {

      var emails = items.map(x => x.secondaryText)
      setccemailid(emails.toString());
    }
  }

  const fillOptionsOfTeamsDropdown = () => {
    let TeamsEmails = [];
    let Describation = [];
    let FilterMyTeams = [];
    ContextService.GetGraphContext()
      .getClient('3')
      .then((client: MSGraphClientV3) => {
        client
          .api("https://graph.microsoft.com/beta/teams")
          .version("beta")
          .get((err, res) => {
            if (err) {

            }
            else {
              let optionsArray = []
              res.value.map((e) => {
                if (e.description != '' && e.description != undefined && e.description != null) {
                  Describation = e.description.split(',')
                }
                for (let i = 0; i < Describation.length; i++) {
                  if (Describation[i] != '' && Describation[i] != null && Describation[i] != undefined) {

                    TeamsEmails.push(Describation[i]);
                  }
                }
                let finaltemp = {
                  key: e.id,
                  text: e.displayName,
                  Name: e.displayName == null || e.displayName == undefined || e.displayName == "" ? "" : e.displayName,
                  TeamsMembers: TeamsEmails,
                  Supervisor: TeamsEmails,
                }
                TeamsEmails = [];
                optionsArray.push(finaltemp);
                FilterMyTeams = optionsArray.filter(x => x.text.includes('Helpdesk 365'));


                MSTeamsID = FilterMyTeams.filter((item) => {
                  let SplitName = item.Name.substr(('Helpdesk 365 ').length);
                  if (SplitName == teamname) {
                    return item
                  }
                })






              });
              if (MSTeamsID.length > 0 && MSTeamsID != undefined && MSTeamsID != null) {
                GetFilteredMSTeamId();
              }




            }
          })
      });

  };

  const GetFilteredMSTeamId = () => {
    let TeamsEmails = [];
    let Describation = [];
    let FilterMyTeams = [];
    ContextService.GetGraphContext()
      .getClient('3')
      .then((client: MSGraphClientV3) => {
        client
          .api(`https://graph.microsoft.com/beta/teams/${MSTeamsID[0].key}`)
          .version("beta")
          .get((err, res) => {
            if (err) {

            }
            else {

              // res.map((e) => {
              //   if (e.description != '' && e.description != undefined && e.description != null) {
              //     Describation = e.description.split(',')
              //   }
              //   for (let i = 0; i < Describation.length; i++) {
              //     if (Describation[i] != '' && Describation[i] != null && Describation[i] != undefined) {
              //       
              //       TeamsEmails.push(Describation[i]);
              //     }
              //   }
              let finaltemp = {
                key: res.id,
                text: res.internalId,
                Name: res.displayName == null || res.displayName == undefined || res.displayName == "" ? "" : res.displayName,
                // TeamsMembers: TeamsEmails,
                // Supervisor: TeamsEmails,
              }
              TeamsEmails = [];
              optionsArray2.push(finaltemp);
              if (optionsArray2.length > 0 && optionsArray2 != null && optionsArray2 != undefined)
                AdaptiveCard(optionsArray2);
              // })



            }
          })
      });

  };

  function AdaptiveCard(TeamsID) {
    const AdaptiveCardData = {
      "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
      "version": "1.2",
      "type": "AdaptiveCard",
      "body": [
        {
          "type": "TextBlock",
          "size": "medium",
          "weight": "bolder",
          "text": `New Ticket Logged (ID - ${finalticketID}`
        },
        {
          "type": "ColumnSet",
          "columns": [
            {
              "type": "Column",
              "items": [
                {
                  "type": "TextBlock",
                  "weight": "bolder",
                  "text": `Category - ${team}`,
                  "wrap": true
                },
                {
                  "type": "TextBlock",
                  "spacing": "none",
                  "text": "Created on ${dialog.api_responsenewtick.content.fields.Created}",
                  "isSubtle": true,
                  "wrap": true
                }
              ],
              "width": "stretch"
            }
          ]
        },
        {
          "type": "TextBlock",
          "text": `Description - ${globalMessage}`,
          "wrap": true
        },
        {
          "type": "FactSet",
          "facts": [
            {
              "title": "Priority:",
              "value": `${priorityName}`
            },
            {
              "title": "Current Status:",
              "value": "Unassigned"
            },
            {
              "title": "Logged By",
              "value": `${requestername}`
            }
          ]
        }
      ],
      "actions": [
        {
          "type": "Action.OpenUrl",
          "title": "View",
          "url": "${user.WebURL}/Ticket/${concat(toUpper(substring(newGuid(), 0,4)),dialog.finalticketID,toUpper(substring(newGuid(), 0,int(sub(12,add(4,int(length(dialog.finalticketID))))))))}"
        }
      ]
    };

    PostBoatSettingData(AdaptiveCardData, TeamsID)

  }



  const PostBoatSettingData = (AdaptiveCardData, TeamsID) => {

    const Body = {
      "body": {
        "content": AdaptiveCardData
      }
    }
    ContextService.GetGraphContext()
      .getClient('3')
      .then((client: MSGraphClientV3) => {
        client
          .api(`/chats/${TeamsID[0].text}/messages`)
          .version('beta')
          .post(Body);




      });
  }





  function SubmitTicket() {
    let AlldesccolumnsValues = []
    let autoAssignEmailId = null;
    let requester = " ";
    let requesterDisplayName = "";
    let internalexternal = "";
    if (requestername.length > 0) {
      requester = requestername[0].id;
      requesterDisplayName = requestername[0].name;
    } else {
      requester = null;
    }
    TicketPropertiesValue.push({
      TicketOpenDate: "",
      InternalExtrenal: "Internal",
      CCMail: ccemailid,
      Read: "Unread",
      DepartmentCode: teamname,
      SubTickets: "",
      LastSubTicketCharacter: "",
      MediaSource: mediaChoosed,
      CustomFormID: isStringValidated(CustomFormID) ? CustomFormID : '',
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
    let flag2 = false;
    let flag3 = false;
    let flag4 = false;
    let flag5 = false;
    let flag6 = false;
    let flag7 = false;
    if (
      (Titlename == null ||
        Titlename == "" ||
        Titlename == undefined ||
        Titlename.trim() == null ||
        Titlename.trim() == "" ||
        Titlename.trim() == undefined) && MandatoryFields?.includes("Title")
    ) {
      setNewerror2(true);
      settitlename("");
      setTimeout(() => {
        messageDismiss();
      }, 2000);
      flag = true;
    }
    if (requestname == null || requestname == "" || requestname == undefined) {
      setNewerror3(true);
      setTimeout(() => {
        messageDismiss();
      }, 2000);
      flag1 = true;
    }
    if (
      (priorityName == null ||
        priorityName == "" ||
        priorityName == undefined) && MandatoryFields?.includes("Priority")
    ) {
      setNewerror4(true);
      setTimeout(() => {
        messageDismiss();
      }, 2000);
      flag2 = true;
    }
    if (
      (servicename == null ||
        servicename == "" ||
        servicename == undefined) && MandatoryFields?.includes("Services")
    ) {
      setNewerrorService(true);
      setTimeout(() => {
        messageDismiss();
      }, 2000);
      flag6 = true;
    }
    if (
      (subservicename == null ||
        subservicename == "" ||
        subservicename == undefined) && MandatoryFields?.includes("Sub Services")
    ) {
      setNewerrorSubService(true);
      setTimeout(() => {
        messageDismiss();
      }, 2000);
      flag6 = true;
    }
    if (requester == null || requester == "" || requester == undefined) {
      setNewerror5(true);
      setTimeout(() => {
        messageDismiss();
      }, 2000);
      flag3 = true;
    }
    if (
      (globalMessage == null ||
        globalMessage == "" ||
        globalMessage == undefined) && MandatoryFields?.includes("Ticket Description")
    ) {
      setNewerror6(true);
      setTimeout(() => {
        messageDismiss();
      }, 2000);
      flag4 = true;

    }
    if (
      (team == null ||
        team == "" ||
        team == undefined) && MandatoryFields?.includes("Teams")
    ) {
      setNewerror7(true);
      setTimeout(() => {
        messageDismiss();
      }, 2000);
      flag5 = true;
    }
//Sahil
    if (AutoAssignTicket !== "Off") {
      if (AutoAssignTicketMethod == "RoundRobin") {
        RoundRobin();
      } else if (AutoAssignTicketMethod == "WeightedRoundRobin") {
        weightRound();
      }

      var filtered = userList.filter((item) => {
        return (item.UsersId == lastAssignid);
      });
      filtered.map((i) => {
        autoAssignEmailId = i.Email;
      });
    }
   // let FilterWorkFlowFilterData;
    // if (WorkFlowData != null && WorkFlowData.length > 0 && WorkFlowData != undefined) {
    //   // let withoutsubserviceWorkflow = WorkFlowData.filter(x => !isStringValidated(x.SubServiceName))      
    //   FilterWorkFlowFilterData = WorkFlowData.findIndex((i) => {
    //     if (!isStringValidated(i.SubServiceName)) {

    //       return (i.DepartmentName?.includes(team) && i.ServiceName?.split(',')?.includes(servicename))
    //     }
    //   })
    //   if (subservicename != null && subservicename != '' && subservicename != undefined) {
    //     let subserviceWorkflow = WorkFlowData.filter(x => isStringValidated(x.SubServiceName))


    //     let index = subserviceWorkflow.findIndex((i) => {
    //       if (isStringValidated(i.SubServiceName)) {
    //         return i.DepartmentName?.includes(team) && i.ServiceName?.split(',')?.includes(servicename) &&
    //           i.SubServiceNames?.startsWith(',') ? i.SubServiceName?.slice(1)?.split(',')?.includes(subservicename) :
    //           i.SubServiceName?.split(',')?.includes(subservicename)
    //       }
    //     })
    //     if (index > -1) {
    //       FilterWorkFlowFilterData = index

    //     }



    //   }
    // }

    ///Sahil

    groups.forEach((e) => {
      if (e.name === "HDM365Admin" || e.name === "HDM365PowerUser" || e.name === "HDM365" + teamname) {
        allid.push(e.id)
      }
    })
    allid.push(requester)
    let finalTemplate;
    //Sahil
    if (AutoAssignTicket == "Off" ) {
      finalTemplate = {
        Title:
          Titlename == "" || Titlename == null || Titlename == undefined
            ? Titlename
            : Titlename.trim(),
        DepartmentName: team,
        Services: servicename,
        SubServices: subservicename,
        SubServicesL2: level2SubServicedefault,
        SubServicesL3: level3Subservicedefault,
        Priority: priorityName,
        RequestType: requestname,
        RequesterId: requester,
        TicketDescription: globalMessage,
        TicketDescInTextformat: globalMessage.replace(/<[^>]*>/g, ''),
        //DepartmentCode: teamname,
        TicketProperties: JSON.stringify(TicketPropertiesValue),
        RequesterEmail: requesterEmailId,
        RequesterName: requesterDisplayName,
        TicketCreatedDate: new (Date),
        SLAResponseDone: "No",
        SLAResolveDone: "No",
        SLAResponseInfo: JSON.stringify(SLAResponseInfo),
        SLAResolveInfo: JSON.stringify(SLAResolveInfo),
        ...CustomDateData,
        ReadStatus: '',
        // ItemPermissionId:allid
      };
    } else {
      finalTemplate = {
        Title:
          Titlename == "" || Titlename == null || Titlename == undefined
            ? Titlename
            : Titlename.trim(),
        DepartmentName: team,
        Services: servicename,
        SubServices: subservicename,
        Priority: priorityName,
        RequestType: requestname,
        RequesterId: requester,
        SubServicesL2: level2SubServicedefault,
        SubServicesL3: level3Subservicedefault,
        TicketDescription: globalMessage,
        TicketDescInTextformat: globalMessage.replace(/<[^>]*>/g, ''),
        //DepartmentCode: teamname,
        TicketProperties: JSON.stringify(TicketPropertiesValue),
        AssignedToId: lastAssignid.length == 0 ? null : lastAssignid,
        // assignedT0:
        // finalTemplate.AssignedTo == null ? null : finalTemplate.AssignedTo.Title,
        RequesterEmail: requesterEmailId,
        RequesterName: requesterDisplayName,
        AssignedTomail: autoAssignEmailId,
        TicketCreatedDate: new (Date),
        SLAResponseDone: "No",
        SLAResolveDone: "No",
        SLAResponseInfo: JSON.stringify(SLAResponseInfo),
        SLAResolveInfo: JSON.stringify(SLAResolveInfo),
        ...CustomDateData,
        ReadStatus: '',
        // ItemPermissionId:allid
      };
    }
    // //Sahil
    // finalTemplate = {
    //   Title:
    //     Titlename == "" || Titlename == null || Titlename == undefined
    //       ? Titlename
    //       : Titlename.trim(),
    //   DepartmentName: team,
    //   Services: servicename,
    //   SubServices: subservicename,
    //   SubServicesL2: level2SubServicedefault,
    //   SubServicesL3: level3Subservicedefault,
    //   Priority: priorityName,
    //   RequestType: requestname,
    //   RequesterId: requester,
    //   TicketDescription: globalMessage,
    //   TicketDescInTextformat: globalMessage.replace(/<[^>]*>/g, ''),
    //   //DepartmentCode: teamname,
    //   TicketProperties: JSON.stringify(TicketPropertiesValue),
    //   RequesterEmail: requesterEmailId,
    //   RequesterName: requesterDisplayName,
    //   TicketCreatedDate: new (Date),
    //   SLAResponseDone: "No",
    //   SLAResolveDone: "No",
    //   SLAResponseInfo: JSON.stringify(SLAResponseInfo),
    //   SLAResolveInfo: JSON.stringify(SLAResolveInfo),
    //   ...CustomDateData,
    //   ReadStatus: '',
    //   // ItemPermissionId:allid
    // };
    if (dataText != null) {
      var key;
      for (let value of Object.entries(dataText)) {
        // finalTemplate[value[0].replace(' ','_x0020_')] = value[1];
        finalTemplate[value[0]] = value[1];
      }

    }
    if (dataNote != null) {
      var key;
      for (let value of Object.entries(dataNote)) {
        finalTemplate[value[0]] = value[1];
      }
    }
    if (dataNumber != null) {
      var key;
      for (let value of Object.entries(dataNumber)) {
        finalTemplate[value[0]] = value[1];
      }
    }

    if (dataChoice2 != null) {
      var key;
      for (let value of Object.entries(dataChoice2)) {
        finalTemplate[value[0]] = value[1];
      }
    }
    if (dataChoiceforsub != null) {
      var key;
      for (let value of Object.entries(dataChoiceforsub)) {
        finalTemplate[value[0]] = value[1];
      }
    }
    var Errmessage = "";
    ColumnProperties.map((item) => {
      const ExistingMainColumn = ticketOrder.filter((elem) => {
        return item[0].InternalName == elem.InternalName;
      });
      if (LicenseType.toLowerCase() == "p4" || LicenseType.toLowerCase() == "trial") {
        if (!isStringValidated(finalTemplate[item[0].InternalName]) && ((ExistingMainColumn.length > 0 && MandatoryFields?.includes(item[0].InternalName)))) {
          Errmessage = "Please fill the " + item[0].DisplayName;
          RequiredColumnName = item[0].DisplayName;
        }
      }
    })
    for (let i = 0; i < allTicketDescriptionColumns.length; i++) {
      if (isStringValidated(finalTemplate[allTicketDescriptionColumns[i]['Title']])) {
        if (allTicketDescriptionColumns[i].Type1 == "DateTime") {
          AlldesccolumnsValues.push(`<p id=${allTicketDescriptionColumns[i]['Title']}><b>${allTicketDescriptionColumns[i]['ColumnName']}</b>: ${moment(finalTemplate[allTicketDescriptionColumns[i]['Title']]).format(dateFormart)}</p>`)
        }
        else if (allTicketDescriptionColumns[i].Type1 == "User") {
          let UserCulmData = isStringValidated(finalTemplate[allTicketDescriptionColumns[i]['Title']]) ? JSON.parse(finalTemplate[allTicketDescriptionColumns[i]['Title']]) : "";
          AlldesccolumnsValues.push(`<p id=${allTicketDescriptionColumns[i]['Title']}><b>${allTicketDescriptionColumns[i]['ColumnName']}</b>: ${UserCulmData[0].Name}</p>`)
        }
        else {

          AlldesccolumnsValues.push(`<p id=${allTicketDescriptionColumns[i]['Title']}><b>${allTicketDescriptionColumns[i]['ColumnName']}</b>: ${finalTemplate[allTicketDescriptionColumns[i]['Title']]}</p>`)
        }
      }
    }

    if (AlldesccolumnsValues.length) {
      finalTemplate.TicketDescription = finalTemplate.TicketDescription + AlldesccolumnsValues.join('')
    }
    if (!flag && !flag1 && !flag2 && !flag3 && !flag4 && !flag5 && !flag6 && !flag7 && Errmessage == "") {
      setLoading(true);
      setButtonSaveText("");
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
          setTimeout(()=>{
           setExpandMode(false);
          },2000);
          setGlobalMessage("");
          ReactQuilRenderer((prev) => prev + "1");
          if (item['odata.error']) {
            if ((JSON.stringify(item['odata.error'])).includes("Access is denied")) {
              showDialogAccessDenied();
            };
            setTimeout(() => {
              setLoading(false);
              messageDismiss();
              setButtonSaveText(Language.Submit ? Language.Submit : "Submit");
            }, 2000);

          } else {
            if (attachFile2 || attachFile2 !== undefined) {
              saveFile(item.Id);
            }
            setatt = [];
            setatt1 = [];
            setattachFile1([]);
            setattachFile2([]);
            setTicketId(item.Id);
         // Sahil // WorkFlowFilterData(item.DepartmentName, item.Services, item.SubServices);
            UpdateTicketsProperties = isStringValidated(item.TicketProperties) ? JSON.parse(item.TicketProperties) : [];
            setTicketPropJOSNUpdate(UpdateTicketsProperties);
            rowId = item.Id;
            window.scrollTo(0, 0);
            setSaved(true);
            setTimeout(() => {
              setLoading(false);
              setButtonSaveText(Language.Submit ? Language.Submit : "Submit");
              // saveTicketId();
              messageDismiss();
            }, 1000);
            setTimeout(() => {
              getAutomationData(item);
              saveTicketId();
            }, 1200);
            setTimeout(() => {
            }, 2000);
            setTimeout(() => {
              CustomDateData = {};
              ResetFields();
            }, 1400);
          }
        })
        .catch((error) => {
          window.scrollTo(0, 0);
          setError(true);
          setLoading(false);
          setButtonSaveText(Language.Submit ? Language.Submit : "Submit");
          setTimeout(() => {
            messageDismiss();
          }, 2000);
        });
    } else if (Errmessage != "") {
      setRequiredColumnMessage(true);
      setLoading(false);
      setButtonSaveText(Language.Submit ? Language.Submit : "Submit");
      setTimeout(() => {
        setRequiredColumnMessage(false);
      }, 2000);
    }
  }

  function AutoDeleteTickets() {


    var _url =
      getIsInstalled?.SiteUrl +
      "/_api/web/lists/getbytitle('HR365HDMTickets')/items('" +
      rowId +
      "')";
    ContextService.GetSPContext()
      .post(_url, SPHttpClient.configurations.v1, {
        headers: {
          Accept: "application/json;odata=nometadata",
          "Content-type": "application/json;odata=nometadata",
          "odata-version": "",
          "IF-MATCH": "*",
          "X-HTTP-Method": "DELETE",
        },
      })
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
        } else {
          response.json().then((responseJSON) => {
          });
        }
      });

  }

  function ResetFields() {
    settitlename("");
    setattachFile2(null);
    setattachFile1(null);
    setTicketPropertiesValue([]);
    setatt1 = [];
  }

  function getEmailTemplate() {
    let allItems = [];
    ContextService.GetSPContext()
      .get(
        `${getIsInstalled?.SiteUrl}/_api/web/lists/getbytitle('HR365HDMEmailNotifications')/items`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json;odata=nometadata",
            "odata-version": "",
          },
        }
      )
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((items: any) => {
        items.value.map((templ) => {
          let finaltemp = {
            ID: templ.ID,
            Title: templ.Title,
            Body: templ.Body,
            IsActive: templ.IsActive,
            Subject: templ.Subject,
            EmailSentTo: templ.EmailSentTo,
            CustomFormTemplate: templ.CustomFormTemplate,
          };

          allItems.push(finaltemp);
          //

          //setItems(allItems);
        });


        setEmailTemplate(allItems);
      });
  }


  function sendEmailWOAuto() {
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


    // let titleodmail;

    let supertitle = superEmail[0].Subject;
    let supertitle1 = supertitle.replaceAll('[ticket.subject]', Titlename);
    let supertitle2 = supertitle1.replaceAll('[ticket.id]', '[' + ticketSequence + ']');
    supertitle2 = supertitle2.replaceAll('[ticket.url]', "").replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', "").replaceAll('[ticket.agent.name]', "").replaceAll('[ticket.agent.email]', "").replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', "").replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.requester.name]', reqName).replaceAll('[ticket.from_email]', requesterEmailId).replaceAll('[ticket.Service]', servicename).replaceAll('[ticket.SubService]', subservicename);
    supertitle2 = supertitle2.replaceAll(null, '').replaceAll(undefined, '').replaceAll('[ticket.survey_rating]', '');
    let currentContext = window.location.href.split("#")[0].split(".aspx")[0];
    let body = superEmail[0].Body;
    let body1 = body.replaceAll('[ticket.requester.name]', reqName);
    body1 = body1.replaceAll('[ticket.subject]', Titlename).replaceAll('[ticket.id]', ticketSequence).replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', "").replaceAll('[ticket.agent.name]', "").replaceAll('[ticket.agent.email]', "").replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', "").replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.requester.name]', reqName).replaceAll('[ticket.from_email]', requesterEmailId);;
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

    // if (currentContext) {
    //   taskUrl = SiteUrlstate + "Ticket/" + rowId;
    // }
    let body2 = body1.replaceAll('[ticket.url]', `<a href='${taskUrl}'>${ticketSequence}</a>`);
    //  
    //  
    let requesterEmailTempArray = [];
    let reqSub;
    let reqbody;
    if (requesterEmailTemp[0].CustomFormTemplate != null && requesterEmailTemp[0].CustomFormTemplate != undefined) {
      requesterEmailTempArray = JSON.parse(requesterEmailTemp[0].CustomFormTemplate);
      requesterEmailTempArray = requesterEmailTempArray.filter((IdV) => {
        return IdV.FormGuid == DefaultFormGuid
      })
      reqSub = isArrayValidated(requesterEmailTempArray) ? requesterEmailTempArray[0].EmailSubject : requesterEmailTemp[0].Subject;
      reqbody = isArrayValidated(requesterEmailTempArray) ? requesterEmailTempArray[0].EmailBody : requesterEmailTemp[0].Body;
      // reqbody = requesterEmailTempArray[0].EmailBody;
    } else {
      requesterEmailTempArray = requesterEmailTemp;
      reqSub = requesterEmailTempArray[0].Subject;
      reqbody = requesterEmailTempArray[0].Body;
    }

    let reqSub1 = reqSub.replaceAll('[ticket.subject]', Titlename);
    let reqSub2 = reqSub1.replaceAll('[ticket.id]', '[' + ticketSequence + ']');
    reqSub2 = reqSub2.replaceAll('[ticket.url]', `<a href='${taskUrl}'>${ticketSequence}</a>`).replaceAll('[ticket.description]', "").replaceAll('[ticket.latest_comment]', "").replaceAll('[ticket.agent.name]', "").replaceAll('[ticket.agent.email]', "").replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', "").replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.requester.name]', reqName).replaceAll('[ticket.from_email]', requesterEmailId);
    reqSub2 = reqSub2.replaceAll(null, '').replaceAll(undefined, '').replaceAll('[ticket.Service]', servicename).replaceAll('[ticket.SubService]', subservicename).replaceAll('[ticket.survey_rating]', '');

    let reqbody1 = reqbody.replaceAll('[ticket.requester.name]', reqName);
    let reqbody2 = reqbody1.replaceAll('[ticket.id]', ticketSequence);
    reqbody2 = reqbody2.replaceAll('[ticket.subject]', Titlename).replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', "").replaceAll('[ticket.agent.name]', "").replaceAll('[ticket.agent.email]', "").replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', "").replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.from_email]', requesterEmailId).replaceAll('[ticket.Service]', servicename).replaceAll('[ticket.SubService]', subservicename);
    reqbody2 = reqbody2.replaceAll(null, '').replaceAll(undefined, '');
    let reqbody3 = reqbody2.replaceAll('[ticket.url]', `<a href='${taskUrl}'>${ticketSequence}</a>`).replaceAll('[ticket.survey_rating]', '');



    let _teamdata = teamsData.filter((ele) => {
      return ele.Onqueue == teamname;

    });

    if (adminEmail[0].IsActive == "Yes") {

      var filtered = userList.filter((item) => {
        return (item.Roles == "Admin");
      });

      let sendEmailIds = [];
      filtered.map((i) => {
        sendEmailIds.push(i.Email);
      });


      AdminMails = [...new Set(sendEmailIds)];
      if (AdminMails.length > 0) {
        let fromemail = "no-reply@sharepointonline.com";

        if (defaultAsignee == null || defaultAsignee == undefined || defaultAsignee == "") {
          fromemail = "no-reply@sharepointonline.com";
        } else {
          fromemail = defaultAsignee;
        }
        if (externalDomain || externalDomain != undefined || externalDomain != "") {
          if (fromemail.includes(externalDomain.trim()) || EmailsFromMailbox == "On") {
            postExternal(fromemail, AdminMails, body2, supertitle2, AutoCCEmail);

          } else {
            sendEmailReply(supertitle2, body2, AdminMails, fromemail, AutoCCEmail);
          }

        }

      }


    }

    if (agent[0].IsActive == "Yes") {
      let sendEmailIds = [];
      if (_teamdata[0].Teammembers1Id) {

        var filtered = userList.filter((item) => {
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

        if (defaultAsignee == null || defaultAsignee == undefined || defaultAsignee == "") {
          fromemail = "no-reply@sharepointonline.com";
        } else {
          fromemail = defaultAsignee;
        }
        if (uniqueEmails?.toString() != AdminMails?.toString()) {
          if (externalDomain || externalDomain != undefined || externalDomain != "") {
            if (fromemail.includes(externalDomain.trim()) || EmailsFromMailbox == "On") {
              postExternal(fromemail, uniqueEmails, body2, supertitle2, AutoCCEmail);

            } else {
              sendEmailReply(supertitle2, body2, uniqueEmails, fromemail, AutoCCEmail);
            }

          }
        }

      }



    }
    if (superEmail[0].IsActive == "Yes") {
      let sendEmailIds = [];
      if (_teamdata[0].Supervisor1Id) {

        var filtered = userList.filter((item) => {
          return _teamdata[0].Supervisor1Id.indexOf(item.UsersId) !== -1;
        });

        filtered.map((i) => {
          sendEmailIds.push(i.Email);
        });


      }
      let uniqueEmails = [...new Set(sendEmailIds)];
      if (uniqueEmails.length > 0) {
        let fromemail = "no-reply@sharepointonline.com";

        if (defaultAsignee == null || defaultAsignee == undefined || defaultAsignee == "") {
          fromemail = "no-reply@sharepointonline.com";
        } else {
          fromemail = defaultAsignee;
        }
        if (uniqueEmails?.toString() != AdminMails?.toString()) {
          if (externalDomain || externalDomain != undefined || externalDomain != "") {
            if (fromemail.includes(externalDomain.trim()) || EmailsFromMailbox == "On") {
              postExternal(fromemail, uniqueEmails, body2, supertitle2, AutoCCEmail);

            } else {
              sendEmailReply(supertitle2, body2, uniqueEmails, fromemail, AutoCCEmail);
            }

          }
        }

      }

    }
    if (SuperAgent[0].IsActive == "Yes") {


      let sendEmailIds = [];
      if (_teamdata[0].Supervisor1Id) {

        var filtered = userList.filter((item) => {
          return _teamdata[0].Supervisor1Id.indexOf(item.UsersId) !== -1;
        });
        //
        filtered.map((i) => {
          sendEmailIds.push(i.Email);
        });
      }

      if (_teamdata[0].Teammembers1Id) {

        var filtered = userList.filter((item) => {
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

        if (defaultAsignee == null || defaultAsignee == undefined || defaultAsignee == "") {
          fromemail = "no-reply@sharepointonline.com";
        } else {
          fromemail = defaultAsignee;
        }
        if (uniqueEmails?.toString() != AdminMails?.toString()) {
          if (externalDomain || externalDomain != undefined || externalDomain != "") {
            if (fromemail.includes(externalDomain.trim()) || EmailsFromMailbox == "On") {
              postExternal(fromemail, uniqueEmails, body2, supertitle2, AutoCCEmail);

            } else {
              sendEmailReply(supertitle2, body2, uniqueEmails, fromemail, AutoCCEmail);
            }

          }
        }

      }

    }
    if (isArrayValidated(requesterEmailTempArray) ? requesterEmailTempArray[0].IsActive == "Yes" : requesterEmailTemp[0].IsActive == "Yes") {
      let sendEmailIds = [requesterEmailId];
      //   var filtered = userList.filter((item) => {
      //     return (item.UsersId ==JSON.parse(requestername[0].id)) ;
      // })
      // filtered.map((i)=>{
      //   sendEmailIds.push(i.Email);
      // })

      // 

      let uniqueEmails = [...new Set(sendEmailIds)];
      if (AutoRequestorEmail != '' && AutoRequestorEmail != null && AutoRequestorEmail != undefined) {
        uniqueEmails.push(AutoRequestorEmail);
      }
      if (AutoCCEmail != '' && AutoCCEmail != undefined && AutoCCEmail != null) {
        uniqueEmails.push(AutoCCEmail);
      }
      if (uniqueEmails.length > 0) {
        let fromemail = "no-reply@sharepointonline.com";

        if (defaultAsignee == null || defaultAsignee == undefined || defaultAsignee == "") {
          fromemail = "no-reply@sharepointonline.com";
        } else {
          fromemail = defaultAsignee;
        }
        if (externalDomain || externalDomain != undefined || externalDomain != "") {
          if (fromemail.includes(externalDomain.trim()) || EmailsFromMailbox == "On") {
            postExternal(fromemail, uniqueEmails, reqbody3, reqSub2, AutoCCEmail);

          } else {
            sendEmailReply(reqSub2, reqbody3, uniqueEmails, fromemail, AutoCCEmail);
          }

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
        autosub2 = autosub2.replaceAll('[ticket.url]', "").replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', "").replaceAll('[ticket.agent.name]', lastAssignid).replaceAll('[ticket.agent.email]', autoAssignEmal).replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', "").replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.requester.name]', reqName).replaceAll('[ticket.from_email]', requesterEmailId).replaceAll('[ticket.service]', servicename).replaceAll('[ticket.subservice]', subservicename);
        autosub2 = autosub2.replaceAll(null, '').replaceAll(undefined, '');
        let reqbody = requesterEmailTemp[0].Body;
        let autobody = autoAssignEmal[0].Body;
        autobody = autobody.replaceAll('[ticket.id]', ticketSequence);
        autobody = autobody.replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', "").replaceAll('[ticket.agent.name]', lastAssignid).replaceAll('[ticket.agent.email]', autoAssignEmal).replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', "").replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.requester.name]', reqName).replaceAll('[ticket.from_email]', requesterEmailId).replaceAll('[ticket.service]', servicename).replaceAll('[ticket.subservice]', subservicename);
        autobody = autobody.replaceAll(null, '').replaceAll(undefined, '');
        let autobody1 = autobody.replaceAll('[ticket.url]', `<a href='${taskUrl}'>${ticketSequence}</a>`);

        let sendEmailIds = [];
        var filtered = userList.filter((item) => {
          return (item.UsersId == lastAssignid);
        });
        filtered.map((i) => {
          sendEmailIds.push(i.Email);
        });


        let uniqueEmails = [...new Set(sendEmailIds)];


        if (uniqueEmails.length > 0) {
          let fromemail = "no-reply@sharepointonline.com";

          if (defaultAsignee == null || defaultAsignee == undefined || defaultAsignee == "") {
            fromemail = "no-reply@sharepointonline.com";
          } else {
            fromemail = defaultAsignee;
          }
          if (externalDomain || externalDomain != undefined || externalDomain != "") {
            if (fromemail.includes(externalDomain.trim()) || EmailsFromMailbox == "On") {
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
    //let web = new Web(getIsInstalled?.SiteUrl);
    //
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
    let currentTeam = allDepartmentsData.filter(e => e.Onqueue == teamname)
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
          // setSaved(true);
          // setTimeout(() => {
          //   setLoading(false);
          //   setButtonSaveText(Language.Submit? Language.Submit:"Submit");
          //   messageDismiss();
          // }, 1000);
          // setTimeout(() => {
          //   dismissPanel12();
          // }, 1200);
        } else {
          response.json().then((responseJSON) => {

            // setError(true);
            // setLoading(false);
            // setButtonSaveText(Language.Submit? Language.Submit:"Submit");
            // setTimeout(() => {
            //   messageDismiss();
            // }, 3000);
          });
        }
        return response.json();
      });

  }

  async function saveFile(Id) {
    if (attachFile2) {
      let web = new Web(getIsInstalled?.SiteUrl);
      let item = web.lists.getByTitle("HR365HDMTickets").items.getById(Id);
      let attachments = await item.attachmentFiles.get();
      let attachmentNames = attachments?.map((a) => a.FileName);
      await item.attachmentFiles.deleteMultiple(...attachmentNames);
      let fileInfos: IAttachmentFileInfo[] = [];
      for (let i = 0; i < attachFile2.length; i++) {
        fileInfos.push({
          name: attachFile2[i].name.replaceAll(/[`~!@#$%^&*()|+\=?;:'",<>\{\}\[\]\\\/]/gi, '_'),
          content: attachFile2[i],
        });
      }
      let attachExtraDetails = [];
      const currentUserName = ContextService.GetCurrentUser();
      for (let i = 0; i < attachFile2.length; i++) {
        attachExtraDetails.push({
          name: attachFile2[i].name.replaceAll(/[`~!@#$%^&*()|+\=?;:'",<>\{\}\[\]\\\/]/gi, '_'),
          createdBy: currentUserName.displayName,
          date: new Date()
        })
      }

      AttachmentDetailsSaved(attachExtraDetails, Id)
      item.attachmentFiles.addMultiple(fileInfos);
    }
  }


  // Attachment POST

  function AttachmentDetailsSaved(attachExtraDetails, Id) {

    if (attachExtraDetails) {
      let finalTemplate = {
        AttachmentDetails: JSON.stringify(attachExtraDetails)
      };
      var updateurl = getIsInstalled?.SiteUrl + "/_api/web/lists/getbytitle('HR365HDMTickets')/items('" + Id + "')";

      setTimeout(() => {
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
          ).then((response: SPHttpClientResponse) => {
            if (response.ok) {

              console.log("Attachment Details Updated");
            // return response.json();
            } else {
              console.error("Attachment Details Updated Error")
            }
            // return response.json();
          })
      }, 3000);
    }
  }




  const gettitle = (event) => {
    // 
    settitlename(event.target.value as string);
  };

  const OnMediaChange = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    setMediaChoosed(item.key as string);
  }


  const getteam = (
    event,
    item
  ): void => {
    _groupOfColumnstoShow = [];
    _groupOfColumnstoShowandMand = [];
    _groupOfColumnstoHideandMand = [];
    let _groupOfColumnstoHide = [];
    let _groupOfColumnstoHideAll = [];
    setservicename(null);
    setsubservicename(null);
    setDefltSubService(null);
    setDefltService(null);
    setUpdateMe(!updateMe);

    setteamname(item.key as string);
    //setselectdefaultservies2(item.key as string);
    setteam(item.name as string);
    setDefltTeam(item.key as string);

    var filteredService = hroptions.filter((items) => {
      return items.team == item.key;
    });

    filteredService = filteredService?.sort((a, b) => a?.text?.localeCompare(b?.text));

    setServiceOption(filteredService);

    if (defaultserviesvalidation == true) {
      var dfltser = filteredService.filter((items) => {
        return items.default == "Yes";
      });
    }
    //
    //var servKey;
    // if(
    //   dfltser == null ||
    //   dfltser.length == 0 ||
    //   dfltser == undefined
    // ){

    // }
    var subservicefilter = Suboptions.filter((items) => {
      if (dfltser.length > 0) {
        return items.services == dfltser[0].key;
      }
    });
    if (defaultsubserviesvalidation == true) {
      var dfltsubser = subservicefilter.filter((items) => {
        return items.default == "Yes";
      });
    }

    // var subservicedefault = subservicefilter.filter((items)=>{
    //   return items.default == "Yes";
    // })
    if (dfltser.length > 0) {
      setDefltService(dfltser[0].key);
      setservicename(dfltser[0].key);
    }
    if (dfltsubser.length > 0) {
      setDefltSubService(dfltsubser[0].key);
      setsubservicename(dfltsubser[0].key);
    }

    subservicefilter = subservicefilter?.sort((a, b) => a?.text?.localeCompare(b?.text));
    setsubserviceOption(subservicefilter);

    if (subservicefilter[0]?.text != null && subservicefilter[0]?.text != undefined && subservicefilter[0]?.text != "") {
      setlevel2SubServiceOptions(level2SubServiceAllOptions.filter(x => x.parent == subservicefilter[0]?.text));
      let defaultSubservice = level2SubServiceAllOptions.filter(x => x.parent == subservicefilter[0]?.text && x.default == "Yes");
      if (defaultSubservice.length) {
        setlevel2SubServicedefault(defaultSubservice[0].key)

        setlevel3SubserviceOptions(level3SubserviceAllOptions.filter(x => x.parent == defaultSubservice[0].key));
        let defaultSubservice1 = level3SubserviceAllOptions.filter(x => x.parent == defaultSubservice[0].key && x.default == "Yes");
        if (defaultSubservice1.length) {
          setlevel3Subservicedefault(defaultSubservice1[0].key);

        }
      }

    }

    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoShow = AllColumnConditionsArray.filter((i) => {
        return i.Name == item.name;
      }) : _groupOfColumnstoShow = [],

      MendetoryShowColumnConditionsArray?.map((item) => {
        _groupOfColumnstoShow.push({ DisplayName: item, IntName: item, Name: item, mainColumnDisplayName: item, mainColumnIntName: item, value: item })
      })

    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoHide = AllColumnConditionsArray.filter((i) => {
        return i.Name != item.name;
      })
      : _groupOfColumnstoHide = [];

    if (_groupOfColumnstoShow.length != 0) {
      let _FilterArray = [];
      _groupOfColumnstoHide?.map((z) => {
        if (document.getElementById(z.IntName) != null && z.IntName != item.name) {
          _groupOfColumnstoHideandMand.push(z.IntName)
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
      // _groupOfColumnstoShow.map((z) => {
      //   if (document.getElementById(z.IntName) != null) {
      //     _groupOfColumnstoShowandMand.push(z.IntName);
      //     if (allMandatoryFields.includes(z.IntName)) {
      //       MandatoryFields?.push(z.IntName)
      //     }

      //     document.getElementById(z.IntName).style.display = 'block';
      //   }
      // })
    } else {
      _groupOfColumnstoHide.map((z) => {
        if (document.getElementById(z.IntName) != null && z.IntName != item.name) {
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
    }


  };
  const getservice = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    _groupOfColumnstoShow = [];
    _groupOfColumnstoShowandMand = [];
    _groupOfColumnstoHideandMand = [];
    let _groupOfColumnstoHide = [];
    let _groupOfColumnstoHideAll = [];
    setsubservicename(null);
    setDefltSubService(null);
    console.log("defltService", defltService);
    setUpdateMe(!updateMe);

    setservicename(item.key as string);
    setDefltService(item.key as string);
    //setsubservicename(item.key as string);
    var filteredSubService = Suboptions.filter((items) => {

      return items.services?.toLowerCase() == String(item.key)?.toLowerCase();

    });
    filteredSubService = filteredSubService?.sort((a, b) => a?.text?.localeCompare(b?.text));
    setsubserviceOption(filteredSubService);
    if (defaultsubserviesvalidation == true) {
      var dfltsubser = filteredSubService.filter((items) => {
        return items.default == "Yes";
      });
    }
    //
    if (dfltsubser.length > 0) {
      setDefltSubService(dfltsubser[0].key)
      setsubservicename(dfltsubser[0].key)
    }
    setsubserviceOption(filteredSubService);
    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoShow = AllColumnConditionsArray.filter((i) => {
        return i.Name == item.text;
      }) : _groupOfColumnstoShow = [],

      MendetoryShowColumnConditionsArray.map((item) => {
        _groupOfColumnstoShow.push({ DisplayName: item, IntName: item, Name: item, mainColumnDisplayName: item, mainColumnIntName: item, value: item })
      })

    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoHide = AllColumnConditionsArray.filter((i) => {
        return i.Name != item.text;
      })
      : _groupOfColumnstoHide = [];

    if (_groupOfColumnstoShow.length != 0) {
      let _FilterArray = [];
      _groupOfColumnstoHide?.map((z) => {
        if (document.getElementById(z.IntName) != null && z.IntName != item.text) {
          _groupOfColumnstoHideandMand.push(z.IntName)
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
      // _groupOfColumnstoShow.map((z) => {
      //   if (document.getElementById(z.IntName) != null) {
      //     _groupOfColumnstoShowandMand.push(z.IntName);
      //     if (allMandatoryFields.includes(z.IntName)) {
      //       MandatoryFields?.push(z.IntName)
      //     }

      //     document.getElementById(z.IntName).style.display = 'block';
      //   }
      // })
    } else {
      // isArrayValidated(AllColumnConditionsArray) ?
      // _groupOfColumnstoHideAll = AllColumnConditionsArray.filter((i) => {
      //   return i.value != _selectedValue;
      // })
      // : _groupOfColumnstoHideAll = [];
      _groupOfColumnstoHide.map((z) => {
        if (document.getElementById(z.IntName) != null && z.IntName != item.text) {
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
    }
  };
  const getSubservice = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    _groupOfColumnstoShow = [];
    _groupOfColumnstoShowandMand = [];
    _groupOfColumnstoHideandMand = [];
    let _groupOfColumnstoHide = [];
    let _groupOfColumnstoHideAll = [];
    setDefltSubService(null)
    setsubservicename(item.key as string);
    setDefltSubService(item.key as string);
    setUpdateMe(!updateMe);
    if (item.key != null && item.key != undefined && item.key != "") {
      setlevel2SubServiceOptions(level2SubServiceAllOptions.filter(x => x.parent == item.key));
      let defaultSubservice = level2SubServiceAllOptions.filter(x => x.parent == item.key && x.default == "Yes");
      if (defaultSubservice.length) {
        setlevel2SubServicedefault(defaultSubservice[0].key)

        setlevel3SubserviceOptions(level3SubserviceAllOptions.filter(x => x.parent == defaultSubservice[0].key));
        let defaultSubservice1 = level3SubserviceAllOptions.filter(x => x.parent == defaultSubservice[0].key && x.default == "Yes");
        if (defaultSubservice1.length) {
          setlevel3Subservicedefault(defaultSubservice1[0].key);

        }
      }

    }
    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoShow = AllColumnConditionsArray.filter((i) => {
        return i.Name == item.text;
      }) : _groupOfColumnstoShow = [],

      MendetoryShowColumnConditionsArray.map((item) => {
        _groupOfColumnstoShow.push({ DisplayName: item, IntName: item, Name: item, mainColumnDisplayName: item, mainColumnIntName: item, value: item })
      })

    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoHide = AllColumnConditionsArray.filter((i) => {
        return i.Name != item.text;
      })
      : _groupOfColumnstoHide = [];

    if (_groupOfColumnstoShow.length != 0) {
      let _FilterArray = [];
      _groupOfColumnstoHide.map((z) => {
        if (document.getElementById(z.IntName) != null && z.IntName != item.text) {
          _groupOfColumnstoHideandMand.push(z.IntName)
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
      // _groupOfColumnstoShow.map((z) => {
      //   if (document.getElementById(z.IntName) != null) {
      //     _groupOfColumnstoShowandMand.push(z.IntName);
      //     if (allMandatoryFields.includes(z.IntName)) {
      //       MandatoryFields?.push(z.IntName)
      //     }

      //     document.getElementById(z.IntName).style.display = 'block';
      //   }
      // })
    } else {
      // isArrayValidated(AllColumnConditionsArray) ?
      // _groupOfColumnstoHideAll = AllColumnConditionsArray.filter((i) => {
      //   return i.value != _selectedValue;
      // })
      // : _groupOfColumnstoHideAll = [];
      _groupOfColumnstoHide.map((z) => {
        if (document.getElementById(z.IntName) != null && z.IntName != item.text) {
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
    }

  };
  //MOBILE VIEW DROPDOWN//
  const getDropPriority = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    _groupOfColumnstoShow = [];
    _groupOfColumnstoShowandMand = [];
    _groupOfColumnstoHideandMand = [];
    let _groupOfColumnstoHide = [];
    let _groupOfColumnstoHideAll = [];
    setpriorityName(item.key as string);
    setDefltPriority(item.key as string);
    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoShow = AllColumnConditionsArray.filter((i) => {
        return i.Name == item.text;
      }) : _groupOfColumnstoShow = [],

      MendetoryShowColumnConditionsArray.map((item) => {
        _groupOfColumnstoShow.push({ DisplayName: item, IntName: item, Name: item, mainColumnDisplayName: item, mainColumnIntName: item, value: item })
      })

    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoHide = AllColumnConditionsArray.filter((i) => {
        return i.Name != item.text;
      })
      : _groupOfColumnstoHide = [];

    if (_groupOfColumnstoShow.length != 0) {
      let _FilterArray = [];
      _groupOfColumnstoHide.map((z) => {
        if (document.getElementById(z.IntName) != null && z.IntName != item.text) {
          _groupOfColumnstoHideandMand.push(z.IntName)
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
      // _groupOfColumnstoShow.map((z) => {
      //   if (document.getElementById(z.IntName) != null) {
      //     _groupOfColumnstoShowandMand.push(z.IntName);
      //     if (allMandatoryFields.includes(z.IntName)) {
      //       MandatoryFields?.push(z.IntName)
      //     }

      //     document.getElementById(z.IntName).style.display = 'block';
      //   }
      // })
    } else {
      // isArrayValidated(AllColumnConditionsArray) ?
      // _groupOfColumnstoHideAll = AllColumnConditionsArray.filter((i) => {
      //   return i.value != _selectedValue;
      // })
      // : _groupOfColumnstoHideAll = [];
      _groupOfColumnstoHide.map((z) => {
        if (document.getElementById(z.IntName) != null && z.IntName != item.text) {
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
    }
  };
  const getDropRequestType = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    _groupOfColumnstoShow = [];
    _groupOfColumnstoShowandMand = [];
    _groupOfColumnstoHideandMand = [];
    let _groupOfColumnstoHide = [];
    let _groupOfColumnstoHideAll = [];
    setrequestName(item.key as string);
    setDefltReq(item.key as string);
    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoShow = AllColumnConditionsArray.filter((i) => {
        return i.Name == item.text;
      }) : _groupOfColumnstoShow = [],

      MendetoryShowColumnConditionsArray.map((item) => {
        _groupOfColumnstoShow.push({ DisplayName: item, IntName: item, Name: item, mainColumnDisplayName: item, mainColumnIntName: item, value: item })
      })

    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoHide = AllColumnConditionsArray.filter((i) => {
        return i.Name != item.text;
      })
      : _groupOfColumnstoHide = [];

    if (_groupOfColumnstoShow.length != 0) {
      let _FilterArray = [];
      _groupOfColumnstoHide.map((z) => {
        if (document.getElementById(z.IntName) != null && z.IntName != item.text) {
          _groupOfColumnstoHideandMand.push(z.IntName)
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
      // _groupOfColumnstoShow.map((z) => {
      //   if (document.getElementById(z.IntName) != null) {
      //     _groupOfColumnstoShowandMand.push(z.IntName);
      //     if (allMandatoryFields.includes(z.IntName)) {
      //       MandatoryFields?.push(z.IntName)
      //     }

      //     document.getElementById(z.IntName).style.display = 'block';
      //   }
      // })
    } else {
      // isArrayValidated(AllColumnConditionsArray) ?
      // _groupOfColumnstoHideAll = AllColumnConditionsArray.filter((i) => {
      //   return i.value != _selectedValue;
      // })
      // : _groupOfColumnstoHideAll = [];
      _groupOfColumnstoHide.map((z) => {
        if (document.getElementById(z.IntName) != null && z.IntName != item.text) {
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
    }
  };
  const getDropTeams = (
    event,
    item
  ): void => {
    _groupOfColumnstoShow = [];
    _groupOfColumnstoShowandMand = [];
    _groupOfColumnstoHideandMand = [];
    let _groupOfColumnstoHide = [];
    let _groupOfColumnstoHideAll = [];
    setservicename(null);
    setsubservicename(null);
    setDefltSubService(null);
    // setDefltService(null);

    setteamname(item.key as string);
    //setselectdefaultservies2(item.key as string);
    setteam(item.name as string);
    setDefltTeam(item.key as string);

    var filteredService = hroptions.filter((items) => {
      return items.team == item.key;
    });

    filteredService = filteredService?.sort((a, b) => a?.text?.localeCompare(b?.text));

    setServiceOption(filteredService);

    if (defaultserviesvalidation == true) {
      var dfltser = filteredService.filter((items) => {
        return items.default == "Yes";
      });
    }
    //
    //var servKey;
    // if(
    //   dfltser == null ||
    //   dfltser.length == 0 ||
    //   dfltser == undefined
    // ){

    // }
    var subservicefilter = Suboptions.filter((items) => {
      if (dfltser.length > 0) {
        return items.services == dfltser[0].key;
      }
    });
    if (defaultsubserviesvalidation == true) {
      var dfltsubser = subservicefilter.filter((items) => {
        return items.default == "Yes";
      });
    }

    // var subservicedefault = subservicefilter.filter((items)=>{
    //   return items.default == "Yes";
    // })
    if (dfltser.length > 0) {
      setDefltService(dfltser[0].key);
      setservicename(dfltser[0].key);
    }
    if (dfltsubser.length > 0) {
      setDefltSubService(dfltsubser[0].key);
      setsubservicename(dfltsubser[0].key);
    }

    subservicefilter = subservicefilter?.sort((a, b) => a?.text?.localeCompare(b?.text));
    setsubserviceOption(subservicefilter);

    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoShow = AllColumnConditionsArray.filter((i) => {
        return i.Name == item.name;
      }) : _groupOfColumnstoShow = [],

      MendetoryShowColumnConditionsArray.map((item) => {
        _groupOfColumnstoShow.push({ DisplayName: item, IntName: item, Name: item, mainColumnDisplayName: item, mainColumnIntName: item, value: item })
      })

    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoHide = AllColumnConditionsArray.filter((i) => {
        return i.Name != item.name;
      })
      : _groupOfColumnstoHide = [];

    if (_groupOfColumnstoShow.length != 0) {
      let _FilterArray = [];
      _groupOfColumnstoHide.map((z) => {
        if (document.getElementById(z.IntName) != null && z.IntName != item.name) {
          _groupOfColumnstoHideandMand.push(z.IntName)
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
      // _groupOfColumnstoShow.map((z) => {
      //   if (document.getElementById(z.IntName) != null) {
      //     _groupOfColumnstoShowandMand.push(z.IntName);
      //     if (allMandatoryFields.includes(z.IntName)) {
      //       MandatoryFields?.push(z.IntName)
      //     }

      //     document.getElementById(z.IntName).style.display = 'block';
      //   }
      // })
    } else {
      _groupOfColumnstoHide.map((z) => {
        if (document.getElementById(z.IntName) != null && z.IntName != item.name) {
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
    }


  };
  const getpriority = (
    event: React.FormEvent<HTMLDivElement>,
    item: IChoiceGroupOption
  ): void => {
    _groupOfColumnstoShow = [];
    _groupOfColumnstoShowandMand = [];
    _groupOfColumnstoHideandMand = [];
    let _groupOfColumnstoHide = [];
    let _groupOfColumnstoHideAll = [];
    setpriorityName(item.key as string);
    setDefltPriority(item.key as string);
    setUpdateMe(!updateMe);

    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoShow = AllColumnConditionsArray.filter((i) => {
        return i.Name == item.text;
      }) : _groupOfColumnstoShow = [],

      MendetoryShowColumnConditionsArray.map((item) => {
        _groupOfColumnstoShow.push({ DisplayName: item, IntName: item, Name: item, mainColumnDisplayName: item, mainColumnIntName: item, value: item })
      })

    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoHide = AllColumnConditionsArray.filter((i) => {
        return i.Name != item.text;
      })
      : _groupOfColumnstoHide = [];

    if (_groupOfColumnstoShow.length != 0) {
      let _FilterArray = [];
      _groupOfColumnstoHide.map((z) => {
        if (document.getElementById(z.IntName) != null && z.IntName != item.text) {
          _groupOfColumnstoHideandMand.push(z.IntName)
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
      // _groupOfColumnstoShow.map((z) => {
      //   if (document.getElementById(z.IntName) != null) {
      //     _groupOfColumnstoShowandMand.push(z.IntName);
      //     if (allMandatoryFields.includes(z.IntName)) {
      //       MandatoryFields?.push(z.IntName)
      //     }

      //     document.getElementById(z.IntName).style.display = 'block';
      //   }
      // })
    } else {
      // isArrayValidated(AllColumnConditionsArray) ?
      // _groupOfColumnstoHideAll = AllColumnConditionsArray.filter((i) => {
      //   return i.value != _selectedValue;
      // })
      // : _groupOfColumnstoHideAll = [];
      _groupOfColumnstoHide.map((z) => {
        if (document.getElementById(z.IntName) != null && z.IntName != item.text) {
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
    }
  };
  const getrequest = (
    event,
    item
  ): void => {
    _groupOfColumnstoShow = [];
    _groupOfColumnstoShowandMand = [];
    _groupOfColumnstoHideandMand = [];
    let _groupOfColumnstoHide = [];
    let _groupOfColumnstoHideAll = [];
    setrequestName(item.key as string);
    setDefltReq(item.key as string);
    setUpdateMe(!updateMe);

    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoShow = AllColumnConditionsArray.filter((i) => {
        return i.Name == item.text;
      }) : _groupOfColumnstoShow = [],

      MendetoryShowColumnConditionsArray.map((item) => {
        _groupOfColumnstoShow.push({ DisplayName: item, IntName: item, Name: item, mainColumnDisplayName: item, mainColumnIntName: item, value: item })
      })

    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoHide = AllColumnConditionsArray.filter((i) => {
        return i.Name != item.text;
      })
      : _groupOfColumnstoHide = [];

    if (_groupOfColumnstoShow.length != 0) {
      let _FilterArray = [];
      _groupOfColumnstoHide?.map((z) => {
        if (document.getElementById(z.IntName) != null && z.IntName != item.text) {
          _groupOfColumnstoHideandMand.push(z.IntName)
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
      // _groupOfColumnstoShow.map((z) => {
      //   if (document.getElementById(z.IntName) != null) {
      //     _groupOfColumnstoShowandMand.push(z.IntName);
      //     if (allMandatoryFields.includes(z.IntName)) {
      //       MandatoryFields?.push(z.IntName)
      //     }

      //     document.getElementById(z.IntName).style.display = 'block';
      //   }
      // })
    } else {
      // isArrayValidated(AllColumnConditionsArray) ?
      // _groupOfColumnstoHideAll = AllColumnConditionsArray.filter((i) => {
      //   return i.value != _selectedValue;
      // })
      // : _groupOfColumnstoHideAll = [];
      _groupOfColumnstoHide.map((z) => {
        if (document.getElementById(z.IntName) != null && z.IntName != item.text) {
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
    }
  };
  //const getrequestername= (event:React.FormEvent<HTMLDivElement>,
  // item:IPeoplePickerItemProps):void=>{
  //  setrequesterName(item.key as string);
  // }
  // const getattachname= (event:React.FormEvent<HTMLDivElement>,
  //   item:IPeoplePickerItemProps):void=>{
  //     setattachName(item.key as string);
  //   }

  // const onAttachmentChange1 = (ev) => {
  //   if (ev.target.files.length > 0) {
  //     let varlnth = attachFile2.length;
  //     for (var i = 0; i < ev.target.files.length; i++) {
  //       let id = varlnth++;
  //       setatt.push(ev.target.files[i]);
  //       setatt1.push([
  //         <div className={Homestyles.AttachMainBox}>
  //           <div className={Homestyles.FileLabelDiv}>
  //             <FontIcon className={AttachFontclass.AttachColor} iconName='TextDocument' style={{ marginRight: "5px" }} />
  //             <Label className={Homestyles.AttachFileLabel} title={ev.target.files[i].name}>{ev.target.files[i].name}</Label>
  //           </div>
  //           <div className={`${Homestyles.FileCancelIcon} attachment-cancel-file-icon`}>
  //             <ActionButton
  //               title={strings.Delete}
  //               styles={{
  //                 root: { height: "auto" }, icon: {
  //                   color: props.lightdarkmode == 'light' ? 'var(--lightdarkColor)' : 'var(--lightdarkBGGray)',
  //                 }
  //               }}
  //               iconProps={deleteIcon}
  //               onClick={() => deleteattach(id)}
  //             ></ActionButton>
  //           </div>
  //         </div>
  //       ]);

  //       setattachFile1([...setatt1]);
  //       setattachFile2([...setatt]);
  //       //setattachFile2(ev.target.files);
  //       ev.target.value = null;
  //     }
  //   } else {
  //     setattachFile2(null);
  //     //setattachFile2(null);
  //   }
  // };

  const onAttachmentChange1 = (ev) => {
    if (ev.target.files.length > 0) {
      let varlnth = attachFile2.length;
      for (var i = 0; i < ev.target.files.length; i++) {
        const newFile = ev.target.files[i];
        const isDuplicate = setatt.some(
          (existingFile) =>
            existingFile.name === newFile.name && existingFile.size === newFile.size
        );

        if (!isDuplicate) {
          let id = varlnth++;
          setatt.push(newFile);
          setatt1.push(
            <div className={Homestyles.AttachMainBox} key={id}>
              <div className={Homestyles.FileLabelDiv}>
                <FontIcon
                  className={AttachFontclass.AttachColor}
                  iconName="TextDocument"
                  style={{ marginRight: "5px" }}
                />
                <Label
                  className={Homestyles.AttachFileLabel}
                  title={newFile.name}
                >
                  {newFile.name}
                </Label>
              </div>
              <div
                className={`${Homestyles.FileCancelIcon} attachment-cancel-file-icon`}
              >
                <ActionButton
                  title={strings.Delete}
                  styles={{
                    root: { height: "auto" },
                    icon: {
                      color:
                        props.lightdarkmode === "light"
                          ? "var(--lightdarkColor)"
                          : "var(--lightdarkBGGray)",
                    },
                  }}
                  iconProps={deleteIcon}
                  onClick={() => deleteattach(id)}
                ></ActionButton>
              </div>
            </div>
          );

          setattachFile1([...setatt1]);
          setattachFile2([...setatt]);
        }
        ev.target.value = null;
      }
    } else {
      setattachFile2(null);
    }
  };


  const onAttachmentChange2 = (ev) => {

    if (ev.length > 0) {
      let varlnth = attachFile2.length;
      for (var i = 0; i < ev.length; i++) {
        let id = varlnth++;
        setatt.push(ev[i]);
        setatt1.push([
          <div>
            <span>
              {ev[i].name}</span>

            <Link
              onClick={() => {
                deleteattach(id);
              }}
            >
              <span className="ms-Icon ms-Icon--Cancel" aria-hidden="true" style={{ marginLeft: "10px" }}>X</span>
            </Link>

          </div>
          ,
        ]);
      }
      setattachFile1([...setatt1]);
      setattachFile2([...setatt]);
      //setattachFile2(ev.target.files);
    } else {
      setattachFile2(null);
      //setattachFile2(null);
    }
  };
  function deleteattach(id) {
    setatt1 = [];
    setatt.splice(id, 1);

    for (var i = 0; i < setatt.length; i++) {
      let id = i;
      setatt1.push([

        <div className={Homestyles.AttachMainBox}>
          <div className={Homestyles.FileLabelDiv}>
            <FontIcon className={AttachFontclass.AttachColor} iconName='TextDocument' style={{ marginRight: "5px" }} />
            <Label className={Homestyles.AttachFileLabel} title={setatt[i].name}>{setatt[i].name}</Label>
          </div>
          <div className={Homestyles.FileCancelIcon}>
            <ActionButton
              title={strings.Delete}
              styles={{
                root: { height: "auto" }, icon: {
                  color: props.lightdarkmode == 'light' ? 'var(--lightdarkColor)' : 'var(--lightdarkBGGray)',
                }
              }}
              iconProps={deleteIcon}
              onClick={() => deleteattach(id)}
            ></ActionButton>
          </div>
        </div>

        // <div>
        //   <span>
        //     {setatt[i].name}</span>
        //   <Link
        //     onClick={() => {
        //       deleteattach(id);
        //     }}
        //   >
        //     <span className="ms-Icon ms-Icon--Cancel" aria-hidden="true">X</span>

        //     {/* <IconButton
        //       // className={styles.info}
        //       iconProps={{ iconName: "Cancel" }}
        //     ></IconButton> */}
        //   </Link>
        // </div>
      ]);
    }
    // delete setatt[id];
    // 
    // setattachFile(setatt);
    // setattachFilename(setatt1);
    setattachFile1([...setatt1]);
    setattachFile2([...setatt]);
  }
  //for updating ticket id

  function WorkFlowFilterData(Teams, Servies, SubService) {
    AprroversLevel = []
    var approvers = '';
    var currentApprovers = '';
    currentLevel = 0;
    if (WorkFlowData != null && WorkFlowData.length > 0 && WorkFlowData != undefined) {

      let WorkFlowFilterData = WorkFlowData.findIndex((i) => {
        if (!isStringValidated(i.SubServiceName)) {

          return (i.DepartmentName?.includes(Teams) && i.ServiceName?.split(',')?.includes(Servies))
        }
      })
      if (SubService != null && SubService != '' && SubService != undefined) {


        let index = WorkFlowData.findIndex((i) => {
          if (isStringValidated(i.SubServiceName)) {


            return i.DepartmentName?.includes(Teams) && i.ServiceName?.split(',')?.includes(Servies) &&
              i.SubServiceNames?.startsWith(',') ? i.SubServiceName?.slice(1)?.split(',')?.includes(SubService) :
              i.SubServiceName?.split(',')?.includes(SubService)
          }
        })
        if (index > -1) {

          WorkFlowFilterData = index
        }



      }


      var approvers = ''
      let ExceptionWorkFlow = 'No';
      let AutoFlowWork = 'No';
      setWorkFlowDataIndex(WorkFlowFilterData);
      if (WorkFlowFilterData > -1) {
        if (WorkFlowFilterData != null && WorkFlowFilterData > -1 && WorkFlowFilterData != undefined) {
          var flag = "No";
          for (var i = 1; i <= WorkFlowData[WorkFlowFilterData]['LastLevelNumber']; i++) {
            ExceptionWorkFlow = 'No';
            AutoFlowWork = 'No';
            if (WorkFlowData[WorkFlowFilterData]['FlowData'] != '' && WorkFlowData[WorkFlowFilterData]['FlowData'] != null && WorkFlowData[WorkFlowFilterData]['FlowData'] != undefined) {
              if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Approver(s)'] != '' && WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Approver(s)'] != null && WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Approver(s)'] != undefined) {
                if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Approver(s)'] == "true") {
                  approvers = "," + WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Approver']['Approver Name'];
                }
              }
            }
            if (WorkFlowData[WorkFlowFilterData]['FlowData'] != '' && WorkFlowData[WorkFlowFilterData]['FlowData'] != null && WorkFlowData[WorkFlowFilterData]['FlowData'] != undefined) {
              if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]["Employee's Manager"] != null && WorkFlowData[WorkFlowFilterData]['FlowData'][i]["Employee's Manager"] != '' && WorkFlowData[WorkFlowFilterData]['FlowData'][i]["Employee's Manager"] != undefined) {
                if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]["Employee's Manager"] == "true") {
                  let currentuser = ContextService.GetCurrentUser();
                  console.log(requesterEmailId)
                  let manager = userList.filter(x => x.Email == requesterEmailId)
                  if (manager.length > 0) {
                    if (manager[0].ManagersName != undefined && manager[0].ManagersName != null) {
                      approvers += "," + manager[0].ManagersName
                    }
                    if (manager[0].ManagerEmail != undefined && manager[0].ManagerEmail != null) {
                      approvers += "," + manager[0].ManagerEmail
                    }
                  }
                }
              }
            }
            if (WorkFlowData[WorkFlowFilterData]['FlowData'] != '' && WorkFlowData[WorkFlowFilterData]['FlowData'] != null && WorkFlowData[WorkFlowFilterData]['FlowData'] != undefined) {
              if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]["Employee's Manager's Manager"] != '' && WorkFlowData[WorkFlowFilterData]['FlowData'][i]["Employee's Manager's Manager"] != undefined && WorkFlowData[WorkFlowFilterData]['FlowData'][i]["Employee's Manager's Manager"] != null) {
                if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]["Employee's Manager's Manager"] == "true") {
                  let currentuser = ContextService.GetCurrentUser();
                  let manager = userList.filter(x => x.Email == requesterEmailId)
                  if (manager.length > 0) {
                    let managerOfManager = userList.filter(x => x.Email == manager[0].ManagerEmail)
                    if (managerOfManager.length > 0) {
                      if (managerOfManager[0].ManagersName != undefined && managerOfManager[0].ManagersName != null) {
                        approvers += "," + managerOfManager[0].ManagersName
                      }
                    }
                  }
                }
              }
            }
            if (WorkFlowData[WorkFlowFilterData]['FlowData'] != '' && WorkFlowData[WorkFlowFilterData]['FlowData'] != null && WorkFlowData[WorkFlowFilterData]['FlowData'] != undefined) {
              if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]["Job Title"] != '' && WorkFlowData[WorkFlowFilterData]['FlowData'][i]["Job Title"] != undefined && WorkFlowData[WorkFlowFilterData]['FlowData'][i]["Job Title"] != null) {
                if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]["Job Title"] == "true") {
                  if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Approver']['Approver Job Title'] != '') {

                    let jobTitle = WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Approver']['Approver Job Title']
                    let Users = userList.filter(x => jobTitle.indexOf(x.Department) > -1)
                    if (Users.length > 0) {

                      approvers += "," + Users.map(x => x.Email).join();

                    }
                  }

                  // let currentuser = ContextService.GetCurrentUser();

                }
              }
            }
            if (WorkFlowData[WorkFlowFilterData]['FlowData'] != '' && WorkFlowData[WorkFlowFilterData]['FlowData'] != null && WorkFlowData[WorkFlowFilterData]['FlowData'] != undefined) {
              if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]["Teams"] != '' && WorkFlowData[WorkFlowFilterData]['FlowData'][i]["Teams"] != undefined && WorkFlowData[WorkFlowFilterData]['FlowData'][i]["Teams"] != null) {
                if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]["Teams"] == "true") {
                  if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Approver']['Approver Teams'] != '') {

                    let approverTeams = WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Approver']['Approver Teams']
                    let Users = teamsData.filter(x => approverTeams.indexOf(x.Title) > -1)
                    if (Users.length > 0) {
                      for (var k = 0; k < Users.length; k++) {
                        if (Users[k]['Supervisor1'] != undefined && Users[k]['Supervisor1'] != null) {

                          for (let j = 0; j < (Users[k]['Supervisor1']).length; j++) {

                            approvers += `,${Users[k]['Supervisor1'][j]["Title"]}`
                          }
                        }

                      }
                      // approvers +=  Users.join(',');

                    }
                  }

                  // let currentuser = ContextService.GetCurrentUser();

                }
              }
            }

            //// Exception Condition start here
            if (WorkFlowData[WorkFlowFilterData]['FlowData'] != '' && WorkFlowData[WorkFlowFilterData]['FlowData'] != null && WorkFlowData[WorkFlowFilterData]['FlowData'] != undefined) {
              if (isStringValidated(WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Exception'])) {

                if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Exception']["Requester's Name"] != "") {
                  let currentuser = ContextService.GetCurrentUser();
                  if ((WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Exception']["Requester's Name"]).toLowerCase().indexOf((reqName).toLowerCase()) > -1) {
                    ExceptionWorkFlow = "Yes"
                  }

                }
              }
            }
            if (WorkFlowData[WorkFlowFilterData]['FlowData'] != '' && WorkFlowData[WorkFlowFilterData]['FlowData'] != null && WorkFlowData[WorkFlowFilterData]['FlowData'] != undefined) {
              if (isStringValidated(WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Exception'])) {
                if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Exception']["Requester's Job Title"] != "") {
                  let currentuser = ContextService.GetCurrentUser();
                  let JobTitle = userList.filter(x => (x.Email).toLowerCase() == (requesterEmailId).toLowerCase())
                  if (JobTitle.length > 0 && JobTitle != undefined && JobTitle != null) {
                    if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Exception']["Requester's Job Title"].indexOf(JobTitle[0].Department) > -1) {
                      ExceptionWorkFlow = "Yes"
                    }
                  }
                }
              }
            }
            if (WorkFlowData[WorkFlowFilterData]['FlowData'] != '' && WorkFlowData[WorkFlowFilterData]['FlowData'] != null && WorkFlowData[WorkFlowFilterData]['FlowData'] != undefined) {
              if (isStringValidated(WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Exception'])) {

                if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Exception']["Requester's Team"] != "") {
                  let currentuser = ContextService.GetCurrentUser();
                  let approverTeams = WorkFlowData[WorkFlowFilterData]['FlowData'][i]['Exception']["Requester's Team"]
                  let JobTitle = teamsData.filter(x => approverTeams.indexOf(x.Title))
                  if (JobTitle.length > 0) {
                    for (var k = 0; k < JobTitle.length; k++) {
                      if (JobTitle[k]['Supervisor1'] != undefined && JobTitle[k]['Supervisor1'] != null) {

                        if (JobTitle[k]['Supervisor1'].includes((reqName))) {
                          ExceptionWorkFlow = "Yes"
                        }
                      }

                    }

                  }
                }
              }
            }

            ////AutoFlow Contion start 

            if (WorkFlowData[WorkFlowFilterData]['FlowData'] != '' && WorkFlowData[WorkFlowFilterData]['FlowData'] != null && WorkFlowData[WorkFlowFilterData]['FlowData'] != undefined) {
              if (isStringValidated(WorkFlowData[WorkFlowFilterData]['FlowData'][i]['AutoApprove'])) {

                if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]['AutoApprove']["Requester's Name"] != "") {
                  let currentuser = ContextService.GetCurrentUser();
                  if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]['AutoApprove']["Requester's Name"].indexOf((reqName)) > -1) {
                    AutoFlowWork = "Yes"
                  }

                }
              }
            }
            if (WorkFlowData[WorkFlowFilterData]['FlowData'] != '' && WorkFlowData[WorkFlowFilterData]['FlowData'] != null && WorkFlowData[WorkFlowFilterData]['FlowData'] != undefined) {
              if (isStringValidated(WorkFlowData[WorkFlowFilterData]['FlowData'][i]['AutoApprove'])) {
                if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]['AutoApprove']["Requester's Job Title"] != "") {
                  let currentuser = ContextService.GetCurrentUser();
                  let JobTitle = userList.filter(x => x.Email == requesterEmailId)
                  if (JobTitle.length > 0 && JobTitle != undefined && JobTitle != null) {
                    if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]['AutoApprove']["Requester's Job Title"].indexOf(JobTitle[0].Department) > -1) {
                      AutoFlowWork = "Yes"
                    }
                  }
                }
              }
            }
            if (WorkFlowData[WorkFlowFilterData]['FlowData'] != '' && WorkFlowData[WorkFlowFilterData]['FlowData'] != null && WorkFlowData[WorkFlowFilterData]['FlowData'] != undefined) {
              if (isStringValidated(WorkFlowData[WorkFlowFilterData]['FlowData'][i]['AutoApprove'])) {
                if (WorkFlowData[WorkFlowFilterData]['FlowData'][i]['AutoApprove']["Requester's Team"] != "") {
                  let currentuser = ContextService.GetCurrentUser();
                  let approverTeams = WorkFlowData[WorkFlowFilterData]['FlowData'][i]['AutoApprove']["Requester's Team"]
                  let JobTitle = teamsData.filter(x => approverTeams.indexOf(x.Title) > -1)
                  if (JobTitle.length > 0) {
                    for (var k = 0; k < JobTitle.length; k++) {
                      if (JobTitle[k]['Supervisor1'] != undefined && JobTitle[k]['Supervisor1'] != null) {

                        if (JobTitle[k]['Supervisor1'].includes((reqName))) {
                          AutoFlowWork = "Yes"
                        }
                      }
                    }

                  }
                }
              }
            }

            if (ExceptionWorkFlow == "No" && AutoFlowWork == "No") {
              if (flag == "No") {
                currentLevel = i
                flag = 'Yes'
              }
              let finaltemp = {
                Level: "L" + i,
                Approvers: approvers,
                CreatedDate: new Date(),
                Status: "Pending",
                ExceptionWorkFlow: ExceptionWorkFlow,
                AutoFlowWork: AutoFlowWork,
                ApprovalType: WorkFlowData[0]?.SelectedFlowEndValue


              }
              AprroversLevel.push(finaltemp)

            }
            if (ExceptionWorkFlow == "Yes" || AutoFlowWork == "Yes") {
              if (i == Number(WorkFlowData[WorkFlowFilterData]['LastLevelNumber'])) {
                if (flag == "No")
                  approvedOrPending = true;
              }
              currentLevel = i;
              let finaltemp = {
                Level: "L" + i,
                Approvers: approvers,
                CreatedDate: new Date(),
                ActionDate: new Date(),
                Status: ExceptionWorkFlow == "Yes" ? "Exception" : AutoFlowWork == "Yes" ? "AutoApproved" : "Pending",
                ExceptionWorkFlow: ExceptionWorkFlow,
                AutoFlowWork: AutoFlowWork,
                ApprovedBy: ExceptionWorkFlow == "Yes" ? "Exception" : AutoFlowWork == "Yes" ? "Auto Approved" : '',
                ApprovalType: WorkFlowData[0]?.SelectedFlowEndValue



              }
              AprroversLevel.push(finaltemp)

            }


          }
        }
      }
      if (WorkFlowFilterData != null && WorkFlowFilterData != undefined && WorkFlowFilterData > -1) {
        // setWorkFlowDataState(true);
        varWorkFlowDataState = 'No'

      }
      else {
        varWorkFlowDataState = 'Yes'
      }
    }
  };

  async function PostAutomationData(finalTemplate) {
    console.log("Called")
    var updateurl =
      getIsInstalled?.SiteUrl +
      "/_api/web/lists/getbytitle('HR365HDMTickets')/items('" +
      rowId +
      "')";

    await ContextService.GetSPContext()

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
      .then((response: SPHttpClientResponse) => {
        if (response.ok) {
        // return response.json();
        } else {
          response.json().then((responseJSON) => {

          });
        }
        // return response.json();
      });

  }
  function ApproveWorkFlowMailForAdmin(ApproversName) {

    let ApprovalButtonUrl;
    let RejectButtonUrl;
    let replyTemplate = emailTemplate.filter(
      (i) => i.Title == "Supervisor & Agent  - New Request Created"
    );

    var currentData = ContextService.GetCurrentUser();
    if (replyTemplate.length > 0) {
      //  Approver = Approver[Approver.length-1]

      let AdminFilter = userList.filter((item) => {
        if (ApproversName.indexOf(item.Users?.Title) > -1 || ApproversName.indexOf(item?.Email) > -1) {
          return item.Email
        }
      })
      let adminofapplication = userList.filter((item) => {
        if (item.Roles == "Admin") {
          return item.Email
        }
      })
      let sendEmailsAll = []
      adminofapplication?.map((i) => {
        sendEmailsAll.push(i.Email);
      });
      AdminFilter?.map((i) => {
        sendEmailsAll.push(i.Email);
      });
      let fromemail;
      if (
        defaultAsignee == null ||
        defaultAsignee == undefined ||
        defaultAsignee == ""
      ) {
        fromemail = "no-reply@sharepointonline.com";
      } else {
        fromemail = defaultAsignee;
      }



      let currentContext = window.location.href.split("#")[0].split(".aspx")[0];
      let taskUrl;
      if (currentContext) {
        taskUrl = currentContext + ".aspx#/Survey/" + generatedIssueID;
      }
      starRatinghtml = '<div>' +
        '<div style="display:flex;align-items:center;justify-content:center;"><p style="font-size:17px;font-weight:600">How satisfied are you with our customer service?</p></div>' +
        '<div style="display:flex;flex-wrap:wrap;justify-content:center;">' +
        //SatisfiedDiv
        '<p style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px;border-color: #E41508; " > <span><a style="color: #E41508; text-decoration:none;" href="' + taskUrl + '&rating=1">Very Dissatisfied</a></p></p > ' +
        //MostlySatisfiedDiv
        '<p style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px; border-color: #C05407;" > <span><a style="color: #C05407; text-decoration:none;" href="' + taskUrl + '&rating=2">Dissatisfied</a></p></p > ' +
        //FairDiv
        '<p style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px; border-color: #9E6900;" > <span><a style="color: #9E6900; text-decoration:none;" href="' + taskUrl + '&rating=3">Fair</a></p></p > ' +
        //MostlyDisSatisfiedDiv
        '<p style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px; border-color:#5E8000;" > <span><a style="color: #5E8000; text-decoration:none;" href="' + taskUrl + '&rating=4">Satisfied</a></p></p > ' +
        //DisSatisfiedDiv
        '<p style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px;border-color: #158901 ;" > <span><a style="color: #158901; text-decoration:none;" href="' + taskUrl + '&rating=5">Very Satisfied</a></p></p > ' +
        '</div >'


      let ApprovalLink = window.location.href.split("#")[0].split(".aspx")[0];

      RejectButtonUrl = ApprovalLink + ".aspx#/RejectFlow/" + generatedIssueID + "$" + "1";
      ApprovalButtonUrl = ApprovalLink + ".aspx#/ApprovalFlow/" + generatedIssueID + "$" + "1";


      let ApproveRejectButtons = '<a style="margin-left:15px;" href=' + ApprovalButtonUrl + '>Approve&nbsp;</a> &nbsp; &nbsp; <a style="margin-left:15px;" href=' + RejectButtonUrl + '>Reject</a>'

      ///***************Survey email code End here *****************///
      if (replyTemplate[0].IsActive == "Yes") {
        let assineeSub = replyTemplate[0].Subject;
        let assineeSub1 = assineeSub.replaceAll("[ticket.subject]", Titlename);
        let assineeSub2 = assineeSub1.replaceAll("[ticket.id]", "[" + ticketSequence + "]");
        assineeSub2 = assineeSub2.replaceAll('[ticket.url]', "").replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', '').replaceAll('[ticket.agent.name]', '').replaceAll('[ticket.agent.email]', '').replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', '').replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.requester.name]', reqName).replaceAll('[ticket.from_email]', requesterEmailId).replaceAll('[ticket.survey_rating]', starRatinghtml).replaceAll('[ticket.service]', servicename).replaceAll('[ticket.subservice]', subservicename);
        assineeSub2 = assineeSub2.replaceAll(null, '').replaceAll(undefined, '');
        let assineeBody = replyTemplate[0].Body;
        let currentContext = window.location.href.split("#")[0].split(".aspx")[0];
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



        let assineeBody1 = assineeBody.replaceAll(
          '[ticket.requester.name]', TicketreqName
        );
        let assineeBody2 = assineeBody1.replaceAll(
          "[ticket.url]",
          `<a href='${taskUrl}'>${ticketSequence}</a>`
        );
        assineeBody2 = assineeBody2.replaceAll("[ticket.id]", ticketSequence).replaceAll("[ticket.subject]", Titlename).replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', '').replaceAll('[ticket.agent.name]', '').replaceAll('[ticket.agent.email]', '').replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.status]', '').replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.from_email]', requesterEmailId).replaceAll('[ticket.survey_rating]', starRatinghtml).replaceAll('[ticket.service]', servicename).replaceAll('[ticket.subservice]', subservicename).replaceAll('[ticket.ReOpenBy]', currentData.displayName).replaceAll('[Approve.Reject.Buttons]', ApproveRejectButtons);
        assineeBody2 = assineeBody2.replaceAll(null, '').replaceAll(undefined, '').replaceAll('[Approve.Reject.Buttons]', ApproveRejectButtons);
        let sendEmailIds = sendEmailsAll;
        let uniqueEmails = [...new Set(sendEmailIds)];
        if (uniqueEmails.length > 0) {
          let fromemail = "no-reply@sharepointonline.com";


          sendEmailReply(assineeSub2, assineeBody2, uniqueEmails, fromemail, AutoCCEmail);
        }
      }
    }
  };

  function ApproveWorkFlowMail(ApproversName) {
    let replyTemplate = emailTemplate.filter(
      (i) => i.Title == "Requester  - New Request Created"
    )

    var currentData = ContextService.GetCurrentUser();

    let fromemail;
    if (
      defaultAsignee == null ||
      defaultAsignee == undefined ||
      defaultAsignee == ""
    ) {
      fromemail = "no-reply@sharepointonline.com";
    } else {
      fromemail = defaultAsignee;
    }



    let currentContext = window.location.href.split("#")[0].split(".aspx")[0];
    let taskUrl;
    if (currentContext) {
      taskUrl = currentContext + ".aspx#/Survey/" + generatedIssueID;
    }
    starRatinghtml = '<div>' +
      '<div style="display:flex;align-items:center;justify-content:center;"><p style="font-size:17px;font-weight:600">How satisfied are you with our customer service?</p></div>' +
      '<div style="display:flex;flex-wrap:wrap;justify-content:center;">' +
      //SatisfiedDiv
      '<p style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px;border-color: #E41508; " > <span><a style="color: #E41508; text-decoration:none;" href="' + taskUrl + '&rating=1">Very Dissatisfied</a></p></p > ' +
      //MostlySatisfiedDiv
      '<p style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px; border-color: #C05407;" > <span><a style="color: #C05407; text-decoration:none;" href="' + taskUrl + '&rating=2">Dissatisfied</a></p></p > ' +
      //FairDiv
      '<p style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px; border-color: #9E6900;" > <span><a style="color: #9E6900; text-decoration:none;" href="' + taskUrl + '&rating=3">Fair</a></p></p > ' +
      //MostlyDisSatisfiedDiv
      '<p style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px; border-color:#5E8000;" > <span><a style="color: #5E8000; text-decoration:none;" href="' + taskUrl + '&rating=4">Satisfied</a></p></p > ' +
      //DisSatisfiedDiv
      '<p style ="border:1px solid; padding:5px 8px; margin:10px; border-radius:5px;border-color: #158901 ;" > <span><a style="color: #158901; text-decoration:none;" href="' + taskUrl + '&rating=5">Very Satisfied</a></p></p > ' +
      '</div >'
    if (replyTemplate.length > 0) {

      if (replyTemplate[0].IsActive == "Yes") {
        let assineeSub = replyTemplate[0].Subject;
        let assineeSub1 = assineeSub.replaceAll("[ticket.subject]", Titlename);
        let assineeSub2 = assineeSub1.replaceAll("[ticket.id]", "[" + ticketSequence + "]");
        assineeSub2 = assineeSub2.replaceAll('[ticket.url]', "").replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', '').replaceAll('[ticket.agent.name]', '').replaceAll('[ticket.agent.email]', '').replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.status]', '').replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.requester.name]', reqName).replaceAll('[ticket.from_email]', requesterEmailId).replaceAll('[ticket.survey_rating]', starRatinghtml).replaceAll('[ticket.service]', servicename).replaceAll('[ticket.subservice]', subservicename);
        assineeSub2 = assineeSub2.replaceAll(null, '').replaceAll(undefined, '');
        let assineeBody = replyTemplate[0].Body;
        let currentContext = window.location.href.split("#")[0].split(".aspx")[0];
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

        let assineeBody1 = assineeBody.replaceAll(
          "[Current.ApprovedBy]",
          ApproversName.split(",")[1]
        ).replaceAll("[ticket.requester.name]", reqName);
        let assineeBody2 = assineeBody1.replaceAll(
          "[ticket.url]",
          `<a href='${taskUrl}'>${ticketSequence}</a>`
        );
        assineeBody2 = assineeBody2.replaceAll("[ticket.id]", ticketSequence).replaceAll("[ticket.subject]", Titlename).replaceAll('[ticket.description]', globalMessage).replaceAll('[ticket.latest_comment]', '').replaceAll('[ticket.agent.name]', "").replaceAll('[ticket.agent.email]', "").replaceAll('[ticket.mergeid]', "").replaceAll('[ticket.isplitidd]', "").replaceAll('[ticket.satisfaction_survey]', "").replaceAll('[ticket.status]', '').replaceAll('[ticket.ticket_type]', requestname).replaceAll('[ticket.priority]', priorityName).replaceAll('[ticket.from_email]', requesterEmailId).replaceAll('[ticket.survey_rating]', starRatinghtml).replaceAll('[ticket.service]', servicename).replaceAll('[ticket.subservice]', subservicename).replaceAll('[ticket.ReOpenBy]', currentData.displayName);
        assineeBody2 = assineeBody2.replaceAll(null, '').replaceAll(undefined, '');
        let sendEmailIds = [requesterEmailId];
        let uniqueEmails = [...new Set(sendEmailIds)];
        if (uniqueEmails.length > 0) {
          let fromemail = "no-reply@sharepointonline.com";
          sendEmailReply(assineeSub2, assineeBody2, uniqueEmails, fromemail, AutoCCEmail);

        }
      }
    }

    ///***************Survey email code End here *****************///

  };
  function saveTicketId() {
    let flag = false;
    let PrefixandID;
    PrefixandID = parseInt(selectedPrefix) + rowId;
    finalticketID = `Ticket#${rowId}`;
    let ticktsequencewithoutSuffix = `${selectedTitle}#${PrefixandID}`;

    if (TeamTicketSuffix == "On") {
      ticketSequence = `${selectedTitle}#${PrefixandID}-${teamname}`;
    } else {
      ticketSequence = `${selectedTitle}#${PrefixandID}`;
    }

    const generateRandomString = (length = 10) => Math.random().toString(20).substr(2, length)
    var ticketId = rowId.toString();

    var ylength = 12 - (4 + ticketId.length);
    var ylengthString = ylength.toString();
    let x = generateRandomString(4);
    let y = generateRandomString(parseInt(ylengthString));
    generatedIssueID = x.toUpperCase() + ticketId + y.toUpperCase();
    // setgeneratedTicketID(generatedIssueID);
    // 



    if (
      finalticketID == null ||
      finalticketID == "" ||
      finalticketID == undefined
    ) {
      flag = true;
    }

    if (AutoAssignTicket == "On") {
      _AutoAssignTicket = "Open";
    } else {
      _AutoAssignTicket = "Unassigned";
    }

    let finalTemplate = {
      TicketID: finalticketID,
      TicketseqWOsuffix: ticktsequencewithoutSuffix,
      TicketSeqnumber: ticketSequence,
      // TicketDescription: globalMessage,
      Status: _AutoAssignTicket,
      IssueId: generatedIssueID,
    };

    // if (varWorkFlowDataState == 'No' && AprroversLevel.length > 0) {
    //   finalTemplate["ApprovalStatus"] = approvedOrPending ? "Approved" : "Pending";
    //   finalTemplate["Approvers"] = JSON.stringify(AprroversLevel)
    //   finalTemplate["CurrentApprovers"] = currentLevel != 0 ? AprroversLevel[currentLevel - 1].Approvers : '';
    //   finalTemplate["CurrentApprovalLevel"] = currentLevel.toString();

    //   if (currentLevel != 0 && !approvedOrPending) {

    //     ApproveWorkFlowMail(AprroversLevel[currentLevel - 1].Approvers);
    //     ApproveWorkFlowMailForAdmin(AprroversLevel[currentLevel - 1].Approvers);
    //   }

    // }

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
            // SaveTicketCon(
            //   finalticketID,
            //   ticktsequencewithoutSuffix,
            //   ticketSequence
            // );

            if (varNewTickcets == 'On') {
              if (MSTeamsCode.includes(teamname)) {
                fillOptionsOfTeamsDropdown();
              }

            }



            // if (userExist == false) {
            //   
            //   postNewUser();
            // }
            sendEmailWOAuto();
            // if (varWorkFlowDataState != 'No' || approvedOrPending || AprroversLevel.length == 0) {

            // }



            // return response.json();
          },
          (error: any): void => {

          }
        )
        .then((item: any) => {

        });
    }
  }


  const gettextvalue = (event): void => {
    dataText[event.target.id] = event.target.defaultValue;
    setdataText({ ...dataText });

  };
  const getnotevalue = (event): void => {
    dataNote[event.target.id] = event.target.defaultValue;
    setdataNote({ ...dataNote });

  };
  const getnumbervalue = (event): void => {
    dataNumber[event.target.id] = event.target.defaultValue;
    setdataNumber({ ...dataNumber });

  };
  // const getlinkvalue = (event): void => {
  //   dataLink[event.target.id] = event.target.defaultValue;
  //   setdataLink({ ...dataLink });
  //   
  // };
  function _getCustomPeoplePickerItems(items: any[]) {
    // let xyz=[items[0].loginName.split('|')[2]];
    // setobpeople(xyz);
    setoptionsexcusers(items);
    // xyz.push(setoptionsexcusers)
    // 
    // 
  }
  // const getChoiceValue = (event): void => {
  //   // dataChoice[event.target.id] = event.target.firstChild.innerHTML;
  //   dataChoice[event.target.id] = event.target.defaultValue;
  //   setdataChoice({ ...dataChoice });
  //   
  // }
  function filterArray(array, filter) {
    var myArrayFiltered = [];
    for (var i = 0; i < array.length; i++) {
      for (var j = 0; j < filter.length; j++) {
        if (array[i][0].InternalName === filter[j].IntName) {
          myArrayFiltered.push(array[i]);
        }
      }
    }
    return myArrayFiltered;
  }

  const getChoice = (event): void => {
    _groupOfColumnstoShow = [];
    _groupOfColumnstoShowandMand = [];
    _groupOfColumnstoHideandMand = [];
    let _groupOfColumnstoHide = [];
    let _groupOfColumnstoHideAll = [];
    let _Internalcolumnname;
    let _choicesubcolumnvalues = [];
    subcolumndropdownoptions = [];

    let _selectedValue = event?.target?.firstChild?.innerHTML?.replaceAll(/\s+/g, '')?.toLowerCase();

    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoShow = AllColumnConditionsArray?.filter((i) => {
        return i?.value == _selectedValue;
      }) : _groupOfColumnstoShow = [],
      CustomDateData[event.target.id] = _selectedValue

    divShow()
    MendetoryShowColumnConditionsArray?.map((item) => {
      _groupOfColumnstoShow?.push({ DisplayName: item, IntName: item, Name: item, mainColumnDisplayName: item, mainColumnIntName: item, value: item })
    })

    isArrayValidated(AllColumnConditionsArray) ?
      _groupOfColumnstoHide = AllColumnConditionsArray?.filter((i) => {
        return i?.value != _selectedValue;
      })
      : _groupOfColumnstoHide = [];



    if (_groupOfColumnstoShow?.length != 0) {
      let _FilterArray = [];
      _groupOfColumnstoHide?.map((z) => {
        if (document?.getElementById(z?.IntName) != null && z?.IntName != event?.target?.id) {
          _groupOfColumnstoHideandMand.push(z?.IntName)
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
      // _groupOfColumnstoShow.map((z) => {
      //   if (document.getElementById(z.IntName) != null) {
      //     _groupOfColumnstoShowandMand.push(z.IntName);
      //     if (allMandatoryFields.includes(z.IntName)) {
      //       MandatoryFields?.push(z.IntName)
      //     }

      //     document.getElementById(z.IntName).style.display = 'block';
      //   }
      // })
    } else {
      // isArrayValidated(AllColumnConditionsArray) ?
      // _groupOfColumnstoHideAll = AllColumnConditionsArray.filter((i) => {
      //   return i.value != _selectedValue;
      // })
      // : _groupOfColumnstoHideAll = [];
      _groupOfColumnstoHide?.map((z) => {
        if (document.getElementById(z.IntName) != null && z.IntName != event.target.id) {
          document.getElementById(z.IntName).style.display = 'none';
          MandatoryFields = MandatoryFields?.filter((v) => {
            return z.IntName != v
          });
        }
      })
    }



    dataChoice2[event.target.id] = event.target.firstChild.innerHTML;
    _Internalcolumnname = [event.target.id];
    selectedvalue = event.target.firstChild.innerHTML;
    //dataChoice2[event.target.id] = event.target.defaultValue;
    setdataChoice2({ ...dataChoice2 });

    _choicesubcolumnvalues = Choicesubarray.filter((items) => {
      return items.key == selectedvalue;
    });


    Subcolumnvalueoption = isArrayValidated(_choicesubcolumnvalues) ? _choicesubcolumnvalues[0].text.split(",") : _choicesubcolumnvalues;
    Subcolumnvalueoption?.map((i) => {
      subcolumndropdownoptions.push({
        key: i,
        text: i

      })
    })
    Suboptionsobject[event.target.id] = subcolumndropdownoptions;

  };

  const MultipalChoiceOnChange = (

    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    var newarray = []

    if (CustomDateData[event?.target['id']] != null && CustomDateData[event?.target['id']] != undefined && CustomDateData[event?.target['id']] != '') {

      newarray = CustomDateData[event?.target['id']].split(',');

    }
    item?.selected == true ? newarray?.push(item?.text) : newarray = newarray?.filter(key => key !== item?.text),


      CustomDateData = ({ ...CustomDateData, [event?.target['id']]: newarray?.join(',') });

    forrendercontent()

    divShow()
  }


  const getpeoplepickerofcustomcolumns = React.useCallback((items: any[], additionalArg1) => {
    let _userArray = [];

    if (isStringValidated(additionalArg1) ? additionalArg1 : "") {

      _userArray.push({
        Name: items[0].text,
        EmailId: items[0].secondaryText
      });
    }




    // let _userDataArray = _userArray.join(',');

    CustomDateData = ({ ...CustomDateData, [additionalArg1]: JSON.stringify(_userArray) });

    forrendercontent()

  }, []);

  const getChoiceforsubcolumns = (event): void => {
    dataChoiceforsub[event.target.id] = event.target.firstChild.innerHTML;
    selectedvalue = event.target.firstChild.innerHTML;
    //dataChoice2[event.target.id] = event.target.defaultValue;
    setdataChoiceforsub({ ...dataChoiceforsub });

  }
  const ondobChange = (date: any, key): void => {
    // let Dateset = new Date(moment(date).utcOffset("+00:00", true).format())
    let Dateset = new Date(date)

    CustomDateData = ({ ...CustomDateData, [key]: Dateset });

    CustomDateData[key] = Dateset;
    forrendercontent()
  };

  // const ondobChange = (date: any): void => {
  //   setDateofbirth(date);
  //   // slectedDate = new Date (Dateofbirth);
  //   
  //   setDisableCustomUpdate(false);
  //   // setCustomUpdate(false);
  // };


  // const OnChangeCustomForm = (
  //   event: React.FormEvent<HTMLDivElement>,
  //   item: IDropdownOption
  // ): void => {
  //   setDefaultFormGuid(item.key as string);
  //   setDescBox(false);
  //   let DefalutData = CustomFormData.filter((itemValue)=>{
  //     return itemValue.FormGuid == item.key;
  //   })
  //   let TicketFieldsCustomArrange;
  //   let TicFields = JSON.parse(DefalutData[0].TicketField)
  //   let _FNames = [];
  //   let _FNamesAndMand = [];
  //   let Ticketarranage=[];
  //   TicFields.map((i)=>{
  //     _FNames.push(i.text);
  //      if(i.MandCheck == true){
  //        _FNamesAndMand.push(i.IntName);
  //      }
  //  })

  //   FieldsNames = _FNames;
  //   Ticketarranage = _FNames;
  //   MandatoryFields=_FNamesAndMand;
  //   TicketFieldsCustomArrange = _FNames;
  //   Ticketarranageorder = [];
  //   for (var i = 0; i < Ticketarranage.length; i++) {
  //     if(Ticketarranage[i]=='Title'){

  //       Ticketarranageorder.push( "titleOrder");

  //     }else  if(Ticketarranage[i]=='Priority'){

  //       Ticketarranageorder.push( "prioOrder");

  //     }else  if(Ticketarranage[i]=="Request Type"){

  //       Ticketarranageorder.push( "requestTypeOrder");

  //     }else  if(Ticketarranage[i]=='Services'){

  //       Ticketarranageorder.push( "serviceOrder");

  //     }else if (Ticketarranage[i] == 'Sub Services') {

  //       Ticketarranageorder.push("subserviceOrder");

  //     }else  if(Ticketarranage[i]=="Requester"){

  //       Ticketarranageorder.push( "requesterOrder");

  //     }else  if(Ticketarranage[i]=='Teams'){

  //       Ticketarranageorder.push( "teamOrder");

  //     }else  if(Ticketarranage[i]=='Ticket Description'){

  //       Ticketarranageorder.push( "DescriptionOrder");

  //     }

  //   }



  //     setTicketOrder(Ticketarranageorder);
  //     getCustomCoulmns();
  //     setDescBox(true);

  // }
  async function OnChangeCustomForm(selected) {

    if (selected) {
      setDefaultFormGuid(selected.key as string);
      setDefaultFormGuidValue(selected.value as string);
      setDescBox(false);
      divHide();
      let DefalutData = CustomFormData.filter((itemValue) => {
        return itemValue.FormGuid == selected.key;
      })

      setDefltTeam(DefalutData[0].DefaultTeamCode);
      setCustomFormID(DefalutData[0].FormGuid);
      setteamname(DefalutData[0].DefaultTeamCode);
      setteam(DefalutData[0].DefaultTeamName);
      if (DefalutData[0].DefaultTeamCode != "" || DefalutData[0].DefaultTeamCode != null || DefalutData[0].DefaultTeamCode != undefined) {
        var filteredService = hroptions.filter((items) => {
          return items.team == DefalutData[0].DefaultTeamCode;
        });

        setServiceOption(filteredService);

        if (defaultserviesvalidation == true) {
          var dfltser = filteredService.filter((items) => {
            return items.default == "Yes";
          });
        }
        var subservicefilter = Suboptions.filter((items) => {
          if (dfltser.length > 0) {
            return items.services == dfltser[0].key;
          }
        });
        if (defaultsubserviesvalidation == true) {
          var dfltsubser = subservicefilter.filter((items) => {
            return items.default == "Yes";
          });
        }
        if (dfltser != undefined || dfltser != null) {
          if (dfltser.length > 0) {
            setDefltService(dfltser[0].key);
            setservicename(dfltser[0].key);
          }
        }
        if (dfltser != undefined || dfltser != null) {
          if (dfltsubser.length > 0) {
            setDefltSubService(dfltsubser[0].key);
            setsubservicename(dfltsubser[0].key);
          }
        }
        subservicefilter = subservicefilter?.sort((a, b) => a?.text?.localeCompare(b?.text));
        setsubserviceOption(subservicefilter);
      }
      setDefltReq(DefalutData[0].DefaultRequestType);
      setrequestName(DefalutData[0].DefaultRequestType);
      setpriorityName(DefalutData[0].DefaultPriority)
      setDefltPriority(DefalutData[0].DefaultPriority);
      let TicketFieldsCustomArrange;
      let TicFields = JSON.parse(DefalutData[0].TicketField)
      let _FNames = [];
      let _FNamesAndMand = [];
      let Ticketarranage = [];
      TicFields?.map((i) => {
        let _customcolValues = ColumnProperties.filter((I) => {
          return I[0].InternalName == i.IntName
        })
        let _cusTvalues = "";
        if (_customcolValues.length > 0) {
          //  _cusTvalues = _customcolValues[0][0].ChoiceValue;
          _FNames.push({ DisplayName: i.text, InternalName: i.IntName, Type: i.Type, values: _customcolValues[0][0].ChoiceValue, DefultValue: _customcolValues[0][0].DefultValue });
        } else {
          _FNames.push({ DisplayName: i.text, InternalName: i.IntName, Type: i.Type, values: "", DefultValue: i.DefultValue });
        }
        if (i.MandCheck == true) {
          _FNamesAndMand.push(i.IntName);
        }
      })

      FieldsNames = _FNames;
      Ticketarranage = _FNames;
      MandatoryFields = _FNamesAndMand;
      allMandatoryFields = _FNamesAndMand;
      TicketFieldsCustomArrange = _FNames;

      setTicketOrder(TicketFieldsCustomArrange);

      // await getCustomCoulmns();

      setServiceDisable(true);
      setRequestDisable(true);
      setTeamDisable(true);
      setPriorityDisable(true);
      setsubserviceDisable(true);
      setDescBox(true);
      setTimeout(function () {

        $.grep(AllColumnConditionsArray, function (v) {
          if (v.IntName != null && v.IntName != "") {
            var allsubcols = v.IntName.split(',');
            allsubcols.forEach(element => {
              var found_column = $.grep(TicketFieldsCustomArrange, (ele) => {
                return v.mainColumnIntName.toLowerCase() == ele.InternalName.toLowerCase();
              })
              if (document.getElementById(element) != null && found_column.length != 0) {
                MandatoryFields = MandatoryFields?.filter((J) => {
                  return element != J
                });
                document.getElementById(element).style.display = 'none';
              }
            });
          }
        });
      }, 1000)

    }
  }
  // <-------------------------------------- SWEET ALERT - SWAL CONTAINER [ANISH] ------------------------->
  const customSwalPropsNormal = {
    desiredWidth: '650px',
    saved,
    error,
    newerror: newerror ? newerror : RequiredColumnMessage ? RequiredColumnMessage : newerror2 ? newerror2 : newerror3 ? newerror3 : newerror4 ? newerror4 : newerror5 ? newerror5 : newerror6 ? newerror6 : newerror7 ? newerror7 : newerror8 ? newerror8 : newerrorService ? newerrorService : newerrorSubService,
  };
  useCustomSwalContainerStyle(customSwalPropsNormal);

  return (
    <>
      <Header SubmitTicket={SubmitTicket} />
      <div className='AddNewTicketsStyle'>
        <div id="RaiseNewTicket" />
        {RequiredColumnMessage
          ? <ReusableSweetAlerts
            type="warning"
            title="Skip"
            text={
              Language.PleaseFillThe ? Language.PleaseFillThe + '  ' + RequiredColumnName : "Please fill the " + '  ' + RequiredColumnName + Language.Field ? Language.Field : " field"
            }
            isBehindVisible={false}
            isConfirmBtn={false}
            id={"#RaiseNewTicket"}
            countdown={2000}
            popupCustomClass={"general-settings"}
          /> : saved ? (
            <ReusableSweetAlerts
              type="success"
              title="Skip"
              text={
                Language.TicketCreatedSuccessfully ? Language.TicketCreatedSuccessfully : "Request created successfully!"
              }
              isBehindVisible={false}
              isConfirmBtn={false}
              id={"#RaiseNewTicket"}
              countdown={2000}
              popupCustomClass={"general-settings"}
            />
          ) : error ? (
            <ReusableSweetAlerts
              type="error"
              title="Skip"
              text={
                Language.SomethingWentWrong
                  ? Language.SomethingWentWrong
                  : "Something went wrong..!"
              }
              isBehindVisible={false}
              isConfirmBtn={false}
              id={"#RaiseNewTicket"}
              countdown={2000}
              popupCustomClass={"general-settings"}
            />
          ) : newerror ? (
            <ReusableSweetAlerts
              type="warning"
              title="Skip"
              text={
                Language.PleaseFillTheRequiredFields
                  ? Language.PleaseFillTheRequiredFields
                  : "Please fill the required fields!"
              }
              isBehindVisible={false}
              isConfirmBtn={false}
              id={"#RaiseNewTicket"}
              countdown={2000}
              popupCustomClass={"general-settings"}
            />
          ) : newerror2 ? (<ReusableSweetAlerts
            type="warning"
            title="Skip"
            text={
              `${Language.PleaseFillThe ? Language.PleaseFillThe : "Please fill the"} ${SettingsCollection.TicketTitleName}`
            }
            isBehindVisible={false}
            isConfirmBtn={false}
            id={"#RaiseNewTicket"}
            countdown={2000}
            popupCustomClass={"general-settings"}
          />) : newerror3 ? (<ReusableSweetAlerts
            type="warning"
            title="Skip"
            text={
              Language.SelectTheRequestType ? Language.SelectTheRequestType : "Please select the request type"
            }
            isBehindVisible={false}
            isConfirmBtn={false}
            id={"#RaiseNewTicket"}
            countdown={2000}
            popupCustomClass={"general-settings"}
          />) : newerror4 ? (<ReusableSweetAlerts
            type="warning"
            title="Skip"
            text={
              Language.SelectThePriority ? Language.SelectThePriority : "Please select the priority"
            }
            isBehindVisible={false}
            isConfirmBtn={false}
            id={"#RaiseNewTicket"}
            countdown={2000}
            popupCustomClass={"general-settings"}
          />) : newerror5 ? (<ReusableSweetAlerts
            type="warning"
            title="Skip"
            text={
              Language.SelectTheRequester ? Language.SelectTheRequester : "Please select the requester"
            }
            isBehindVisible={false}
            isConfirmBtn={false}
            id={"#RaiseNewTicket"}
            countdown={2000}
            popupCustomClass={"general-settings"}
          />) :
            newerror6 ? (<ReusableSweetAlerts
              type="warning"
              title="Skip"
              text={
                Language.EnterTicketDescription ? Language.EnterTicketDescription : "Please enter the Ticket Description"
              }
              isBehindVisible={false}
              isConfirmBtn={false}
              id={"#RaiseNewTicket"}
              countdown={2000}
              popupCustomClass={"general-settings"}
            />) : newerror7 ? (<ReusableSweetAlerts
              type="warning"
              title="Skip"
              text={
                `${Language.PleaseSelectThe ? Language.PleaseSelectThe : "Please select the "}${SettingsCollection.TeamDisplayName}`
              }
              isBehindVisible={false}
              isConfirmBtn={false}
              id={"#RaiseNewTicket"}
              countdown={2000}
              popupCustomClass={"general-settings"}
            />) : newerror8 ? (<ReusableSweetAlerts
              type="warning"
              title="Skip"
              text={
                `${Language.LooksLikeYouDont ? Language.LooksLikeYouDont : "Looks like you don't have member or edit permission to this site"} ${getIsInstalled?.SiteUrl} ${Language.KindlyAskYour ? Language.KindlyAskYour : "kindly ask your site admin or site owner to provide you the permission."}`
              }
              isBehindVisible={false}
              isConfirmBtn={false}
              id={"#RaiseNewTicket"}
              countdown={2000}
              popupCustomClass={"general-settings"}
            />) : newerrorService ? (<ReusableSweetAlerts
              type="warning"
              title="Skip"
              text={
                `${Language.PleaseSelectThe ? Language.PleaseSelectThe : "Please select the "}${SettingsCollection.ServiceName}`
              }
              isBehindVisible={false}
              isConfirmBtn={false}
              id={"#RaiseNewTicket"}
              countdown={2000}
              popupCustomClass={"general-settings"}
            />) : newerrorSubService ? (<ReusableSweetAlerts
              type="warning"
              title="Skip"
              text={
                `${Language.PleaseSelectThe ? Language.PleaseSelectThe : "Please select the "}${SettingsCollection.SubServiceName}`
              }
              isBehindVisible={false}
              isConfirmBtn={false}
              id={"#RaiseNewTicket"}
              countdown={2000}
              popupCustomClass={"general-settings"}
            />) : (
              ""
            )}
        {
          isCustomFormChoice ?
            <>
              <div className={Homestyles.MobileView}>
                <div className={styles.UpperField}>
                  <div style={{ width: '100%' }}>
                    <Label style={{ marginRight: '5px', textAlign: 'center' }}>{Language.SelectTicketRequestForm ? Language.SelectTicketRequestForm : "Select Ticket Request Form"}</Label>
                    {/* <Dropdown label="Select Ticket Request Form" placeholder="Select Ticket Request Form" options={CustomFormOptions} onChange={OnChangeCustomForm} defaultSelectedKey={DefaultFormGuid} className={styles.ChoiceDropdownAddNew}/> */}
                    <Select
                      name={Language.SelectTicketRequestForm ? Language.SelectTicketRequestForm : "Select Ticket Request Form"}
                      isSearchable={true}
                      options={CustomFormOptions}
                      isDisabled={false}
                      styles={customStylesselect}
                      isLoading={false}
                      onChange={OnChangeCustomForm}
                      placeholder={DefaultFormGuidValue != "" ? DefaultFormGuidValue : Language.SelectTicketRequestForm ? Language.SelectTicketRequestForm : "Select Ticket Request Form"}
                    // value={DefaultFormGuid}
                    // className={styles.Margintop}        
                    // label="Select Ticket Request Form" placeholder="Select Ticket Request Form" options={CustomFormOptions} onChange={OnChangeCustomForm} defaultSelectedKey={DefaultFormGuid} className={styles.ChoiceDropdownAddNew}/>
                    />
                  </div>
                </div>
              </div>

              <div className={Homestyles.DesktopView}>

                <div className={styles.UpperField}>
                  <div style={{ width: '50%' }}>
                    <Label style={{ marginRight: '5px', textAlign: 'center' }}>{Language.SelectTicketRequestForm ? Language.SelectTicketRequestForm : "Select Ticket Request Form"}</Label>
                    {/* <Dropdown label="Select Ticket Request Form" placeholder="Select Ticket Request Form" options={CustomFormOptions} onChange={OnChangeCustomForm} defaultSelectedKey={DefaultFormGuid} className={styles.ChoiceDropdownAddNew}/> */}
                    <Select
                      name={Language.SelectTicketRequestForm ? Language.SelectTicketRequestForm : "Select Ticket Request Form"}
                      isSearchable={true}
                      options={CustomFormOptions}
                      isDisabled={false}
                      styles={customStylesselect}
                      isLoading={false}
                      onChange={OnChangeCustomForm}
                      placeholder={DefaultFormGuidValue != "" ? DefaultFormGuidValue : Language.SelectTicketRequestForm ? Language.SelectTicketRequestForm : "Select Ticket Request Form"}
                    // value={DefaultFormGuid}
                    // className={styles.Margintop}        
                    // label="Select Ticket Request Form" placeholder="Select Ticket Request Form" options={CustomFormOptions} onChange={OnChangeCustomForm} defaultSelectedKey={DefaultFormGuid} className={styles.ChoiceDropdownAddNew}/>
                    />
                  </div>
                </div>
              </div>
            </>
            : null
        }




        {DescBox ?
          <>
            <div>
              <div className={styles.addnew}>


                {isArrayValidated(ticketOrder) ?
                  ticketOrder?.map((item) => {
                    return (


                      item.InternalName == "Title" ?

                        <div id="Title">
                          <Label required={MandatoryFields?.includes("Title") ? true : false}>{SettingsCollection.TicketTitleName}</Label>
                          <TextField
                            type="text"
                            onChange={gettitle}
                            // value={isTicketMailBox==="Yes" ? mailSubject : Titlename }
                            value={Titlename}
                            validateOnLoad={false}
                            validateOnFocusOut={true}
                            placeholder={"Enter request title"}
                            onGetErrorMessage={(value) => {
                              if (value == "" || value == undefined || value == null) {
                                return "Enter request title";
                              }
                            }}
                          // className={styles.textwidth}
                          />

                        </div> : item.InternalName == "Priority" ? <>
                          {priorityDisable ?
                            <>
                              <div id="Priority Type">
                                <div className={Homestyles.DesktopView}>
                                  <Label required={MandatoryFields?.includes("Priority") ? true : false}>{Language.PriorityType ? Language.PriorityType : "Priority Type"}</Label>
                                  <div className={iconHideMBNavClassnew}>
                                    {varTeamsPriorityOptions == 'On' ?
                                      <Dropdown
                                        options={priorityoptions}
                                        onChange={getDropPriority}
                                        defaultSelectedKey={defltPriority}
                                        placeholder={Language.PriorityType ? Language.PriorityType : "Priority Type"} />
                                      : <ChoiceGroup
                                        styles={choiceGroupStyles}
                                        options={priorityoptions}
                                        onChange={getpriority}
                                        required={true}
                                        selectedKey={defltPriority}
                                      />}

                                  </div>
                                </div>
                                <div className={Homestyles.MobileView}>
                                  <Label required={MandatoryFields?.includes("Priority") ? true : false} >{Language.PriorityType ? Language.PriorityType : "Priority Type"}</Label>
                                  <Dropdown
                                    options={priorityoptions}
                                    onChange={getDropPriority}
                                    defaultSelectedKey={defltPriority}
                                    placeholder={Language.PriorityType ? Language.PriorityType : "Priority Type"} />
                                  {/* <div className={iconHideMBNavClassnew}>
                          <ChoiceGroup
                            styles={choiceGroupStyles}
                            options={priorityoptions}
                            onChange={getpriority}
                            required={true}
                            selectedKey={defltPriority}
                          />

                        </div> */}
                                </div>
                              </div>
                            </>
                            : null
                          }
                        </>
                          : item.InternalName == "Request Type" ? <>
                            {requestDisable ?
                              <>
                                <div id='Request Type'>
                                  <div className={Homestyles.DesktopView}>

                                    <Label required={MandatoryFields?.includes("Request Type") ? true : false}>{Language.RequestType ? Language.RequestType : "Request Type"}</Label>
                                    <div className={iconHideMBNavClassnew}>
                                      {varTeamsPriorityOptions == 'On' ?
                                        <Dropdown
                                          options={requestoptions}
                                          defaultSelectedKey={defltReq}
                                          onChange={getrequest}
                                          placeholder={Language.RequestType ? Language.RequestType : "Request Type"}
                                        />
                                        : <ChoiceGroup
                                          styles={choiceGroupStyles}
                                          options={requestoptions}
                                          onChange={getrequest}
                                          required={true}
                                          selectedKey={defltReq}
                                        />
                                      }

                                    </div>

                                  </div>


                                  <div className={Homestyles.MobileView}>
                                    <Label required={MandatoryFields?.includes("Request Type") ? true : false}>{Language.RequestType ? Language.RequestType : "Request Type"}</Label>
                                    <Dropdown
                                      options={requestoptions}
                                      defaultSelectedKey={defltReq}
                                      onChange={getDropRequestType}
                                      placeholder={Language.RequestType ? Language.RequestType : "Request Type"}
                                    />
                                    {/* <div className={iconHideMBNavClassnew}>
                           
                            <ChoiceGroup
                              styles={choiceGroupStyles}
                              options={requestoptions}
                              onChange={getrequest}
                              required={true}
                              selectedKey={defltReq}
                            />

                          </div> */}

                                  </div>
                                </div>
                              </>
                              : null
                            }
                          </>
                            :
                            item.InternalName == "Services" ? <>
                              {
                                (serviceDisable && (LicenseType == "P4" || LicenseType == "P3" || LicenseType == "P3" || LicenseType == "Trial")) ?

                                  <div id='Services'>


                                    <Label required={MandatoryFields?.includes("Services") ? true : false}>{SettingsCollection.ServiceName}</Label>
                                    <Dropdown
                                      //selectedKey={selectedItem ? selectedItem.key : undefined}
                                      // eslint-disable-next-line react/jsx-no-bind
                                      onChange={getservice}
                                      placeholder={Language.SelectAnOption ? Language.SelectAnOption : "Select an option"}

                                      options={serviceOption}
                                      // className={styles.textwidth}
                                      selectedKey={defltService}
                                    />



                                  </div>
                                  : null
                              }
                            </>
                              :
                              item.InternalName == "SubServices" || item.InternalName == "Sub Services" ? <>
                                {
                                  (subserviceDisable && (LicenseType == "P4" || LicenseType == "Trial")) ?

                                    <div id='"SubServices"'>


                                      <Label required={MandatoryFields?.includes("Sub Services") ? true : false}>{SettingsCollection.SubServiceName + " L1"}</Label>
                                      <Dropdown
                                        //selectedKey={selectedItem ? selectedItem.key : undefined}
                                        // eslint-disable-next-line react/jsx-no-bind
                                        onChange={getSubservice}
                                        placeholder={Language.SelectAnOption ? Language.SelectAnOption : "Select an option"}
                                        options={subserviceOption}
                                        // className={styles.textwidth}
                                        selectedKey={defltSubService}
                                      />



                                    </div>
                                    : null
                                }
                              </>
                                : item.InternalName == "SubServiceL2" ? <>
                                  {
                                    (subserviceDisable && (LicenseType == "P4" || LicenseType == "Trial")) ?

                                      <div id='SubServiceL2'>


                                        <Label required={MandatoryFields?.includes("SubServiceL2") ? true : false}>{SettingsCollection?.SubServiceName + " L2"}</Label>
                                        <Dropdown
                                          //selectedKey={selectedItem ? selectedItem.key : undefined}
                                          // eslint-disable-next-line react/jsx-no-bind
                                          onChange={onChangeSubservice2}
                                          placeholder={Language.SelectAnOption ? Language.SelectAnOption : "Select an option"}
                                          options={level2SubServiceOptions}
                                          // className={styles.textwidth}
                                          selectedKey={level2SubServicedefault}
                                        />



                                      </div>
                                      : null
                                  }
                                </>
                                  : item.InternalName == "SubServiceL3" ? <>
                                    {
                                      (subserviceDisable && (LicenseType == "P4" || LicenseType == "Trial")) ?

                                        <div id='SubServiceL3'>


                                          <Label required={MandatoryFields?.includes("SubServiceL3") ? true : false}>{SettingsCollection.SubServiceName + " L3"}</Label>
                                          <Dropdown
                                            //selectedKey={selectedItem ? selectedItem.key : undefined}
                                            // eslint-disable-next-line react/jsx-no-bind
                                            onChange={onChangeSubservice3}
                                            placeholder={Language.SelectAnOption ? Language.SelectAnOption : "Select an option"}
                                            options={level3SubserviceOptions}
                                            // className={styles.textwidth}
                                            selectedKey={level3Subservicedefault}
                                          />



                                        </div>
                                        : null
                                    }
                                  </>

                                    // : item.InternalName == "Requester" ?
                                    //   <>
                                    //     {props.userType == "Admin" || props.userType == "Supervisor" || props.userType == "Agent" ?
                                    //       <div id='Requester'>
                                    //         <Label required={MandatoryFields?.includes("Requester") ? true : false}>{Language.Requester ? Language.Requester : "Requester"}</Label>
                                    //         <PeoplePicker
                                    //           context={ContextService.GetFullContext()}
                                    //           placeholder={Language.EnterName ? Language.EnterName : "Enter name"}
                                    //           ensureUser={true}
                                    //           personSelectionLimit={1}
                                    //           groupName={""}
                                    //           onChange={_getPeoplePickerItems}
                                    //           showtooltip={false}
                                    //           disabled={props.userType != "User" || props.userType == '' || props.userType == null || props.userType == undefined ? false : true}
                                    //           showHiddenInUI={false}
                                    //           resolveDelay={1000}
                                    //           defaultSelectedUsers={requester}
                                    //           principalTypes={[PrincipalType.User]}

                                    //         // defaultSelectedUsers={optionsexcusers.length ? }
                                    //         ></PeoplePicker>
                                    //         {/* {MediaFieldToShow ?
                                    // <div>
                                    //   <Label>{Language.RequesterMediaConnect ? Language.RequesterMediaConnect:"Requester's Media of Connect"}</Label>
                                    //   <Dropdown options={mediaOptions} onChange={OnMediaChange} selectedKey={mediaChoosed} />
                                    // </div>
                                    // : null} */}
                                    //       </div>
                                    //       : null}
                                    //   </>
                                      :
                                      item.InternalName == "Teams" ?
                                        <>
                                          {teamDisable ?
                                            <>
                                              <div id='Teams'>
                                                <div className={Homestyles.DesktopView}>
                                                  <Label required={MandatoryFields?.includes("Teams") ? true : false}>{SettingsCollection.TeamDisplayName}</Label>
                                                  <div
                                                    className={iconHideMBNavClassnew}
                                                  // style={{ width: "100%", marginLeft: 20 }}
                                                  >
                                                    {varTeamsPriorityOptions == 'On' ?
                                                      <Dropdown options={
                                                        // fullname ?
                                                        teamsoptionarray
                                                        // : teamsoption
                                                      }
                                                        placeholder={`${Language.Select ? Language.Select : "Select"} ${SettingsCollection.TeamDisplayName}`}
                                                        // defaultSelectedKey={defltTeam}
                                                        selectedKey={defltTeam}
                                                        onChange={getteam}

                                                      />
                                                      : <ChoiceGroup
                                                        styles={choiceGroupStyles}
                                                        options={fullname ?
                                                          teamsoptionarray :
                                                          teamsoption}
                                                        onChange={getteam}
                                                        required={true}
                                                        // defaultSelectedKey={defltTeam}
                                                        selectedKey={defltTeam}
                                                      />}


                                                  </div>
                                                </div>
                                                <div className={Homestyles.MobileView} >
                                                  <Label required={MandatoryFields?.includes("Teams") ? true : false}>{SettingsCollection.TeamDisplayName}</Label>
                                                  <Dropdown options={
                                                    // fullname ?
                                                    teamsoptionarray
                                                    // : teamsoption
                                                  }
                                                    placeholder={`${Language.Select ? Language.Select : "Select"} ${SettingsCollection.TeamDisplayName}`}
                                                    defaultSelectedKey={defltTeam}
                                                    onChange={getDropTeams}

                                                  />
                                                  {/* <div
                                    className={iconHideMBNavClassnew}
                                  // style={{ width: "100%", marginLeft: 20 }}
                                  >
                                    <ChoiceGroup
                                      styles={choiceGroupStyles}
                                      options={fullname ?
                                        teamsoptionarray :
                                        teamsoption}
                                      onChange={getteam}
                                      required={true}
                                      selectedKey={defltTeam}
                                    />

                                  </div> */}
                                                </div>
                                              </div>
                                            </>
                                            : null
                                          }
                                        </>
                                        : item.InternalName == "Cc" ?
                                          <>
                                            <div>
                                              <Label>Cc</Label>
                                              <PeoplePicker
                                                context={ContextService.GetFullContext()}
                                                placeholder={Language.ccplaceholder}
                                                ensureUser={true}
                                                personSelectionLimit={100}
                                                onChange={_getCCMailPeoplePicker}
                                                showtooltip={false}
                                                disabled={false}
                                                showHiddenInUI={false}
                                                resolveDelay={1000}

                                                defaultSelectedUsers={ccemailid.split(',')}
                                                principalTypes={[PrincipalType.User]}

                                              // defaultSelectedUsers={optionsexcusers.length ? }
                                              ></PeoplePicker>
                                            </div>
                                          </>
                                          : item.Type == "Text" ?
                                            <>
                                              <div id={item.InternalName}>
                                                <Label required={MandatoryFields?.includes(item.InternalName) ? true : false}>{item.DisplayName}</Label>
                                                <TextField id={item.InternalName} name={item.DisplayName} onChange={gettextvalue}></TextField>
                                              </div>
                                            </>

                                            : item.Type == "Note" ?

                                              <>
                                                <div id={item.InternalName}>
                                                  <Label required={MandatoryFields?.includes(item.InternalName) ? true : false}>{item.DisplayName}</Label>
                                                  <TextField id={item.InternalName} name={item.DisplayName} onChange={getnotevalue} multiline></TextField>
                                                </div>
                                              </>

                                              : item.Type == "Number" ?
                                                <>
                                                  <div id={item.InternalName}>
                                                    <Label required={MandatoryFields?.includes(item.InternalName) ? true : false}>{item.DisplayName}</Label>
                                                    <TextField id={item.InternalName} name={item.DisplayName} onChange={getnumbervalue} type="Number"></TextField>
                                                  </div>
                                                </>
                                                : item.Type == "DateTime" ?
                                                  <div id={item.InternalName}>
                                                    <Label required={MandatoryFields?.includes(item.InternalName) ? true : false}>{item.DisplayName}</Label>
                                                    {/* <DatePicker id={item[0].InternalName} onSelectDate={(date:Date)=>{ondobChange(date,item[0].InternalName)}} value={Dateofbirth ==undefined || Dateofbirth ==null ? null: new Date(Dateofbirth)}/> */}
                                                    <DatePicker id={item.InternalName} onSelectDate={(date: Date) => { ondobChange(date, item.InternalName) }} value={CustomDateData[item.InternalName] != null ? new Date(CustomDateData[item.InternalName]) : null} />
                                                  </div>
                                                  :
                                                  item.Type == "Choice" ?
                                                    <div id={item.InternalName}>
                                                      <Label required={MandatoryFields?.includes(item.InternalName) ? true : false}>{item.DisplayName}</Label>
                                                      <Dropdown options={item.values == '' ? [] : item.values} id={item.InternalName} onChange={getChoice}
                                                        defaultSelectedKey={item.DefultValue}
                                                      />
                                                    </div> :
                                                    item.Type == "MultipleChoice" ?
                                                      <div id={item.InternalName}>
                                                        <Label required={MandatoryFields?.includes(item.InternalName) ? true : false}>{item.DisplayName}</Label>
                                                        <Dropdown options={item.values == '' ? [] : item.values} id={item.InternalName} selectedKeys={isStringValidated(CustomDateData) ? isStringValidated(CustomDateData[item.InternalName]) ? CustomDateData[item.InternalName].split(',') : [] : []} multiSelect onChange={MultipalChoiceOnChange}
                                                        />
                                                      </div>
                                                      : item.Type == "User" ?
                                                        <div id={item.InternalName}>
                                                          <Label required={MandatoryFields?.includes(item.InternalName) ? true : false}>{item.DisplayName}</Label>
                                                          <PeoplePicker
                                                            context={ContextService.GetFullContext()}

                                                            placeholder={Language.EnterName ? Language.EnterName : "Enter name"}
                                                            ensureUser={true}
                                                            personSelectionLimit={1}
                                                            groupName={""}
                                                            // titleText={item.InternalName}
                                                            // groupId={item.InternalName}
                                                            // onChange={getpeoplepickerofcustomcolumns.bind(item.InternalName)}
                                                            onChange={(selectedItems) => getpeoplepickerofcustomcolumns(selectedItems, item.InternalName)}
                                                            // onChange={getpeoplepickerofcustomcolumns}
                                                            // args= {item.InternalName}
                                                            showtooltip={false}
                                                            // disabled={props.userType != "User" || props.userType == '' || props.userType == null || props.userType == undefined ? false : true}
                                                            showHiddenInUI={false}
                                                            resolveDelay={1000}
                                                            // defaultSelectedUsers={requester}
                                                            principalTypes={[PrincipalType.User]}

                                                          // defaultSelectedUsers={optionsexcusers.length ? }
                                                          ></PeoplePicker>
                                                          {/* <Dropdown options={item.values} id={item.InternalName} selectedKeys={CustomDateData}  multiSelect onChange={MultipalChoiceOnChange} /> */}
                                                        </div>
                                                        :
                                                        null
                    );



                  }
                  ) : null



                }
                {/* {LicenseType == "P4"  || LicenseType == "Trial"?
          <>
          {columnProprties.map((itemname) => {
            if (itemname[0].Type == "Text") {
              return (
                <>
                  <div>
                    <Label required={MandatoryFields?.includes(itemname[0].InternalName)? true : false}>{itemname[0].DisplayName}</Label>
                    <TextField id={itemname[0].InternalName} name={itemname[0].DisplayName} onChange={gettextvalue}></TextField>
                  </div>
                </>
              )
            }
            else if (itemname[0].Type == "Note") {
              return (
                <>
                  <div>
                    <Label required={MandatoryFields?.includes(itemname[0].InternalName)? true : false}>{itemname[0].DisplayName}</Label>
                    <TextField id={itemname[0].InternalName} name={itemname[0].DisplayName} onChange={getnotevalue} multiline></TextField>
                  </div>
                </>
              )
            }
            else if (itemname[0].Type == "Number") {

              return (
                <>
                  <div>
                    <Label required={MandatoryFields?.includes(itemname[0].InternalName)? true : false}>{itemname[0].DisplayName}</Label>
                    <TextField id={itemname[0].InternalName} name={itemname[0].DisplayName} onChange={getnumbervalue} type="Number"></TextField>
                  </div>
                </>
              )
            }
            // else if (itemname[0].Type == "User") {

            //   return (
            //     <>
            //       <div>
            //         <Label>{itemname[0].DisplayName}</Label>
            //         <PeoplePicker context={ContextService.GetFullContext()} onChange={_getCustomPeoplePickerItems} ensureUser={true} defaultSelectedUsers={obpeople}
            //           personSelectionLimit={10}
            //           groupName={""}
            //           showtooltip={false}
            //           disabled={false}
            //           showHiddenInUI={false}
            //           resolveDelay={1000}
            //           principalTypes={[PrincipalType.User]}
            //         ></PeoplePicker>
            //       </div>
            //     </>
            //   )
            // }
            else if (itemname[0].Type == "DateTime") {
              return (
                <>
                  <div>
                    <Label required={MandatoryFields?.includes(itemname[0].InternalName)? true : false}>{itemname[0].DisplayName}</Label>
                    <DatePicker id={itemname[0].InternalName} onSelectDate={ondobChange} value={Dateofbirth ==undefined || Dateofbirth ==null ? null: new Date(Dateofbirth)}/>
                  </div>
                </>
              )
            }
            // else if (itemname[0].Type == "URL") {
            //   return (
            //     <>
            //       <div>
            //         <Label>{itemname[0].DisplayName}</Label>
            //         <TextField id={itemname[0].InternalName} onChange={getlinkvalue}/>
            //       </div>
            //     </>
            //   )
            // }
            else if (itemname[0].Type == "Choice") {
              return (
                <>
                  <div>
                    <Label required={MandatoryFields?.includes(itemname[0].InternalName)? true : false}>{itemname[0].DisplayName}</Label>
                    <Dropdown options={itemname[0].ChoiceValue} id={itemname[0].InternalName} onChange={getChoice}/>
                  </div>
                </>
              )
            }

          })}
             {isArrayValidated(subcolumnProprties) ? subcolumnProprties.map((itemname) => {
                  if(itemname.length>0 && itemname[0].SubColumnType == "Choice"){
                    return(
                        <>
                          <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-smPush">
                              <Label required={MandatoryFields?.includes(itemname[0].InternalName)? true : false}>{itemname[0].DisplayName}</Label>
                              <Dropdown
                              options={Suboptionsobject[itemname[0].ParentColumnName] != undefined ? Suboptionsobject[itemname[0].ParentColumnName] : []}
                              id={itemname[0].InternalName}
                              onChange={getChoiceforsubcolumns}
                              />
                              </div>
                        </>
                    )

                  }







                  // <>




                //  </>


            // :null}



         })
         : null}
          </>
          :null} */}

              </div>
            </div>
            {/* : null}
        {DescBox ? */}
            {MediaFieldToShow ?
              <div>
                <Label>{Language.RequesterMediaConnect ? Language.RequesterMediaConnect : "Requester's Media of Connect"}</Label>
                <Dropdown options={mediaOptions} onChange={OnMediaChange} selectedKey={mediaChoosed} />
              </div>
              : null}

            {isArrayValidated(ticketOrder) ?
              ticketOrder?.map((item) => {
                return (
                  item.InternalName == "Ticket Description" || item.InternalName == "Description" ?
                    <>



                      <div className={`${styles.descpad} ${RichTextToolboxAddNew}`} id="Ticket Description">
                        <Label required={MandatoryFields?.includes("Ticket Description") ? true : false}>{Language.AddTicketDescription ? Language.AddTicketDescription : "Ticket Description"}</Label>
                        {/* <RichText
                  isEditMode={true}
                  value={globalMessage}
                  className="text1"
                  placeholder={"Enter ticket description..."}
                  onChange={(text) => onTextChange(text)}
                ></RichText> */}
                        <ReactQuill
                          ref={(el) => reactQuillRef.current = (el)}
                          theme="snow"
                          modules={{
                            toolbar: toolbarOptions,
                          }}
                          readOnly={false}
                          defaultValue={isTicketMailBox === "Yes" ? CheckUri(globalMessage) : globalMessage}
                          preserveWhitespace={true}
                          formats={formats}
                          placeholder={"Please Elaborate your query..."}
                          onChange={(text) => onTextChange(text)}
                          key={quillRender}
                        />

                      </div>

                    </>
                    : null)
              }) : null
            }

            {/* <div className={`${styles.descpad} ${RichTextToolboxAddNew}`}>
            <div className={Homestyles.DesktopView}>
              <AMDragDropAttach selectedFile={props.selectedFile} setSelectedFile={props.setSelectedFile} onChangeCommercialAttachment={onAttachmentChange1} multiple={true} lightdark={props.lightdarkmode}  IgnoreUptoMBValue={IgnoreUptoMBValue}/>
              <div className={styles.files}>
                <a href={attachFileUrl1} target="_blank">
                  {attachFile1}
                </a>
              </div>

              <div className={styles.button}>
                <PrimaryButton onClick={SubmitTicket}

                  className={styles.button1}>
                  {ButtonSaveText}
                  {loading && (
                    <div className={styles.elementToFadeInAndOut}>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  )}
                </PrimaryButton>
              </div>

            </div>
            <div className={Homestyles.MobileView}>
              <div className={Homestyles.SnedAttachIcon}>
                <div className={styles.imgload}>
                  <label htmlFor="file-input">
                    <FontIcon aria-label="Dictionary" iconName="Attach" className={AttachFontclass.AttachColor} style={{ marginLeft: "5px" }}>
                    </FontIcon>
                  </label>

                  <input
                    onChange={onAttachmentChange1}
                    multiple
                    id="file-input"
                    type="file"
                    // onClick={deletenames}
                    // onClick={addmore}
                    className={styles.attchIcon}

                  />
                </div>
                <ActionButton
                  iconProps={SendIcon}
                  title={Language.SyncMailbox ? Language.SyncMailbox : "Sync Mailbox"}
                  onClick={SubmitTicket}
                  // disabled={refershdisable}
                  styles={{ icon: { color: props.lightdarkmode == 'light' ? 'var(--lightdarkColor) !important' : 'var(--lightdarkBGGray) !important', } }}
                />
              </div>
            </div>
          </div> */}
            <div className={Homestyles.MobileView}>
              <div className={styles.files}>
                <a href={attachFileUrl1} target="_blank">
                  {attachFile1}
                </a>
              </div>
            </div>

          </>
          :
          <>
            <ThemeProvider className={wrapperClass}>
              <Shimmer
                isDataLoaded={DescBox} shimmerElements={shimmerWithElementFirstRow} ariaLabel="Loading content" >
              </Shimmer>
              <Shimmer
                isDataLoaded={DescBox} shimmerElements={shimmerWithElementSecondRow} ariaLabel="Loading content" >
              </Shimmer>
              <Shimmer
                isDataLoaded={DescBox} shimmerElements={shimmerWithElementThirdRow} ariaLabel="Loading content" >
              </Shimmer>
              <Shimmer
                isDataLoaded={DescBox} shimmerElements={shimmerWithElementFourthRow} ariaLabel="Loading content" >
              </Shimmer>
              <Shimmer
                isDataLoaded={DescBox} shimmerElements={shimmerWithElementFifthRow} ariaLabel="Loading content" >
              </Shimmer>
            </ThemeProvider>
          </>
        }
        {isDialogVisibleAccessDenied && <Dialog
          // hidden={!isDialogVisibleAccessDenied}
          hidden={false}
          onDismiss={onHideDialogAccessDenied}
          dialogContentProps={dialogContentAccessDenied}
          modalProps={dialogModalProps}>
          <div>
            {Language.AccessDeniedMessage ? Language.AccessDeniedMessage : `Looks like you don't have member or edit permission to this site, kindly ask your application admin, site admin or site owner to provide you the permission.`}
          </div>
          <DialogFooter styles={DialogFooterStyles}>
            <PrimaryButton onClick={accessDenied} text={Language.Ok ? Language.Ok : "Ok"} />

          </DialogFooter>
        </Dialog>}


      </div>
    </>
    // <div className='AddNewTicketsStyle'>
    // <div id="RaiseNewTicket"/>
    //   {RequiredColumnMessage
    //     ? <ReusableSweetAlerts
    //     type="warning"
    //     title="Skip"
    //     text={
    //       Language.PleaseFillThe ? Language.PleaseFillThe + '  ' + RequiredColumnName : "Please fill the "  + '  ' + RequiredColumnName + Language.Field ? Language.Field : " field"
    //     }
    //     isBehindVisible={false}
    //     isConfirmBtn={false}
    //     id={"#RaiseNewTicket"}
    //     countdown={2000}
    //     popupCustomClass={"general-settings"}
    //   /> : saved ? (
    //       <ReusableSweetAlerts
    //      type="success"
    //      title="Skip"
    //      text={
    //       Language.TicketCreatedSuccessfully ? Language.TicketCreatedSuccessfully : "Ticket created successfully!"
    //      }
    //      isBehindVisible={false}
    //      isConfirmBtn={false}
    //      id={"#RaiseNewTicket"}
    //      countdown={2000}
    //      popupCustomClass={"general-settings"}
    //    />
    //     ) : error ? (
    //       <ReusableSweetAlerts
    //       type="error"
    //       title="Skip"
    //       text={
    //         Language.SomethingWentWrong
    //           ? Language.SomethingWentWrong
    //           : "Something went wrong..!"
    //       }
    //       isBehindVisible={false}
    //       isConfirmBtn={false}
    //       id={"#RaiseNewTicket"}
    //       countdown={2000}
    //       popupCustomClass={"general-settings"}
    //     />
    //     ) : newerror ? (
    //       <ReusableSweetAlerts
    //      type="warning"
    //      title="Skip"
    //      text={
    //        Language.PleaseFillTheRequiredFields
    //          ? Language.PleaseFillTheRequiredFields
    //          : "Please fill the required fields!"
    //      }
    //      isBehindVisible={false}
    //      isConfirmBtn={false}
    //      id={"#RaiseNewTicket"}
    //      countdown={2000}
    //      popupCustomClass={"general-settings"}
    //    />
    //     ) : newerror2 ? ( <ReusableSweetAlerts
    //       type="warning"
    //       title="Skip"
    //       text={
    //         `${Language.PleaseFillThe ? Language.PleaseFillThe : "Please fill the"} ${SettingsCollection.TicketTitleName}`
    //       }
    //       isBehindVisible={false}
    //       isConfirmBtn={false}
    //       id={"#RaiseNewTicket"}
    //       countdown={2000}
    //       popupCustomClass={"general-settings"}
    //     />) : newerror3 ? (    <ReusableSweetAlerts
    //       type="warning"
    //       title="Skip"
    //       text={
    //         Language.SelectTheRequestType ? Language.SelectTheRequestType : "Please select the request type"
    //       }
    //       isBehindVisible={false}
    //       isConfirmBtn={false}
    //       id={"#RaiseNewTicket"}
    //       countdown={2000}
    //       popupCustomClass={"general-settings"}
    //     />) : newerror4 ? (    <ReusableSweetAlerts
    //       type="warning"
    //       title="Skip"
    //       text={
    //         Language.SelectThePriority ? Language.SelectThePriority : "Please select the priority"
    //       }
    //       isBehindVisible={false}
    //       isConfirmBtn={false}
    //       id={"#RaiseNewTicket"}
    //       countdown={2000}
    //       popupCustomClass={"general-settings"}
    //     />) : newerror5 ? (    <ReusableSweetAlerts
    //       type="warning"
    //       title="Skip"
    //       text={
    //         Language.SelectTheRequester ? Language.SelectTheRequester : "Please select the requester"
    //       }
    //       isBehindVisible={false}
    //       isConfirmBtn={false}
    //       id={"#RaiseNewTicket"}
    //       countdown={2000}
    //       popupCustomClass={"general-settings"}
    //     />) :
    //       newerror6 ? (    <ReusableSweetAlerts
    //         type="warning"
    //         title="Skip"
    //         text={
    //           Language.EnterTicketDescription ? Language.EnterTicketDescription : "Please enter the Ticket Description"
    //         }
    //         isBehindVisible={false}
    //         isConfirmBtn={false}
    //         id={"#RaiseNewTicket"}
    //         countdown={2000}
    //         popupCustomClass={"general-settings"}
    //       />) : newerror7 ? (    <ReusableSweetAlerts
    //         type="warning"
    //         title="Skip"
    //         text={
    //           `${Language.PleaseSelectThe ? Language.PleaseSelectThe : "Please select the "}${SettingsCollection.TeamDisplayName}`
    //         }
    //         isBehindVisible={false}
    //         isConfirmBtn={false}
    //         id={"#RaiseNewTicket"}
    //         countdown={2000}
    //         popupCustomClass={"general-settings"}
    //       />) : newerror8 ? (   <ReusableSweetAlerts
    //         type="warning"
    //         title="Skip"
    //         text={
    //           `${Language.LooksLikeYouDont ? Language.LooksLikeYouDont : "Looks like you don't have member or edit permission to this site"} ${getIsInstalled?.SiteUrl} ${Language.KindlyAskYour ? Language.KindlyAskYour : "kindly ask your site admin or site owner to provide you the permission."}`
    //         }
    //         isBehindVisible={false}
    //         isConfirmBtn={false}
    //         id={"#RaiseNewTicket"}
    //         countdown={2000}
    //         popupCustomClass={"general-settings"}
    //       />) : newerrorService ? (   <ReusableSweetAlerts
    //         type="warning"
    //         title="Skip"
    //         text={
    //          `${Language.PleaseSelectThe ? Language.PleaseSelectThe : "Please select the "}${SettingsCollection.ServiceName}`
    //         }
    //         isBehindVisible={false}
    //         isConfirmBtn={false}
    //         id={"#RaiseNewTicket"}
    //         countdown={2000}
    //         popupCustomClass={"general-settings"}
    //       />) : newerrorSubService ? (   <ReusableSweetAlerts
    //         type="warning"
    //         title="Skip"
    //         text={
    //          `${Language.PleaseSelectThe ? Language.PleaseSelectThe : "Please select the "}${SettingsCollection.SubServiceName}`
    //         }
    //         isBehindVisible={false}
    //         isConfirmBtn={false}
    //         id={"#RaiseNewTicket"}
    //         countdown={2000}
    //         popupCustomClass={"general-settings"}
    //       />) : (
    //         ""
    //       )}
    //   {
    //     isCustomFormChoice ?
    //       <>
    //         <div className={Homestyles.MobileView}>
    //           <div className={styles.UpperField}>
    //             <div style={{ width: '100%' }}>
    //               <Label style={{ marginRight: '5px', textAlign: 'center' }}>{Language.SelectTicketRequestForm ? Language.SelectTicketRequestForm : "Select Ticket Request Form"}</Label>
    //               {/* <Dropdown label="Select Ticket Request Form" placeholder="Select Ticket Request Form" options={CustomFormOptions} onChange={OnChangeCustomForm} defaultSelectedKey={DefaultFormGuid} className={styles.ChoiceDropdownAddNew}/> */}
    //               <Select
    //                 name={Language.SelectTicketRequestForm ? Language.SelectTicketRequestForm : "Select Ticket Request Form"}
    //                 isSearchable={true}
    //                 options={CustomFormOptions}
    //                 isDisabled={false}
    //                 styles={customStylesselect}
    //                 isLoading={false}
    //                 onChange={OnChangeCustomForm}
    //                 placeholder={DefaultFormGuidValue != "" ? DefaultFormGuidValue : Language.SelectTicketRequestForm ? Language.SelectTicketRequestForm : "Select Ticket Request Form"}
    //               // value={DefaultFormGuid}
    //               // className={styles.Margintop}        
    //               // label="Select Ticket Request Form" placeholder="Select Ticket Request Form" options={CustomFormOptions} onChange={OnChangeCustomForm} defaultSelectedKey={DefaultFormGuid} className={styles.ChoiceDropdownAddNew}/>
    //               />
    //             </div>
    //           </div>
    //         </div>

    //         <div className={Homestyles.DesktopView}>

    //           <div className={styles.UpperField}>
    //             <div style={{ width: '50%' }}>
    //               <Label style={{ marginRight: '5px', textAlign: 'center' }}>{Language.SelectTicketRequestForm ? Language.SelectTicketRequestForm : "Select Ticket Request Form"}</Label>
    //               {/* <Dropdown label="Select Ticket Request Form" placeholder="Select Ticket Request Form" options={CustomFormOptions} onChange={OnChangeCustomForm} defaultSelectedKey={DefaultFormGuid} className={styles.ChoiceDropdownAddNew}/> */}
    //               <Select
    //                 name={Language.SelectTicketRequestForm ? Language.SelectTicketRequestForm : "Select Ticket Request Form"}
    //                 isSearchable={true}
    //                 options={CustomFormOptions}
    //                 isDisabled={false}
    //                 styles={customStylesselect}
    //                 isLoading={false}
    //                 onChange={OnChangeCustomForm}
    //                 placeholder={DefaultFormGuidValue != "" ? DefaultFormGuidValue : Language.SelectTicketRequestForm ? Language.SelectTicketRequestForm : "Select Ticket Request Form"}
    //               // value={DefaultFormGuid}
    //               // className={styles.Margintop}        
    //               // label="Select Ticket Request Form" placeholder="Select Ticket Request Form" options={CustomFormOptions} onChange={OnChangeCustomForm} defaultSelectedKey={DefaultFormGuid} className={styles.ChoiceDropdownAddNew}/>
    //               />
    //             </div>
    //           </div>
    //         </div>
    //       </>
    //       : null
    //   }




    //   {DescBox ?
    //     <>
    //       <div>
    //         <div className={styles.addnew}>


    //           {isArrayValidated(ticketOrder) ?
    //             ticketOrder?.map((item) => {
    //               return (


    //                 item.InternalName == "Title" ?

    //                   <div id="Title">
    //                     <Label required={MandatoryFields?.includes("Title") ? true : false}>{SettingsCollection.TicketTitleName}</Label>
    //                     <TextField
    //                       type="text"
    //                       onChange={gettitle}
    //                       // value={isTicketMailBox==="Yes" ? mailSubject : Titlename }
    //                       value={Titlename}
    //                       validateOnLoad={false}
    //                       validateOnFocusOut={true}
    //                       placeholder={Language.EnterTitlename ? Language.EnterTitlename : "Enter ticket title"}
    //                       onGetErrorMessage={(value) => {
    //                         if (value == "" || value == undefined || value == null) {
    //                           return Language.EnterTitlename ? Language.EnterTitlename : "Enter ticket title";
    //                         }
    //                       }}
    //                     // className={styles.textwidth}
    //                     />

    //                   </div> : item.InternalName == "Priority" ? <>
    //                     {priorityDisable ?
    //                       <>
    //                       <div id="Priority Type">
    //                         <div className={Homestyles.DesktopView}>
    //                           <Label required={MandatoryFields?.includes("Priority") ? true : false}>{Language.PriorityType ? Language.PriorityType : "Priority Type"}</Label>
    //                           <div className={iconHideMBNavClassnew}>
    //                             {varTeamsPriorityOptions == 'On' ?
    //                               <Dropdown
    //                                 options={priorityoptions}
    //                                 onChange={getDropPriority}
    //                                 defaultSelectedKey={defltPriority}
    //                                 placeholder={Language.PriorityType ? Language.PriorityType : "Priority Type"} />
    //                               : <ChoiceGroup
    //                                 styles={choiceGroupStyles}
    //                                 options={priorityoptions}
    //                                 onChange={getpriority}
    //                                 required={true}
    //                                 selectedKey={defltPriority}
    //                               />}

    //                           </div>
    //                         </div>
    //                         <div className={Homestyles.MobileView}>
    //                           <Label required={MandatoryFields?.includes("Priority") ? true : false} >{Language.PriorityType ? Language.PriorityType : "Priority Type"}</Label>
    //                           <Dropdown
    //                             options={priorityoptions}
    //                             onChange={getDropPriority}
    //                             defaultSelectedKey={defltPriority}
    //                             placeholder={Language.PriorityType ? Language.PriorityType : "Priority Type"} />
    //                           {/* <div className={iconHideMBNavClassnew}>
    //                       <ChoiceGroup
    //                         styles={choiceGroupStyles}
    //                         options={priorityoptions}
    //                         onChange={getpriority}
    //                         required={true}
    //                         selectedKey={defltPriority}
    //                       />

    //                     </div> */}
    //                         </div>
    //                         </div>
    //                       </>
    //                       : null
    //                     }
    //                   </>
    //                     : item.InternalName == "Request Type" ? <>
    //                       {requestDisable ?
    //                         <>
    //                         <div id='Request Type'>
    //                           <div className={Homestyles.DesktopView}>

    //                             <Label required={MandatoryFields?.includes("Request Type") ? true : false}>{Language.RequestType ? Language.RequestType : "Request Type"}</Label>
    //                             <div className={iconHideMBNavClassnew}>
    //                               {varTeamsPriorityOptions == 'On' ?
    //                                 <Dropdown
    //                                   options={requestoptions}
    //                                   defaultSelectedKey={defltReq}
    //                                   onChange={getrequest}
    //                                   placeholder={Language.RequestType ? Language.RequestType : "Request Type"}
    //                                 />
    //                                 : <ChoiceGroup
    //                                   styles={choiceGroupStyles}
    //                                   options={requestoptions}
    //                                   onChange={getrequest}
    //                                   required={true}
    //                                   selectedKey={defltReq}
    //                                 />
    //                               }

    //                             </div>

    //                           </div>


    //                           <div className={Homestyles.MobileView}>
    //                             <Label required={MandatoryFields?.includes("Request Type") ? true : false}>{Language.RequestType ? Language.RequestType : "Request Type"}</Label>
    //                             <Dropdown
    //                               options={requestoptions}
    //                               defaultSelectedKey={defltReq}
    //                               onChange={getDropRequestType}
    //                               placeholder={Language.RequestType ? Language.RequestType : "Request Type"}
    //                             />
    //                             {/* <div className={iconHideMBNavClassnew}>

    //                         <ChoiceGroup
    //                           styles={choiceGroupStyles}
    //                           options={requestoptions}
    //                           onChange={getrequest}
    //                           required={true}
    //                           selectedKey={defltReq}
    //                         />

    //                       </div> */}

    //                           </div>
    //                           </div>
    //                         </>
    //                         : null
    //                       }
    //                     </>
    //                       :
    //                       item.InternalName == "Services" ? <>
    //                         {
    //                           (serviceDisable && (LicenseType == "P4" || LicenseType == "P3" || LicenseType == "P3" || LicenseType == "Trial")) ?

    //                             <div id='Services'>


    //                               <Label required={MandatoryFields?.includes("Services") ? true : false}>{SettingsCollection.ServiceName}</Label>
    //                               <Dropdown
    //                                 //selectedKey={selectedItem ? selectedItem.key : undefined}
    //                                 // eslint-disable-next-line react/jsx-no-bind
    //                                 onChange={getservice}
    //                                 placeholder={Language.SelectAnOption ? Language.SelectAnOption : "Select an option"}

    //                                 options={serviceOption}
    //                                 // className={styles.textwidth}
    //                                 selectedKey={defltService}
    //                               />



    //                             </div>
    //                             : null
    //                         }
    //                       </>
    //                         :
    //                         item.InternalName == "SubServices" || item.InternalName == "Sub Services" ? <>
    //                           {
    //                             (subserviceDisable && (LicenseType == "P4" || LicenseType == "Trial")) ?

    //                               <div id='"SubServices"'>


    //                                 <Label required={MandatoryFields?.includes("Sub Services") ? true : false}>{SettingsCollection.SubServiceName + " L1"}</Label>
    //                                 <Dropdown
    //                                   //selectedKey={selectedItem ? selectedItem.key : undefined}
    //                                   // eslint-disable-next-line react/jsx-no-bind
    //                                   onChange={getSubservice}
    //                                   placeholder={Language.SelectAnOption ? Language.SelectAnOption : "Select an option"}
    //                                   options={subserviceOption}
    //                                   // className={styles.textwidth}
    //                                   selectedKey={defltSubService}
    //                                 />



    //                               </div>
    //                               : null
    //                           }
    //                         </>
    //                           : item.InternalName == "SubServiceL2" ? <>
    //                             {
    //                               (subserviceDisable && (LicenseType == "P4" || LicenseType == "Trial")) ?

    //                                 <div id='SubServiceL2'>


    //                                   <Label required={MandatoryFields?.includes("SubServiceL2") ? true : false}>{SettingsCollection.SubServiceName+ " L2"}</Label>
    //                                   <Dropdown
    //                                     //selectedKey={selectedItem ? selectedItem.key : undefined}
    //                                     // eslint-disable-next-line react/jsx-no-bind
    //                                     onChange={onChangeSubservice2}
    //                                     placeholder={Language.SelectAnOption ? Language.SelectAnOption : "Select an option"}
    //                                     options={level2SubServiceOptions}
    //                                     // className={styles.textwidth}
    //                                     selectedKey={level2SubServicedefault}
    //                                   />



    //                                 </div>
    //                                 : null
    //                             }
    //                           </>
    //                             : item.InternalName == "SubServiceL3" ? <>
    //                               {
    //                                 (subserviceDisable && (LicenseType == "P4" || LicenseType == "Trial")) ?

    //                                   <div id='SubServiceL3'>


    //                                     <Label required={MandatoryFields?.includes("SubServiceL3") ? true : false}>{SettingsCollection.SubServiceName + " L3"}</Label>
    //                                     <Dropdown
    //                                       //selectedKey={selectedItem ? selectedItem.key : undefined}
    //                                       // eslint-disable-next-line react/jsx-no-bind
    //                                       onChange={onChangeSubservice3}
    //                                       placeholder={Language.SelectAnOption ? Language.SelectAnOption : "Select an option"}
    //                                       options={level3SubserviceOptions}
    //                                       // className={styles.textwidth}
    //                                       selectedKey={level3Subservicedefault}
    //                                     />



    //                                   </div>
    //                                   : null
    //                               }
    //                             </>

    //                               : item.InternalName == "Requester" ?
    //                                 <>
    //                                   {props.userType == "Admin" || props.userType == "Supervisor" || props.userType == "Agent" ?
    //                                     <div id='Requester'>
    //                                       <Label required={MandatoryFields?.includes("Requester") ? true : false}>{Language.Requester ? Language.Requester : "Requester"}</Label>
    //                                       <PeoplePicker
    //                                         context={ContextService.GetFullContext()}
    //                                         placeholder={Language.EnterName ? Language.EnterName : "Enter name"}
    //                                         ensureUser={true}
    //                                         personSelectionLimit={1}
    //                                         groupName={""}
    //                                         onChange={_getPeoplePickerItems}
    //                                         showtooltip={false}
    //                                         disabled={props.userType != "User" || props.userType == '' || props.userType == null || props.userType == undefined ? false : true}
    //                                         showHiddenInUI={false}
    //                                         resolveDelay={1000}
    //                                         defaultSelectedUsers={requester}
    //                                         principalTypes={[PrincipalType.User]}

    //                                       // defaultSelectedUsers={optionsexcusers.length ? }
    //                                       ></PeoplePicker>
    //                                       {/* {MediaFieldToShow ?
    //                                 <div>
    //                                   <Label>{Language.RequesterMediaConnect ? Language.RequesterMediaConnect:"Requester's Media of Connect"}</Label>
    //                                   <Dropdown options={mediaOptions} onChange={OnMediaChange} selectedKey={mediaChoosed} />
    //                                 </div>
    //                                 : null} */}
    //                                     </div>
    //                                     : null}
    //                                 </>
    //                                 :
    //                                 item.InternalName == "Teams" ?
    //                                   <>
    //                                     {teamDisable ?
    //                                       <>
    //                                       <div id='Teams'>
    //                                         <div className={Homestyles.DesktopView}>
    //                                           <Label required={MandatoryFields?.includes("Teams") ? true : false}>{SettingsCollection.TeamDisplayName}</Label>
    //                                           <div
    //                                             className={iconHideMBNavClassnew}
    //                                           // style={{ width: "100%", marginLeft: 20 }}
    //                                           >
    //                                             {varTeamsPriorityOptions == 'On' ?
    //                                               <Dropdown options={
    //                                                 // fullname ?
    //                                                 teamsoptionarray
    //                                                 // : teamsoption
    //                                               }
    //                                                 placeholder={`${Language.Select ? Language.Select : "Select"} ${SettingsCollection.TeamDisplayName}`}
    //                                                 defaultSelectedKey={defltTeam}
    //                                                  selectedKey={defltTeam}
    //                                                 onChange={getteam}

    //                                               />
    //                                               : <ChoiceGroup
    //                                                 styles={choiceGroupStyles}
    //                                                 options={fullname ?
    //                                                   teamsoptionarray :
    //                                                   teamsoption}
    //                                                 onChange={getteam}
    //                                                 required={true}
    //                                                 defaultSelectedKey={defltTeam}
    //                                                 selectedKey={defltTeam}
    //                                               />}


    //                                           </div>
    //                                         </div>
    //                                         <div className={Homestyles.MobileView} >
    //                                           <Label required={MandatoryFields?.includes("Teams") ? true : false}>{SettingsCollection.TeamDisplayName}</Label>
    //                                           <Dropdown options={
    //                                             // fullname ?
    //                                             teamsoptionarray
    //                                             // : teamsoption
    //                                           }
    //                                             placeholder={`${Language.Select ? Language.Select : "Select"} ${SettingsCollection.TeamDisplayName}`}
    //                                             defaultSelectedKey={defltTeam}
    //                                             onChange={getDropTeams}

    //                                           />
    //                                           {/* <div
    //                                 className={iconHideMBNavClassnew}
    //                               // style={{ width: "100%", marginLeft: 20 }}
    //                               >
    //                                 <ChoiceGroup
    //                                   styles={choiceGroupStyles}
    //                                   options={fullname ?
    //                                     teamsoptionarray :
    //                                     teamsoption}
    //                                   onChange={getteam}
    //                                   required={true}
    //                                   selectedKey={defltTeam}
    //                                 />

    //                               </div> */}
    //                                         </div>
    //                                         </div>
    //                                       </>
    //                                       : null
    //                                     }
    //                                   </>
    //                                   : item.InternalName == "Cc" ?
    //                                     <>
    //                                       <div>
    //                                         <Label>Cc</Label>
    //                                         <PeoplePicker
    //                                           context={ContextService.GetFullContext()}
    //                                           placeholder={Language.ccplaceholder}
    //                                           ensureUser={true}
    //                                           personSelectionLimit={100}
    //                                           onChange={_getCCMailPeoplePicker}
    //                                           showtooltip={false}
    //                                           disabled={false}
    //                                           showHiddenInUI={false}
    //                                           resolveDelay={1000}

    //                                           defaultSelectedUsers={ccemailid.split(',')}
    //                                           principalTypes={[PrincipalType.User]}

    //                                         // defaultSelectedUsers={optionsexcusers.length ? }
    //                                         ></PeoplePicker>
    //                                       </div>
    //                                     </>
    //                                     : item.Type == "Text" ?
    //                                       <>
    //                                         <div id={item.InternalName}>
    //                                           <Label required={MandatoryFields?.includes(item.InternalName) ? true : false}>{item.DisplayName}</Label>
    //                                           <TextField id={item.InternalName} name={item.DisplayName} onChange={gettextvalue}></TextField>
    //                                         </div>
    //                                       </>

    //                                       : item.Type == "Note" ?

    //                                         <>
    //                                           <div id={item.InternalName}>
    //                                             <Label required={MandatoryFields?.includes(item.InternalName) ? true : false}>{item.DisplayName}</Label>
    //                                             <TextField id={item.InternalName} name={item.DisplayName} onChange={getnotevalue} multiline></TextField>
    //                                           </div>
    //                                         </>

    //                                         : item.Type == "Number" ?
    //                                           <>
    //                                             <div id={item.InternalName}>
    //                                               <Label required={MandatoryFields?.includes(item.InternalName) ? true : false}>{item.DisplayName}</Label>
    //                                               <TextField id={item.InternalName} name={item.DisplayName} onChange={getnumbervalue} type="Number"></TextField>
    //                                             </div>
    //                                           </>
    //                                           : item.Type == "DateTime" ?
    //                                             <div id={item.InternalName}>
    //                                               <Label required={MandatoryFields?.includes(item.InternalName) ? true : false}>{item.DisplayName}</Label>
    //                                               {/* <DatePicker id={item[0].InternalName} onSelectDate={(date:Date)=>{ondobChange(date,item[0].InternalName)}} value={Dateofbirth ==undefined || Dateofbirth ==null ? null: new Date(Dateofbirth)}/> */}
    //                                               <DatePicker id={item.InternalName} onSelectDate={(date: Date) => { ondobChange(date, item.InternalName) }} value={CustomDateData[item.InternalName] != null ? new Date(CustomDateData[item.InternalName]) : null} />
    //                                             </div>
    //                                             :
    //                                             item.Type == "Choice" ?
    //                                               <div id={item.InternalName}>
    //                                                 <Label required={MandatoryFields?.includes(item.InternalName) ? true : false}>{item.DisplayName}</Label>
    //                                                 <Dropdown options={item.values == '' ? [] :item.values} id={item.InternalName} onChange={getChoice}
    //                                                   defaultSelectedKey={item.DefultValue}
    //                                                 />
    //                                               </div> :
    //                                               item.Type == "MultipleChoice" ?
    //                                                 <div id={item.InternalName}>
    //                                                   <Label required={MandatoryFields?.includes(item.InternalName) ? true : false}>{item.DisplayName}</Label>
    //                                                   <Dropdown options={item.values == '' ?  [] : item.values} id={item.InternalName} selectedKeys={isStringValidated(CustomDateData) ? isStringValidated(CustomDateData[item.InternalName]) ? CustomDateData[item.InternalName].split(',') : [] : []} multiSelect onChange={MultipalChoiceOnChange}
    //                                                   />
    //                                                 </div>
    //                                                 : item.Type == "User" ?
    //                                                   <div id={item.InternalName}>
    //                                                     <Label required={MandatoryFields?.includes(item.InternalName) ? true : false}>{item.DisplayName}</Label>
    //                                                     <PeoplePicker
    //                                                       context={ContextService.GetFullContext()}

    //                                                       placeholder={Language.EnterName ? Language.EnterName : "Enter name"}
    //                                                       ensureUser={true}
    //                                                       personSelectionLimit={1}
    //                                                       groupName={""}
    //                                                       // titleText={item.InternalName}
    //                                                       // groupId={item.InternalName}
    //                                                       // onChange={getpeoplepickerofcustomcolumns.bind(item.InternalName)}
    //                                                       onChange={(selectedItems) => getpeoplepickerofcustomcolumns(selectedItems, item.InternalName)}
    //                                                       // onChange={getpeoplepickerofcustomcolumns}
    //                                                       // args= {item.InternalName}
    //                                                       showtooltip={false}
    //                                                       // disabled={props.userType != "User" || props.userType == '' || props.userType == null || props.userType == undefined ? false : true}
    //                                                       showHiddenInUI={false}
    //                                                       resolveDelay={1000}
    //                                                       // defaultSelectedUsers={requester}
    //                                                       principalTypes={[PrincipalType.User]}

    //                                                     // defaultSelectedUsers={optionsexcusers.length ? }
    //                                                     ></PeoplePicker>
    //                                                     {/* <Dropdown options={item.values} id={item.InternalName} selectedKeys={CustomDateData}  multiSelect onChange={MultipalChoiceOnChange} /> */}
    //                                                   </div>
    //                                                   :
    //                                                   null
    //               );



    //             }
    //             ) : null



    //           }
    //           {/* {LicenseType == "P4"  || LicenseType == "Trial"?
    //       <>
    //       {columnProprties.map((itemname) => {
    //         if (itemname[0].Type == "Text") {
    //           return (
    //             <>
    //               <div>
    //                 <Label required={MandatoryFields?.includes(itemname[0].InternalName)? true : false}>{itemname[0].DisplayName}</Label>
    //                 <TextField id={itemname[0].InternalName} name={itemname[0].DisplayName} onChange={gettextvalue}></TextField>
    //               </div>
    //             </>
    //           )
    //         }
    //         else if (itemname[0].Type == "Note") {
    //           return (
    //             <>
    //               <div>
    //                 <Label required={MandatoryFields?.includes(itemname[0].InternalName)? true : false}>{itemname[0].DisplayName}</Label>
    //                 <TextField id={itemname[0].InternalName} name={itemname[0].DisplayName} onChange={getnotevalue} multiline></TextField>
    //               </div>
    //             </>
    //           )
    //         }
    //         else if (itemname[0].Type == "Number") {

    //           return (
    //             <>
    //               <div>
    //                 <Label required={MandatoryFields?.includes(itemname[0].InternalName)? true : false}>{itemname[0].DisplayName}</Label>
    //                 <TextField id={itemname[0].InternalName} name={itemname[0].DisplayName} onChange={getnumbervalue} type="Number"></TextField>
    //               </div>
    //             </>
    //           )
    //         }
    //         // else if (itemname[0].Type == "User") {

    //         //   return (
    //         //     <>
    //         //       <div>
    //         //         <Label>{itemname[0].DisplayName}</Label>
    //         //         <PeoplePicker context={ContextService.GetFullContext()} onChange={_getCustomPeoplePickerItems} ensureUser={true} defaultSelectedUsers={obpeople}
    //         //           personSelectionLimit={10}
    //         //           groupName={""}
    //         //           showtooltip={false}
    //         //           disabled={false}
    //         //           showHiddenInUI={false}
    //         //           resolveDelay={1000}
    //         //           principalTypes={[PrincipalType.User]}
    //         //         ></PeoplePicker>
    //         //       </div>
    //         //     </>
    //         //   )
    //         // }
    //         else if (itemname[0].Type == "DateTime") {
    //           return (
    //             <>
    //               <div>
    //                 <Label required={MandatoryFields?.includes(itemname[0].InternalName)? true : false}>{itemname[0].DisplayName}</Label>
    //                 <DatePicker id={itemname[0].InternalName} onSelectDate={ondobChange} value={Dateofbirth ==undefined || Dateofbirth ==null ? null: new Date(Dateofbirth)}/>
    //               </div>
    //             </>
    //           )
    //         }
    //         // else if (itemname[0].Type == "URL") {
    //         //   return (
    //         //     <>
    //         //       <div>
    //         //         <Label>{itemname[0].DisplayName}</Label>
    //         //         <TextField id={itemname[0].InternalName} onChange={getlinkvalue}/>
    //         //       </div>
    //         //     </>
    //         //   )
    //         // }
    //         else if (itemname[0].Type == "Choice") {
    //           return (
    //             <>
    //               <div>
    //                 <Label required={MandatoryFields?.includes(itemname[0].InternalName)? true : false}>{itemname[0].DisplayName}</Label>
    //                 <Dropdown options={itemname[0].ChoiceValue} id={itemname[0].InternalName} onChange={getChoice}/>
    //               </div>
    //             </>
    //           )
    //         }

    //       })}
    //          {isArrayValidated(subcolumnProprties) ? subcolumnProprties.map((itemname) => {
    //               if(itemname.length>0 && itemname[0].SubColumnType == "Choice"){
    //                 return(
    //                     <>
    //                       <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-smPush">
    //                           <Label required={MandatoryFields?.includes(itemname[0].InternalName)? true : false}>{itemname[0].DisplayName}</Label>
    //                           <Dropdown
    //                           options={Suboptionsobject[itemname[0].ParentColumnName] != undefined ? Suboptionsobject[itemname[0].ParentColumnName] : []}
    //                           id={itemname[0].InternalName}
    //                           onChange={getChoiceforsubcolumns}
    //                           />
    //                           </div>
    //                     </>
    //                 )

    //               }







    //               // <>




    //             //  </>


    //         // :null}



    //      })
    //      : null}
    //       </>
    //       :null} */}

    //         </div>
    //       </div>
    //       {/* : null}
    //     {DescBox ? */}
    //       {MediaFieldToShow ?
    //         <div>
    //           <Label>{Language.RequesterMediaConnect ? Language.RequesterMediaConnect : "Requester's Media of Connect"}</Label>
    //           <Dropdown options={mediaOptions} onChange={OnMediaChange} selectedKey={mediaChoosed} />
    //         </div>
    //         : null}

    //       {isArrayValidated(ticketOrder) ?
    //         ticketOrder?.map((item) => {
    //           return (
    //             item.InternalName == "Ticket Description" || item.InternalName == "Description" ?
    //               <>



    //                 <div className={`${styles.descpad} ${RichTextToolboxAddNew}`} id="Ticket Description">
    //                   <Label required={MandatoryFields?.includes("Ticket Description") ? true : false}>{Language.AddTicketDescription ? Language.AddTicketDescription : "Ticket Description"}</Label>
    //                   {/* <RichText
    //               isEditMode={true}
    //               value={globalMessage}
    //               className="text1"
    //               placeholder={"Enter ticket description..."}
    //               onChange={(text) => onTextChange(text)}
    //             ></RichText> */}
    //                   <ReactQuill
    //                     ref={(el) => reactQuillRef.current = (el)}
    //                     theme="snow"
    //                     modules={{
    //                       toolbar: toolbarOptions,
    //                     }}
    //                     readOnly={false}
    //                     defaultValue={isTicketMailBox ==="Yes" ? CheckUri(globalMessage):globalMessage}
    //                     preserveWhitespace={true}
    //                     formats={formats}
    //                     placeholder={Language.EnterTicketDescription ? Language.EnterTicketDescription : "Enter ticket description..."}
    //                     onChange={(text) => onTextChange(text)}
    //                     key={quillRender}
    //                   />

    //                 </div>

    //               </>
    //               : null)
    //         }) : null
    //       }

    //       {/* <div className={`${styles.descpad} ${RichTextToolboxAddNew}`}>
    //         <div className={Homestyles.DesktopView}>
    //           <AMDragDropAttach selectedFile={props.selectedFile} setSelectedFile={props.setSelectedFile} onChangeCommercialAttachment={onAttachmentChange1} multiple={true} lightdark={props.lightdarkmode}  IgnoreUptoMBValue={IgnoreUptoMBValue}/>
    //           <div className={styles.files}>
    //             <a href={attachFileUrl1} target="_blank">
    //               {attachFile1}
    //             </a>
    //           </div>

    //           <div className={styles.button}>
    //             <PrimaryButton onClick={SubmitTicket}

    //               className={styles.button1}>
    //               {ButtonSaveText}
    //               {loading && (
    //                 <div className={styles.elementToFadeInAndOut}>
    //                   <div></div>
    //                   <div></div>
    //                   <div></div>
    //                 </div>
    //               )}
    //             </PrimaryButton>
    //           </div>

    //         </div>
    //         <div className={Homestyles.MobileView}>
    //           <div className={Homestyles.SnedAttachIcon}>
    //             <div className={styles.imgload}>
    //               <label htmlFor="file-input">
    //                 <FontIcon aria-label="Dictionary" iconName="Attach" className={AttachFontclass.AttachColor} style={{ marginLeft: "5px" }}>
    //                 </FontIcon>
    //               </label>

    //               <input
    //                 onChange={onAttachmentChange1}
    //                 multiple
    //                 id="file-input"
    //                 type="file"
    //                 // onClick={deletenames}
    //                 // onClick={addmore}
    //                 className={styles.attchIcon}

    //               />
    //             </div>
    //             <ActionButton
    //               iconProps={SendIcon}
    //               title={Language.SyncMailbox ? Language.SyncMailbox : "Sync Mailbox"}
    //               onClick={SubmitTicket}
    //               // disabled={refershdisable}
    //               styles={{ icon: { color: props.lightdarkmode == 'light' ? 'var(--lightdarkColor) !important' : 'var(--lightdarkBGGray) !important', } }}
    //             />
    //           </div>
    //         </div>
    //       </div> */}
    //       <div className={Homestyles.MobileView}>
    //         <div className={styles.files}>
    //           <a href={attachFileUrl1} target="_blank">
    //             {attachFile1}
    //           </a>
    //         </div>
    //       </div>

    //     </>
    //     :
    //     <>
    //       <ThemeProvider className={wrapperClass}>
    //         <Shimmer
    //           isDataLoaded={DescBox} shimmerElements={shimmerWithElementFirstRow} ariaLabel="Loading content" >
    //         </Shimmer>
    //         <Shimmer
    //           isDataLoaded={DescBox} shimmerElements={shimmerWithElementSecondRow} ariaLabel="Loading content" >
    //         </Shimmer>
    //         <Shimmer
    //           isDataLoaded={DescBox} shimmerElements={shimmerWithElementThirdRow} ariaLabel="Loading content" >
    //         </Shimmer>
    //         <Shimmer
    //           isDataLoaded={DescBox} shimmerElements={shimmerWithElementFourthRow} ariaLabel="Loading content" >
    //         </Shimmer>
    //         <Shimmer
    //           isDataLoaded={DescBox} shimmerElements={shimmerWithElementFifthRow} ariaLabel="Loading content" >
    //         </Shimmer>
    //       </ThemeProvider>
    //     </>
    //   }
    //   {isDialogVisibleAccessDenied && <Dialog
    //     // hidden={!isDialogVisibleAccessDenied}
    //     hidden={false}
    //     onDismiss={onHideDialogAccessDenied}
    //     dialogContentProps={dialogContentAccessDenied}
    //     modalProps={dialogModalProps}>
    //     <div>
    //       {Language.AccessDeniedMessage ? Language.AccessDeniedMessage : `Looks like you don't have member or edit permission to this site, kindly ask your application admin, site admin or site owner to provide you the permission.`}
    //     </div>
    //     <DialogFooter styles={DialogFooterStyles}>
    //       <PrimaryButton onClick={accessDenied} text={Language.Ok ? Language.Ok : "Ok"} />

    //     </DialogFooter>
    //   </Dialog>}


    // </div>
  );

}

export default AddNewTickets;
