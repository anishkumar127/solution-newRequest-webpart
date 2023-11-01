import { DefaultButton, Dropdown, PrimaryButton } from '@fluentui/react'
import React from 'react'


const DefaultFields = (props) => {
    const { propsData, onDefaultSubmit, setOpenModel } = props;
    const renderOption = (option) => {
        return (
            <div title='Select this as the default choice'>{option.text}</div>
        );
    }
    return (
        <React.Fragment>
                <div id="A"/>
            <div className='draggble-container'>

                {/* DEFAULT CONTNET */}
                <div className='draggable-two draggable-default-content'>
                    <Dropdown
                        label={"Teams"}
                        calloutProps={{
                            styles: {
                                root: {
                                    maxHeight: '200px !important',
                                },
                            }
                        }}
                        options={propsData?.teamsoptionarray}
                        onChange={propsData?.handleTeamsOnChange}
                        placeholder="Select teams"
                        // selectedKey={propsData?.defltTeam}
                        onRenderOption={renderOption}
                        multiSelect
                        selectedKeys={propsData?.defltTeam}
                    />
                    {/* Service ui */}
                    <Dropdown
                        label={"Service"}
                        calloutProps={{
                            styles: {
                                root: {
                                    maxHeight: '200px !important',
                                },
                            }
                        }}
                        options={propsData?.serviceOption}
                        onChange={propsData?.handleServiceOnChange}
                        placeholder="Select services"
                        // selectedKey={propsData?.defltService}
                        onRenderOption={renderOption}
                        multiSelect
                        selectedKeys={propsData?.defltService}
                    />
                    {/* Sub Service ui */}
                    <Dropdown
                        label={"Sub Service"}
                        calloutProps={{
                            styles: {
                                root: {
                                    maxHeight: '200px !important',
                                },
                            }
                        }}
                        options={propsData?.subserviceOption}
                        onChange={propsData?.handleSubServiceOnChange}
                        placeholder="Select sub services"
                        // selectedKey={propsData?.defltSubService}
                        onRenderOption={renderOption}
                        multiSelect
                        selectedKeys={propsData?.defltSubService}
                    />
                    {/* Priority */}
                    <Dropdown
                        label={"Priority"}
                        calloutProps={{
                            styles: {
                                root: {
                                    maxHeight: '200px !important',
                                },
                            }
                        }}
                        options={propsData?.priorityoptions}
                        onChange={propsData?.handlePriorityOnChange}
                        placeholder="Select priority"
                        // defaultSelectedKey={propsData?.defltPriority}
                        // selectedKey={propsData?.defltPriority}
                        onRenderOption={renderOption}
                        multiSelect
                        selectedKeys={propsData?.defltPriority}
                    />

                    {/* Request Type */}
                    <Dropdown
                        label={"Request Type"}
                        calloutProps={{
                            styles: {
                                root: {
                                    maxHeight: '200px !important',
                                },
                            }
                        }}
                        options={propsData?.requestoptions}
                        onChange={propsData?.handleRequestTypeOnChange}
                        placeholder="Select request type"
                        // selectedKey={propsData?.defltReq}
                        onRenderOption={renderOption}
                        multiSelect
                        selectedKeys={propsData?.defltReq}
                    />
                </div>
            </div>

            {/* NOTES: */}
            <div style={{ padding: "20px 30px", display: "flex" }}>
                <p className='draggble-model-short-note'>
                    <strong>Note:</strong> Selected values will be prefilled in the form, for the visible as well as hidden fields.
                </p>
            </div>
            {/* Submit & Cancel Button */}
            <div style={{ gap: "20px", paddingBottom: "12px", paddingTop: "20px" }} className='add-new-installation-common-style-btn-input'>
                <PrimaryButton className='add-new-installation-submit-btn' onClick={onDefaultSubmit}>Save</PrimaryButton>
                <DefaultButton style={{ background: "#fff", color: "#333", border: "1px solid gray" }} className='add-new-installation-submit-btn' onClick={() => setOpenModel(false)}>Cancel</DefaultButton>
            </div>
        </React.Fragment>
    )
}

export default DefaultFields