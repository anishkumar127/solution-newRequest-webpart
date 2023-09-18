import React, { useEffect, useState } from 'react'
import styles from "./KanbanView.module.scss";
import homeStyles from '../Homepage.module.scss'
import { ActionButton, FontIcon, IIconProps, ISearchBoxStyles, Label, Link, mergeStyles, mergeStyleSets, Persona, PersonaPresence, PersonaSize, SearchBox } from "@fluentui/react";
import { strings as Language } from "../../loc/Strings";
import { useBoolean } from "@fluentui/react-hooks";
import { useStore } from '../../store/store';
import moment from 'moment'
import parse from 'html-react-parser'
import ContextService from '../../loc/Services/ContextService';

const MyTickets = () => {
    const themeColor = useStore((state) => state.ThemesColor);
    const getMyTicketsData = useStore((state) => state.getMyTicketsData());
    const [itemData, setItemData] = useState([]);
    const [FilterTicketsArray, setFilterTicketsArray] = React.useState([]);
    const fetchMyTickets = useStore((state) => state.fetchMyTicketsData);

    const getSettingsCollection = useStore((state) => state.getSettingsCollection());

    const [syncButton, setSyncButton] = useState(false);
    useEffect(() => {
        console.log("fetched", getMyTicketsData);
        setItemData(getMyTicketsData);
        setFilterTicketsArray(getMyTicketsData);
    }, [getMyTicketsData]);
    const AssignIcon = mergeStyles({
        fontSize: '18px',
        width: '27px',
        margin: '6px 6px -2px 7px',
    });

    const MBsearchBoxStyles: ISearchBoxStyles = {
        root: {
            width: '100%',
            selectors: {
                "&:hover": {
                    borderColor: "rgb(96, 94, 92)",
                }
            }
        },
        icon:
            { color: themeColor == 'light' ? 'var(--lightdarkColor) !important' : 'var(--lightdarkBGGray) !important', }

    };
    const syncIcon: IIconProps = {
        iconName: "Sync",
        className: (syncButton) ? styles.rotationclass : null
    };
    const SyncButtonHandle = async () => {

        setSyncButton(true);
        await fetchMyTickets();

        setTimeout(() => {
            setSyncButton(false);
        }, 2000)
    }
    const AttachFontclass = mergeStyleSets({
        AttachAddColor: [{
            backgroundColor: 'var(--lightdarkBGGray) !important',
            color: themeColor == 'light' ? 'var(--lightdarkColor) !important' : '#fff !important',
        }],
        AttachColor: [{
            color: themeColor == 'light' ? 'var(--lightdarkColor) !important' : 'var(--lightdarkBG) !important',
            // color: lightdarkmode == 'light' ? 'var(--lightdarkColor) !important' : '#fff !important'
        }],
        UnassignedTab: [{
            backgroundColor: "var(--lightdarkBGTable)",
            color: themeColor == 'light' ? 'var(--lightdarkColor) !important' : 'var(--lightdarkBG) !important',
        }],
        color: [{
            color: themeColor == 'light' ? 'var(--lightdarkColor) !important' : 'var(--lightdarkBG) !important',
        }],
    });
    const MBTabSearch = (
        ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        text: string
    ): void => {
        setItemData(
            text ? (itemData?.filter(i =>
                i.Title?.toString().trim().toLowerCase().indexOf(text.toLowerCase()) > -1 ||
                i.TicketSeqnumber?.toString().trim().toLowerCase().indexOf(text.toLowerCase()) > -1 ||
                i.AssignedTo?.Title?.toString().trim().toLowerCase().indexOf(text.toLowerCase()) > -1 ||
                i.Status?.toString().trim().toLowerCase().indexOf(text.toLowerCase()) > -1 ||
                i.Priority?.toString().trim().toLowerCase().indexOf(text.toLowerCase()) > -1 ||
                i?.DepartmentName?.toString().trim().toLowerCase().indexOf(text.toLowerCase()) > -1
            ))
                : FilterTicketsArray
        );

    };
    return (
        <div>
            <div className={homeStyles.SearchBoxinTab}>
                <SearchBox styles={MBsearchBoxStyles}
                    onChange={MBTabSearch}
                    placeholder={Language.Search ? Language.Search : "Search"} />
                <ActionButton
                    iconProps={syncIcon}
                    title={"Sync"}
                    onClick={SyncButtonHandle}
                    //   disabled={refershdisable}
                    styles={{ icon: { color: themeColor == 'light' ? 'var(--lightdarkColor) !important' : 'var(--lightdarkBGGray) !important', } }}
                />
            </div>
            {/* devide */}
            <div className='divider-status-based'>
                <div>

                    {
                        itemData && itemData.length > 0 && itemData?.map((item: any, idx) => {
                            // console.log("item",item);
                            return (
                                item?.Status !== 'Closed' && item?.Status !== "Resolved" ? <div key={idx} className={styles.dropzones}>
                                    <div className={styles.Cardsview}>
                                        <div className={styles.CardContent}>
                                            <div className={styles.textboxcard}>
                                                <div className={styles.ticketalign}>
                                                    <span className={styles.displayid}> <a className={styles.formlink}>
                                                        <Link className={styles.linkstyle}
                                                        // onClick={() => editTicket8(item.ID)}
                                                        >
                                                            {item?.TicketSeqnumber}</Link></a></span>
                                                    {item?.Status == 'Unassigned' ?
                                                        <span className={styles.statuscode}>{item?.Status}</span>
                                                        : item?.Status == 'Closed' ?
                                                            <span className={styles.statuscode3}>{item?.Status}</span>
                                                            : item?.Status == 'Resolved' ?
                                                                <span className={styles.statuscode4}>{item?.Status}</span> :

                                                                <span className={styles.statuscode2}>{item?.Status}</span>
                                                    }

                                                    <span className={styles.ticketdate}>{moment(item?.Created).format(getSettingsCollection?.Dateformat)}</span>
                                                </div>
                                            </div>
                                            <div className={styles.TitleforTicket}>
                                                <span className="tickettitle">
                                                    <div className={styles.tooltip}>
                                                        <a className={styles.formlink}>
                                                            <Link
                                                            // onClick={() => editTicket8(item.ID)}
                                                            >{item?.Title} </Link></a>
                                                    </div>
                                                </span>
                                            </div>
                                            {/* check */}
                                            <span className={styles.Ticketdescription}>{themeColor == 'dark' ? (item?.TicketDescription).replace(/<[^>]*>/g, '') : parse(item?.TicketDescription ? item?.TicketDescription : '')}
                                            </span>
                                            {/* <span className={styles.TeamCode}>{item?.DepartmentName}</span> */}
                                            <div className={styles.dateimage}>
                                                <div className={styles.downalignment}>
                                                    <div className={styles.UserIcon}>
                                                        {/* <span className={styles.imageicon} title={`${Language.CreatedBy ? Language.CreatedBy : "Created by "} + ${item.Requester.Title}`}>
                                <span className={styles.UserLetter}>
                                    {item.Requester.Title}</span>
                            </span> */}

                                                        <Persona
                                                            imageUrl={`${ContextService.GetUrl()}/_layouts/15/userphoto.aspx?accountname=${item?.RequesterEmail}&size=M`}
                                                            size={PersonaSize.size48}
                                                            presence={PersonaPresence.none} />
                                                        <span  style={{marginLeft:"-16px"}}> <Link style={{ fontSize: "14px" }}> {item?.Requester?.Title}</Link></span>
                                                    </div>
                                                    <span className={styles.TeamCode}>
                                                        {/* {item?.DepartmentName} */}
                                                        {
                                                           item && item?.TicketProperties   ? JSON.parse(item?.TicketProperties)[0]?.DepartmentCode : null
                                                        }
                                                    </span>
                                                </div>
                                                <div className={styles.threedotsAdd}>
                                                    <div className={styles.dropdownadd}>
                                                        {item?.Status == 'Unassigned' ?
                                                            <span className={styles.imageicon} title={Language.Assign ? Language.Assign : "Assign"}
                                                            // onClick={() => { showDialogD(), setidtoUpdate(item) }}
                                                            >
                                                                <FontIcon iconName="AddFriend" className={AssignIcon} />
                                                            </span>
                                                            :
                                                            <>
                                                                <Persona
                                                                    imageUrl={`${ContextService.GetUrl()}/_layouts/15/userphoto.aspx?accountname=${item?.AssignedTomail}&size=M`}
                                                                    size={PersonaSize.size48}
                                                                    presence={PersonaPresence.none} />
                                                                {/* <span title={`${Language.CreatedBy ? Language.CreatedBy : "Created by "} + ${item.AssignedTo.Title}`} className={styles.UserLetter2}>{item.AssignedTo.Title}
    
                                </span> */}
                                                            </>
                                                        }

                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                </div> : null
                            )
                        }
                        )
                    }
                </div>
                <div  >

                    {
                        itemData && itemData.length > 0 && itemData?.map((item: any, idx) => {
                            // console.log("item",item);
                            return (
                                item?.Status === 'Closed' || item?.Status === "Resolved" ? <div key={idx} className={styles.dropzones}>
                                    <div className={styles.Cardsview}>
                                        <div className={styles.CardContent}>
                                            <div className={styles.textboxcard}>
                                                <div className={styles.ticketalign}>
                                                    <span className={styles.displayid}> <a className={styles.formlink}>
                                                        <Link className={styles.linkstyle}
                                                        // onClick={() => editTicket8(item.ID)}
                                                        >
                                                            {item?.TicketSeqnumber}</Link></a></span>
                                                    {item?.Status == 'Unassigned' ?
                                                        <span className={styles.statuscode}>{item?.Status}</span>
                                                        : item?.Status == 'Closed' ?
                                                            <span className={styles.statuscode3}>{item?.Status}</span>
                                                            : item?.Status == 'Resolved' ?
                                                                <span className={styles.statuscode4}>{item?.Status}</span> :

                                                                <span className={styles.statuscode2}>{item?.Status}</span>
                                                    }

                                                    <span className={styles.ticketdate}>{moment(item?.Created).format(getSettingsCollection?.Dateformat)}</span>
                                                </div>
                                            </div>
                                            <div className={styles.TitleforTicket}>
                                                <span className="tickettitle">
                                                    <div className={styles.tooltip}>
                                                        <a className={styles.formlink}>
                                                            <Link
                                                            // onClick={() => editTicket8(item.ID)}
                                                            >{item?.Title} </Link></a>
                                                    </div>
                                                </span>
                                            </div>
                                            {/* check */}
                                            <span className={styles.Ticketdescription}>{themeColor == 'dark' ? (item?.TicketDescription).replace(/<[^>]*>/g, '') : parse(item?.TicketDescription ? item?.TicketDescription : '')}
                                            </span>
                                            {/* <span className={styles.TeamCode}>{item?.DepartmentName}</span> */}
                                            <div className={styles.dateimage}>
                                                <div className={styles.downalignment}>
                                                    <div className={styles.UserIcon}>
                                                        {/* <span className={styles.imageicon} title={`${Language.CreatedBy ? Language.CreatedBy : "Created by "} + ${item.Requester.Title}`}>
                                <span className={styles.UserLetter}>
                                    {item.Requester.Title}</span>
                            </span> */}

                                                        <Persona
                                                            imageUrl={`${ContextService.GetUrl()}/_layouts/15/userphoto.aspx?accountname=${item?.RequesterEmail}&size=M`}
                                                            size={PersonaSize.size48}
                                                            presence={PersonaPresence.none} />
                                                        <span style={{marginLeft:"-16px"}}> <Link style={{ fontSize: "14px" }}> {item?.Requester?.Title}</Link></span>
                                                    </div>
                                                    <span className={styles.TeamCode}>
                                                        {/* {item?.DepartmentName} */}
                                                        {
                                                           item && item?.TicketProperties   ? JSON.parse(item?.TicketProperties)[0]?.DepartmentCode : null
                                                        }
                                                    </span>
                                                </div>
                                                <div className={styles.threedotsAdd}>
                                                    <div className={styles.dropdownadd}>
                                                        {item?.Status == 'Unassigned' ?
                                                            <span className={styles.imageicon} title={Language.Assign ? Language.Assign : "Assign"}
                                                            // onClick={() => { showDialogD(), setidtoUpdate(item) }}
                                                            >
                                                                <FontIcon iconName="AddFriend" className={AssignIcon} />
                                                            </span>
                                                            :
                                                            <>
                                                                <Persona
                                                                    imageUrl={`${ContextService.GetUrl()}/_layouts/15/userphoto.aspx?accountname=${item?.AssignedTomail}&size=M`}
                                                                    size={PersonaSize.size48}
                                                                    presence={PersonaPresence.none} />
                                                                {/* <span title={`${Language.CreatedBy ? Language.CreatedBy : "Created by "} + ${item.AssignedTo.Title}`} className={styles.UserLetter2}>{item.AssignedTo.Title}
    
                                </span> */}
                                                            </>
                                                        }

                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                </div> : null
                            )
                        }
                        )
                    }
                </div>
            </div>


        </div>
    )
}

export default MyTickets