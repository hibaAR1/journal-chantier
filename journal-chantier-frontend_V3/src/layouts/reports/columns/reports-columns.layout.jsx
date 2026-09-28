import {Button} from "../../../components/ui/button.jsx";

import {useAuthContext} from "../../../context/auth/auth.context.jsx";
import FilterTextComponent from "../../../components/filters/filter-text/filter-text.component.jsx";

import ReportsUpdateLayout from "../update/reports-update.layout.jsx";
import ReportsObservationLayout from "../observation/reports-observation.layout.jsx";
import ReportsDestroyLayout from "../destroy/reports-destroy.layout.jsx";
import ReportsDownloadLayout from "../download/reports-download.layout.jsx";

import {dateRangeFilterFn} from "../../../utilities/filters.js";
import FilterDateComponent from "../../../components/filters/filter-date/filter-date.component.jsx";
import {format} from "date-fns";

import {PiClockClockwise, PiInfoLight, PiSecurityCamera} from "react-icons/pi";
import LinkIconBtnComponent from "../../../components/link-icon-btn/link-icon-btn.component.jsx";
import {IoConstructOutline} from "react-icons/io5";
import ReportsValidateLayout from "../validate/reports-Validate.Layout.jsx";
import ReportsInvalidateLayout from "../invalidate/reports-invalidate.layout.jsx";
import {useReportsContext} from "../../../context/reports/reports.context.jsx";

export const ReportsColumnsLayout = () => {
    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    return [
        {
            id: "index",
            header: () => {
                return (
                    <div className="flex justify-center items-center min-w-[60px] font-bold">
                        #
                    </div>
                )
            },
            cell: ({row}) => {
                return (
                    <div className="text-center">
                        {row.index + 1}
                    </div>
                )
            }
        },
        {
            name: 'Code',
            accessorKey: "code",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[125px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Code
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("code")}</div>
            }
        }, {
            name: 'Sites',
            accessorKey: "site_name",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[200px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Chantier
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("site_name")}</div>
            }
        }, {
            name: 'Date',
            accessorKey:
                "date",
            header:
                ({column}) => {
                    return (
                        <div className="flex justify-start items-start min-w-[190px]">
                            <Button
                                variant="ghost2"
                                className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            >
                                Date
                            </Button>
                        </div>
                    )
                },
            filterFn:
            dateRangeFilterFn,
            Filter:
                ({column}) => <FilterDateComponent column={column}/>,
            cell:
                ({row}) => {
                    return <div className="text-center">{format(row.getValue('date'), "dd-MM-yyyy")}</div>
                }
        }, {
            id: "observations",
            name: "Observations",
            header: () => {
                return (
                    <div className="flex justify-center items-center font-bold hover:text-gray-100 px-0 min-w-[110px]">
                        Observations
                    </div>
                )
            },
            cell: ({row}) => {
                const item = row.original;

                return (
                    <div className="flex justify-center items-center gap-1">
                        {
                            item.problems
                                ?
                                <ReportsObservationLayout
                                    title='Observation Problèmes'
                                    value={item.problems}
                                >
                                    <PiInfoLight/>
                                </ReportsObservationLayout>
                                : ""
                        }
                        {
                            item.delays
                                ?
                                <ReportsObservationLayout
                                    title='Observation Retards'
                                    value={item.delays}
                                >
                                    <PiClockClockwise/>
                                </ReportsObservationLayout>
                                : ""
                        }
                        {
                            item.security
                                ?
                                <ReportsObservationLayout
                                    title='Observation Sécurité'
                                    value={item.security}
                                >
                                    <PiSecurityCamera/>
                                </ReportsObservationLayout>
                                : ""
                        }
                    </div>
                )
            },
        }, {
            id: "data_entry",
            name: "Data Entry",
            header: () => {
                return (
                    <div className="flex justify-center items-center font-bold hover:text-gray-100 px-0 min-w-[110px]">
                        Saisie
                    </div>
                )
            },
            cell: ({row}) => {
                const item = row.original;

                if (!item || !item.id) return null;

                return (
                    <div className="flex justify-center items-center gap-1">
                        {
                            permissions.includes("view report work types") &&
                            <LinkIconBtnComponent
                                link={`/report-work-types/${item.id}`}
                                text_color={"#fff"}
                                bg_color={"#C94D25"}
                            >
                                <IoConstructOutline/>
                            </LinkIconBtnComponent>
                        }
                    </div>
                )
            },
        }, {
            id: "actions",
            name: "Actions",
            header: () => {
                return (
                    <div className="flex justify-center items-center font-bold hover:text-gray-100 px-0 min-w-[80px]">
                        Actions
                    </div>
                )
            },
            cell: ({row}) => {
                const item = row.original;
                if (!item || typeof item.id === "undefined") return null;

                //const isValidated = item?.validated ?? false;
                const isValidated = Number(item?.validated) === 1;


                return (
                    <div className="flex justify-center items-center gap-1">
                        {
                            permissions.includes("update reports") && !isValidated &&
                            <ReportsUpdateLayout report={item}/>
                        }

                        {
                            (permissions.includes("delete reports")) && !isValidated &&
                            <ReportsDestroyLayout report={item}/>
                        }
                        {
                            (permissions.includes("Validate reports") && !isValidated) &&
                            <ReportsValidateLayout report={item}/>
                        }
                        {
                            (permissions.includes("invalidate reports") && item.validated) ?
                            <ReportsInvalidateLayout report={item}/>:''
                        }
                        {
                            <ReportsDownloadLayout reportId={item.id} />
                        }

                    </div>
                )
            },
        },
    ]
};
