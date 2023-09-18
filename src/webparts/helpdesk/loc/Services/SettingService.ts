import ContextService from "./ContextService";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
  IHttpClientOptions,
  HttpClient,
  HttpClientResponse,
} from "@microsoft/sp-http";
export default class SettingService {

  private static hdpsiteurl: string;
  private static fcall: string;
  private static dcall: string;
  private static createdDate: Date;
  private static clientID: Date;
  private static tenantID: string;
  private static urole: string;
  private static titleName: string;
  private static teamName: string;
  private static serviceName: string;
  private static subServiceName: string;
  private static showResolved: string;
  private static showLanguage: string;
  private static enableHelpdesk: string;
  private static Dateformat: string;
  private static SettingsCollection: object;

  public static Init(

    hdpsiteurl: string,
    fcall: string,
    dcall: string,
    createdDate: Date,
    clientID: Date,
    tenantID: string,
    urole:string,
    titleName:string,
    teamName:string,
    serviceName:string,
    subServiceName:string,
    showResolved:string,
    showLanguage:string,
    enableHelpdesk:string,
    Dateformat:string,
    SettingsCollection: object,

  ) {

    this.hdpsiteurl = hdpsiteurl;
    this.fcall = fcall;
    this.dcall = dcall;
    this.createdDate = createdDate;
    this.clientID = clientID;
    this.tenantID = tenantID;
    this.urole=urole;
    this.titleName=titleName;
    this.teamName=teamName;
    this.serviceName=serviceName;
    this.subServiceName=subServiceName;
    this.showResolved=showResolved;
    this.showLanguage=showLanguage;
    this.enableHelpdesk=enableHelpdesk;
    this.Dateformat=Dateformat;
    this.SettingsCollection=SettingsCollection;
  }


  public static GetFirstInstalledDate() {
    return this.createdDate;
  }
  public static GetFirstCall() {
    return this.fcall;
  }
  public static GetHDPURL(): string {
    return this.hdpsiteurl;
  }
  public static GetFCall(): string {
    return this.fcall;
  }
  public static GetDCall(): string {
    return this.dcall;
  }
  public static GetClientID() {
    return this.clientID;
  }
  public static GetTenantID() {
    return this.tenantID;
  }
  public static GetURole() {
    return this.urole;
  }
  public static GetTitleName() {
    return this.titleName;
  }
  public static GetTeamName() {
    return this.teamName;
  }
  public static GetServiceName() {
    return this.serviceName;
  }
  public static GetSubServiceName() {
    return this.subServiceName;
  }
  public static GetshowResolved() {
    return this.showResolved;
  }
  public static GetshowLanguage() {
    return this.showLanguage;
  }
  public static GetShowMailbox() {
    return this.enableHelpdesk;
  }
  public static GetDateformat() {
    return this.Dateformat;
  }
  public static GetSettingsCollection() {
    return this.SettingsCollection;
  }
}
