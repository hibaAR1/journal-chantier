import ReportWorkTypesObservationLayout from "../observation/report-work-types-observation.layout.jsx";
import ReportWorkTypesUpdateLayout from "../update/report-work-types-update.layout.jsx";
import ReportWorkTypesDestroyLayout from "../destroy/report-work-types-destroy.layout.jsx";

import FilterTextComponent from "../../../components/filters/filter-text/filter-text.component.jsx";
import FilterNumberComponent from "../../../components/filters/filter-number/filter-number.component.jsx";

import {numberRangeFilterFn} from "../../../utilities/filters.js";

import {formatNumber} from "../../../utilities/format.js";

import {Button} from "../../../components/ui/button.jsx";

import {PiInfoLight} from "react-icons/pi";
import LinkIconBtnComponent from "../../../components/link-icon-btn/link-icon-btn.component.jsx";
import {GrUserSettings} from "react-icons/gr";
import {useAuthContext} from "../../../context/auth/auth.context.jsx";

export const ReportWorkTypesColumnsLayout = () => {
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
            name: 'Work',
            accessorKey: "work_name",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[150px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Travail
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("work_name")}</div>
            }
        }, {
            name: 'Work Type',
            accessorKey: "work_type_name",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[150px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Tâche
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("work_type_name")}</div>
            }
        }, {
            name: 'Block',
            accessorKey: "site_location_block",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[150px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Bloc
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("site_location_block")}</div>
            }
        }, {
            name: 'Location',
            accessorKey: "site_location_name",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[150px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Emplacement
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("site_location_name")}</div>
            }
        }, {
            name: 'Element',
            accessorKey: "site_location_element",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[150px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Element
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("site_location_element")}</div>
            }
        }, {
            name: 'Stat Work',
            accessorKey:
                "stat_work",
            header:
                ({column}) => {
                    return (
                        <div className="flex justify-start items-start min-w-[150px]">
                            <Button
                                variant="ghost2"
                                className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            >
                                Etat du travail %
                            </Button>
                        </div>
                    )
                },
            filterFn:
            numberRangeFilterFn,
            Filter:
                ({column}) => <FilterNumberComponent column={column}/>,
            cell:
                ({row}) => {

                    return <div className="text-center">{`${row.original.stat_work}`}%</div>
                }
        }, {
            name: 'Quantity Completed',
            accessorKey:
                "quantity_completed",
            header:
                ({column}) => {
                    return (
                        <div className="flex justify-start items-start min-w-[150px]">
                            <Button
                                variant="ghost2"
                                className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            >
                                Quantité Réalisée
                            </Button>
                        </div>
                    )
                },
            filterFn:
            numberRangeFilterFn,
            Filter:
                ({column}) => <FilterNumberComponent column={column}/>,
            cell:
                ({row}) => {
                    const {quantity_completed, unit} = row.original;

                    return <div className="text-center">{`${formatNumber(quantity_completed)} ${unit}`}</div>
                }
        }, {
            name: 'Unit Time',
            accessorKey:
                "unit_time",
            header:
                ({column}) => {
                    return (
                        <div className="flex justify-start items-start min-w-[150px]">
                            <Button
                                variant="ghost2"
                                className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            >
                                Temps Unitaire
                            </Button>
                        </div>
                    )
                },
            filterFn:
            numberRangeFilterFn,
            Filter: ({column}) => <FilterNumberComponent column={column}/>,
            cell: ({row}) => {
                const { unit_time, unit, t_u } = row.original;

                // Par défaut : couleur neutre
                let colorClass = "text-gray-900";

                if (t_u !== null && t_u !== undefined) {
                    if (unit_time < t_u) {
                        // meilleur que la référence
                        colorClass = "text-emerald-600 font-semibold";
                    } else if (unit_time > t_u) {
                        // moins bon que la référence
                        colorClass = "text-red-600 font-semibold";
                    }
                }

                return (
                    <div className={`text-center ${colorClass}`}>
                        {`${formatNumber(unit_time)} h/${unit}`}
                    </div>
                );
            }
        } ,{
            name: 'T.U. réf.',
            accessorKey: "t_u",
            header: () => (
                <div className="flex justify-start items-start min-w-[140px]">
                    <Button
                        variant="ghost2"
                        className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                    >
                        Temps Unitaire réf.
                    </Button>
                </div>
            ),
            filterFn:
            numberRangeFilterFn,
            Filter: ({column}) => <FilterNumberComponent column={column}/>,
            cell: ({row}) => {
                const { t_u, unit } = row.original;

                if (t_u === null || t_u === undefined) {
                    return <div className="text-center">-</div>;
                }

                return (
                    <div className="text-center">{`${formatNumber(t_u)} h/${unit}`}</div>
                );
            },
        },{
            name: 'Performance',
            accessorKey:
                "performance",
            header:
                ({column}) => {
                    return (
                        <div className="flex justify-start items-start min-w-[150px]">
                            <Button
                                variant="ghost2"
                                className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            >
                                Rendement
                            </Button>
                        </div>
                    )
                },
            filterFn:
            numberRangeFilterFn,
            Filter:
                ({column}) => <FilterNumberComponent column={column}/>,
            cell:
                ({row}) => {
                    const {performance, unit} = row.original;

                    return <div className="text-center">{`${formatNumber(performance)} ${unit}/h`}</div>
                }
        }, {
            name: 'Total Workers',
            accessorKey:
                "total_workers",
            header:
                ({column}) => {
                    return (
                        <div className="flex justify-start items-start min-w-[150px]">
                            <Button
                                variant="ghost2"
                                className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            >
                                Nombre ouvriers
                            </Button>
                        </div>
                    )
                },
            filterFn:
            numberRangeFilterFn,
            Filter:
                ({column}) => <FilterNumberComponent column={column}/>,
            cell:
                ({row}) => {
                    const {total_workers} = row.original;

                    return <div className="text-center">{`${total_workers}`}</div>
                }
        }, {
            name: 'Total Normal Hours',
            accessorKey:
                "total_normal_hours",
            header:
                ({column}) => {
                    return (
                        <div className="flex justify-start items-start min-w-[150px]">
                            <Button
                                variant="ghost2"
                                className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            >
                                Nombre H.N
                            </Button>
                        </div>
                    )
                },
            filterFn:
            numberRangeFilterFn,
            Filter:
                ({column}) => <FilterNumberComponent column={column}/>,
            cell:
                ({row}) => {
                    const {total_normal_hours} = row.original;

                    return <div className="text-center">{`${total_normal_hours}`}</div>
                }
        }, {
            name: 'Total Overtime Hours',
            accessorKey:
                "total_overtime_hours",
            header:
                ({column}) => {
                    return (
                        <div className="flex justify-start items-start min-w-[150px]">
                            <Button
                                variant="ghost2"
                                className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            >
                                Nombre H.S
                            </Button>
                        </div>
                    )
                },
            filterFn:
            numberRangeFilterFn,
            Filter:
                ({column}) => <FilterNumberComponent column={column}/>,
            cell:
                ({row}) => {
                    const {total_overtime_hours} = row.original;

                    return <div className="text-center">{`${total_overtime_hours}`}</div>
                }
        },
        {
            name: 'Daily Worker Performance',
            accessorKey: "daily_worker_performance",
            header: ({column}) => (
                <div className="flex justify-start items-start min-w-[200px]">
                    <Button
                        variant="ghost2"
                        className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Rendement journalier / Ouvrier
                    </Button>
                </div>
            ),
            filterFn: numberRangeFilterFn,
            Filter: ({column}) => <FilterNumberComponent column={column} />,
            cell: ({row}) => {
                const {daily_worker_performance, unit} = row.original;
                return (
                    <div className="text-center">
                        {`${formatNumber(daily_worker_performance)} ${unit}/ouv/jour`}
                    </div>
                );
            }
        },
        {
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
                            item.observations
                                ?
                                <ReportWorkTypesObservationLayout
                                    title='Observation'
                                    value={item.observations}
                                >
                                    <PiInfoLight/>
                                </ReportWorkTypesObservationLayout>
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

                return (
                    <div className="flex justify-center items-center gap-1">
                        {
                            permissions.includes("view report work type workers") &&
                            <LinkIconBtnComponent
                                link={`/report-work-type-workers/${item.id}`}
                                text_color={"#fff"}
                                bg_color={"#C94D25"}
                            >
                                <GrUserSettings/>
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
                const reportId = item.report_id;

                const isValidate = item?.report_validated ?? false;

                return (
                    <div className="flex justify-center items-center gap-1">
                        {
                            permissions.includes("update report work types") && !isValidate &&
                            <ReportWorkTypesUpdateLayout reportWorkType={item} reportId={reportId}/>
                        }

                        {
                            (permissions.includes("delete report work types")) && !isValidate &&
                            <ReportWorkTypesDestroyLayout reportWorkType={item}/>
                        }
                    </div>
                )
            },
        },
    ]
};
