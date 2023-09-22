import React from 'react';
import { Checkbox, Icon } from '@fluentui/react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

const SelectionFields = (props) => {
    const { onChangeCheckbox, handleDragEnd, draggedOrderData, checkboxStyle, setOpenModel, onSubmit } = props;
    return (
        <>
            <div className='draggble-container'>
                {/* DRAGGABLE CONTENT */}
                <div className='draggable-one'>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        {/* HI from another side. */}
                        <Droppable droppableId={"ROOT"} type={"group"}>
                            {
                                (provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                        {draggedOrderData && draggedOrderData?.length > 0 && draggedOrderData?.map((item, index) =>
                                            <Draggable draggableId={item?.id + ""} key={item?.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        {...provided.draggableProps}
                                                        ref={provided.innerRef}
                                                        className='draggble-content-root'
                                                    >
                                                        <div>
                                                            <Icon iconName="GripperDotsVertical"></Icon>
                                                        </div>
                                                        <div>
                                                            <Checkbox
                                                                styles={checkboxStyle}
                                                                checked={
                                                                    item?.isChecked
                                                                    // mandatoryFields?.some((items) => items === item?.Name)
                                                                }
                                                                title={item?.Name}
                                                                id={item?.id + ""}
                                                                onChange={onChangeCheckbox}
                                                            />
                                                        </div>
                                                        <div>
                                                            {item?.Name}
                                                        </div>

                                                    </div>
                                                )}
                                            </Draggable>

                                        )}
                                        {provided?.placeholder}
                                    </div>
                                )
                            }
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>

            {/* NOTES: */}
            <div style={{ padding: "10px 20px", display: "flex" }}>
                <p className='draggble-model-short-note'>
                    {/* You can select upto 5 fields, for remaining fields you can select default values to be sent. */}
                    <strong>Note:</strong> With limited space in a single column, it is recommended to have a maximum of 5 columns. If there are more fields, please select the default values so that a ticket can be created with the default values. Alternatively, you can utilize the double-column option of the web part, which allows for the display of more fields in two columns.
                    </p>
            </div>

            {/* Submit & Cancel Button */}
            <div style={{ gap: "20px", paddingBottom: "12px" }} className='add-new-installation-common-style-btn-input'>
                <button className='add-new-installation-submit-btn' onClick={onSubmit}>Save</button>
                <button style={{ background: "#fff", color: "#333", border: "1px solid gray" }} className='add-new-installation-submit-btn' onClick={() => setOpenModel(false)}>Cancel</button>
            </div>
        </>
    )
}

export default SelectionFields