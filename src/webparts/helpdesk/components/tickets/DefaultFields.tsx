import { Dropdown } from '@fluentui/react'
import React from 'react'


const DefaultFields = (props) => {
    const { propsData, onDefaultSubmit, setOpenModel } = props;
    return (
        <>
            <div className='draggble-container'>

                {/* DEFAULT CONTNET */}
                <div title='Select default choices' className='draggable-two draggable-default-content'>
                    <Dropdown
                        label={"Teams"}
                        options={propsData?.teamsoptionarray}
                        onChange={propsData?.handleTeamsOnChange}
                        placeholder="Select teams"
                        selectedKey={propsData?.defltTeam}
                    />
                    {/* Service ui */}
                    <Dropdown
                        label={"Service"}

                        options={propsData?.serviceOption}
                        onChange={propsData?.handleServiceOnChange}
                        placeholder="Select services"
                        selectedKey={propsData?.defltService}
                    />
                    {/* Sub Service ui */}
                    <Dropdown
                        label={"Sub Service"}

                        options={propsData?.subserviceOption}
                        onChange={propsData?.handleSubServiceOnChange}
                        placeholder="Select sub services"
                        selectedKey={propsData?.defltSubService}
                    />
                    {/* Priority */}
                    <Dropdown
                        label={"Priority"}

                        options={propsData?.priorityoptions}
                        onChange={propsData?.handlePriorityOnChange}
                        placeholder="Select priority"
                        // defaultSelectedKey={propsData?.defltPriority}
                        selectedKey={propsData?.defltPriority}
                    />

                    {/* Request Type */}
                    <Dropdown
                        label={"Request Type"}

                        options={propsData?.requestoptions}
                        onChange={propsData?.handleRequestTypeOnChange}
                        placeholder="Select request type"
                        selectedKey={propsData?.defltReq}
                    />
                </div>
            </div>

            {/* Submit & Cancel Button */}
            <div style={{ gap: "20px", paddingBottom: "12px" }} className='add-new-installation-common-style-btn-input'>
                <button className='add-new-installation-submit-btn' onClick={onDefaultSubmit}>Save</button>
                <button style={{ background: "#fff", color: "#333", border: "1px solid gray" }} className='add-new-installation-submit-btn' onClick={() => setOpenModel(false)}>Cancel</button>
            </div>
        </>
    )
}

export default DefaultFields