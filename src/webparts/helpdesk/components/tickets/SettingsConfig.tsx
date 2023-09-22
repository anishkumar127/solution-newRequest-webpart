import { Icon, Label, Toggle } from '@fluentui/react';
import React, { useEffect, useState } from 'react'
import ContextService from '../../loc/Services/ContextService';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { useStore } from '../../store/zustand';
import Typed from '../../TypeSafety/Types';
import ReusableSweetAlerts from '../../utils/SweetAlerts/ReusableSweetAlerts';
import { setTimedState } from '../../utils/timeout/setTimedState';


const SettingsConfig = () => {
    const setIsInstalled = useStore((state) => state.setIsInstalled);
    const getIsInstalled = useStore((state) => state.getIsInstalled());
    const fetchIsInstalled = useStore((state) => state.fetchIsInstalled);


    const [siteUrl, setSiteUrl] = useState<string>("");
    const [urlNotValidMsg, setUrlNotValidMsg] = useState<boolean>(false);
    const [urlValidMsg, setUrlValidMsg] = useState<boolean>(false);
    const [isExpandView, setIsExpandView] = useState(false);
    const [updatedGeneralSettings, setUpdatedGeneralSettings] = useState<boolean>(false);

    // <-------------------  EXPAND VIEW ON CHANGE -----------------------------------

    const onChangeHandleExpandView = (e, isChecked) => {
        if (e) {
            const CheckedValue = isChecked ? Typed.Yes : Typed.No;
            const TemplateData = {
                ExpandView: CheckedValue
            };
            if (TemplateData) {
                setIsInstalled(TemplateData)
            }
            console.log("%c isChecked onChange", "background:red", isChecked);
            setIsExpandView(isChecked);
            console.log("updatedGeneralSettings ,OnChange ", updatedGeneralSettings)
            isChecked ? setUpdatedGeneralSettings((prev) => !prev) : setUpdatedGeneralSettings((prev) => !prev)
        }
    }

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
                    .then((response: SPHttpClientResponse) => {
                        if (response.ok) {
                            const Template = {
                                IsInstalled: Typed.Yes,
                                SiteUrl: siteUrl
                            }
                            setUrlValidMsg(true);
                            setTimedState(setUrlValidMsg, true, 2000);
                            setIsInstalled(Template);
                            return response.json();
                        } else {
                            throw new Error(`Request failed with status: ${response.status}`);
                        }
                    })
                    .then((items: any) => {
                        console.log("fetching for validation.")
                    })
                    .catch((error: Error) => {
                        setUrlNotValidMsg(true);
                        setTimedState(setUrlNotValidMsg, true, 2000);
                        console.error("An error occurred:", error.message);
                    });
            } else {
                setUrlNotValidMsg(true);
                setTimedState(setUrlNotValidMsg, true, 2000);
            }

        } catch (error) {
            console.error("A synchronous error occurred:", error);
        }
        console.log("called store fetch data");
    }

    const onSubmit = async () => {
        await fetchSettingsCollection();
    }

    useEffect(() => {
        const url = getIsInstalled?.SiteUrl;
        const ExpandView = getIsInstalled?.ExpandView;
        if (url) {
            setSiteUrl(url);
        }
        console.log("OK? => ExpandView", ExpandView)
        if (ExpandView) {
            console.log("OK => ExpandView", ExpandView)
            setIsExpandView(ExpandView === Typed.Yes ? true : false);
        }
    }, []);
    React.useEffect(() => {
        const fetchedIsInstalled = async () => {
            await fetchIsInstalled();
        }
        fetchedIsInstalled();
    }, []);
    return (
        <div style={{ padding: "0px 20px", margin: "0px" }}>
            <div className='configure-settings-btn-input'>
                <div style={{ flexGrow: "1" }}>
                    <input className='add-new-webpart-site-url-input' style={{ width: "90%" }} type='text' placeholder='Enter site URL' value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} />
                </div>
                <div className='add-new-installation-common-style-btn-input'>
                    <button className='add-new-installation-submit-btn' onClick={onSubmit}>Submit</button>
                </div>
            </div>

            {/* Toggle */}
            <div className='configure-toggle-btn-alignment'>
                <Label>Expand Default View</Label>
                <Toggle checked={isExpandView} onText="On" offText="Off" onChange={onChangeHandleExpandView} />
            </div>
            {/* <div className='configure-toggle-btn-alignment'>
                <Label>Setting</Label>
                <Toggle defaultChecked onText="On" offText="Off" />
            </div> */}

            {/* Sweet Alerts */}
            {
                urlNotValidMsg && <ReusableSweetAlerts
                    type="warning"
                    title="Skip"
                    text={
                        "URL you have entered seems to be incorrect, please enter valid URL to proceed."
                    }
                    isBehindVisible={false}
                    isConfirmBtn={false}
                    id={"#ConfigureRequest2"}
                    countdown={2000}
                    popupCustomClass={"general-settings"}
                />

            }
            {
                urlValidMsg && <ReusableSweetAlerts
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
        </div>
    )
}

export default SettingsConfig