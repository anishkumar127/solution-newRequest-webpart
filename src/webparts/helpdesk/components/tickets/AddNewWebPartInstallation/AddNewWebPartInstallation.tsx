import React, { useEffect, useState } from 'react'
import ReusableDialogModal from '../../../utils/CustomModels/ReusableDialogModal'
import { useStore } from '../../../store/zustand';
import Typed from '../../../TypeSafety/Types';
import ContextService from '../../../loc/Services/ContextService';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react';
import { Spinner, SpinnerSize } from '@fluentui/react';
import { useAddNewApiStore } from '../../../store/apis_add-new-tickts/add-new-apis';

const AddNewWebPartInstallation = ({ UIRender }) => {
    const navigateUrl = window.location.href.split('/sites')[0];
    const HRlogo: any = require('../../../../../../assets/HR365SPFXmainlog.png');
    const HDPlogo: any = require('../../../../../../assets/help-desk.png');
    const [isOpened, setIsOpened] = useState<boolean>(false);
    const [isUrlValid, setIsUrlValid] = useState<boolean>(false);
    const [refreshUI, setRefreshUI] = useState<boolean>(false);
    const [updateSubmit, setUpdateSubmit] = useState<boolean>(false);
    const [siteUrl, setSiteUrl] = useState<string>("");
    const isInstalledInfo = useStore((state) => state.getIsInstalled());
    const setIsInstalled = useStore((state) => state.setIsInstalled);
    const fetchIsInstalled = useStore((state) => state.fetchIsInstalled);
  const fetchUserLists = useAddNewApiStore((state) => state.fetchUserLists);
 
    const [Isloading,setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            if (isInstalledInfo?.IsInstalled === Typed.No) {
                setIsOpened(true);
            }
        }, 400);
        console.log("isInstalledInfo", isInstalledInfo);
    }, [])

    const fetchSettingsCollection = async () => {
        try {
            if (siteUrl?.trim()) {
                ContextService.GetSPContext()
                .get(
                    `${siteUrl}/_api/web/lists/getbytitle('HR365HDMSettings')/items`,
                    SPHttpClient.configurations.v1,
                    {
                        headers: {
                            Accept: "application/json;odata=nometadata",
                            "odata-version": "",
                        },
                    }
                )
                .then(async(response: SPHttpClientResponse) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(`Request failed with status: ${response.status}`);
                    }
                })
                .then(async(items: any) => {
                    // console.log("fetching for validation.")
                    if(items?.value?.length>0){
                        const Template = {
                            IsInstalled: Typed.Yes,
                            SiteUrl: siteUrl
                        }
                        await fetchUserLists(siteUrl);

                        setIsOpened(false);
                        UIRender?.setLoading(true);
                        setIsUrlValid(false);
                        setRefreshUI(!refreshUI);
                        UIRender?.setUIRender(!UIRender?.uiRender)
                        setIsInstalled(Template);
                        setTimeout(() => {
                            UIRender?.setLoading(false);
                        }, 2000);
                    }else{
                        throw new Error(`Request failed with status 404`);
                    }
                })
                .catch((error: Error) => {
                    setIsUrlValid(true);
                    // setTimeout(() => {
                    //     setIsUrlValid(false);
                    // }, 2000)
                    console.error("An error occurred:", error.message);
                });
            }else{
                setIsUrlValid(true);
            }
      
        } catch (error) {
            console.error("A synchronous error occurred:", error);
        }
        console.log("called store fetch data");
    }

    const onSubmit = async () => {
        setUpdateSubmit(!updateSubmit);
        setTimeout(async () => {
            await fetchSettingsCollection();
        }, 300);

    }
    useEffect(() => {
        console.log("Loading & All API Calls Again. After submit...");
        const fetchedIsInstalled = async () => {
            await fetchIsInstalled();
        }
        fetchedIsInstalled();
    }, [refreshUI, updateSubmit]);

    const UrlValidatorMsg = () => (
        <MessageBar
            messageBarType={MessageBarType.warning}
            isMultiline={true}
            onDismiss={messageDismiss}
            dismissButtonAriaLabel={"Close"}
        >
            {"URL you have entered seems to be incorrect, please enter valid URL to proceed"}
        </MessageBar>
    );

    const messageDismiss = () => {
        setIsUrlValid(false);
    };

    return (
        <>
    {    Isloading ? <Spinner size={SpinnerSize.large} /> :
            <ReusableDialogModal
                title="Skip"
                isOpened={isOpened}
                onClose={() => setIsOpened(false)}
                modelStyle='modal-style-add-new-webpart'
            >
                <>

                    <div className="QWE" style={{ display: 'block', marginTop: '-24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <img src={HRlogo} style={{ width: '100px', marginLeft: '-5px', marginTop: '15px' }} />
                        </div>
                        {
                            isUrlValid ? <span style={{ paddingTop: "5px" }}><UrlValidatorMsg /> </span> : null
                        }
                        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: "5px" }}>
                            <img src={HDPlogo} style={{ width: '100%', maxWidth: '95px' }} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <strong>
                                <div className={'diaheader'} style={{ paddingBottom: "5px" }} >{"Welcome to HD365 Ticket Form Add-on"}</div>

                            </strong>
                            <div className={'dia3rdheader'} style={{ fontSize: "15px" }}>{"Please enter site URL for installed Helpdesk 365."}
                            </div>
                            <div className={'dia3rdheader'} style={{ fontSize: "15px" }}>{"to navigate to the SharePoint homepage, please "}<a target='_blank' href={navigateUrl}>click here.</a>
                            </div>
                        </div>
                    </div>

                    <div className='add-new-installation-common-style-btn-input'>
                        <input className='add-new-webpart-site-url-input' type='text' placeholder='Enter site URL' onChange={(e) => setSiteUrl(e.target.value)} />
                    </div>
                    <div className='add-new-installation-common-style-btn-input'>
                        <button className='add-new-installation-submit-btn' onClick={onSubmit}>Submit</button>
                    </div>
                </>
            </ReusableDialogModal>}

        </>
    )
}

export default AddNewWebPartInstallation