import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
// @ts-ignore
import * as strings from 'HelpdeskWebPartStrings'; 
import Helpdesk from './components/Helpdesk';
import { IHelpdeskProps } from './components/IHelpdeskProps';
import SettingService from './loc/Services/SettingService'
import ContextService from './loc/Services/ContextService';
import { ListEnsureResult, Web } from 'sp-pnp-js';
import { ISPHttpClientOptions, SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
export interface IHelpdeskWebPartProps {
  description: string;
}

export default class HelpdeskWebPart extends BaseClientSideWebPart<IHelpdeskWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    const element: React.ReactElement<IHelpdeskProps> = React.createElement(
      Helpdesk,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName
      }
    );

    ReactDom.render(element, this.domElement);
  }

  //  <--------------------- SET DEFAULT VALUE -------------------------->
  
  private setDefaultValueAddNewTicketsWebparts() {
    ContextService.GetSPContext()
      .get(
        `${ContextService.GetUrl()}/_api/web/lists/getbytitle('HR365HDMAddNewTicketsWebpart')/items`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            Accept: "application/json; odata=nometadata",
            "odata-version": "",
          },
        }
      )
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((rawdata: any) => {
        var _all = rawdata.value;
        if (_all.length == 0) {
          let ListItemData={
            IsInstalled:"No",
            SiteUrl:"No",
          }
          ContextService.GetSPContext()
          .post(
            `${ContextService.GetUrl()}/_api/web/lists/getbytitle('HR365HDMAddNewTicketsWebpart')/items`,
            SPHttpClient.configurations.v1,
            {
              headers: {
                Accept: "application/json;odata=nometadata",
                "Content-type": "application/json;odata=nometadata",
                "odata-version": "",
              },
              body: JSON.stringify(ListItemData),
            }
          )
          .then((response: SPHttpClientResponse) => {
            return response.json();
          },
            (error: any): void => {
              console.log("Default Adding Error",error);
            }
          )
          .then((item: any) => {
            console.log("Default Added");
          });
        }
      });

  }
  // <---------------- CREATING NEW COLUMNS. ---------------------------->
  private createColumnsAddNewWebpart(): Promise<any> {
    let empcolEN = [];
    var XMLIsInstalled = '<Field Name="IsInstalled" ID="{466A69DA-738D-4C44-9E9F-F96980EA2D22}" DisplayName="IsInstalled" Type="Note"></Field>';
    var XMLSiteUrl = '<Field Name="SiteUrl" ID="{1C16E3C5-3834-48EB-AFE4-FA0138470BE2}" DisplayName="SiteUrl" Type="Note"></Field>';

    empcolEN = [XMLIsInstalled, XMLSiteUrl];
    let web = new Web(ContextService.GetUrl());
    return web.lists.ensure("HR365HDMAddNewTicketsWebpart").then((ler: ListEnsureResult) => {
      const batch = web.createBatch();

      for (let i = 0; i < empcolEN.length; i++) {
        ler.list.fields.inBatch(batch).createFieldAsXml(empcolEN[i]).catch(e => {
        });
      }
      return batch.execute();
    });
  }



  protected onInit(): Promise<void> {
    ContextService.Init(
      this.context.spHttpClient,
      this.context.httpClient,
      this.context.msGraphClientFactory,
      this.context.pageContext.web.absoluteUrl,
      this.context.pageContext.user,
      this.context.pageContext.legacyPageContext["userId"],
      this.context,
      this.context.pageContext.site.id['_guid'],
      this.context.pageContext.aadInfo.tenantId._guid,
    );
    const url: string = this.context.pageContext.web.absoluteUrl + "/_api/web/lists";
    const listDefinitionstAddNewWebpart: any = {
      "Title": "HR365HDMAddNewTicketsWebpart",
      "BaseTemplate": 100,
      "Hidden": true,
      "NoCrawl": true,

    };
    const spHttpClientOptionsstSetting: ISPHttpClientOptions = {
      "body": JSON.stringify(listDefinitionstAddNewWebpart)
    };

    this.context.spHttpClient.post(url, SPHttpClient.configurations.v1, spHttpClientOptionsstSetting)
    .then((response: SPHttpClientResponse) => {
      this.createColumnsAddNewWebpart().then(() => {
        this.setDefaultValueAddNewTicketsWebparts();
        console.log("List Created!",Date.now());
      }
      );
    });


    return this._getEnvironmentMessage().then(message => {
      this._environmentMessage = message;
    });
  }



  private _getEnvironmentMessage(): Promise<string> {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
      return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
        .then(context => {
          let environmentMessage: string = '';
          switch (context.app.host.name) {
            case 'Office': // running in Office
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
              break;
            case 'Outlook': // running in Outlook
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
              break;
            case 'Teams': // running in Teams
              environmentMessage = this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
              break;
            default:
              throw new Error('Unknown host');
          }

          return environmentMessage;
        });
    }

    return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
