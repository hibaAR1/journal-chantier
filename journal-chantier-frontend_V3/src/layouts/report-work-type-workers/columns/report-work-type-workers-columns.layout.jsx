import ReportWorkTypeWorkersUpdateLayout from "../update/report-work-types-update.layout.jsx";
import ReportWorkTypeWorkersDestroyLayout from "../destroy/report-work-type-workers-destroy.layout.jsx";

import FilterTextComponent from "../../../components/filters/filter-text/filter-text.component.jsx";
import FilterNumberComponent from "../../../components/filters/filter-number/filter-number.component.jsx";

import {numberRangeFilterFn} from "../../../utilities/filters.js";

import {Button} from "../../../components/ui/button.jsx";
import {useAuthContext} from "../../../context/auth/auth.context.jsx";

export const ReportWorkTypeWorkersColumnsLayout = () => {
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
            name: 'Worker Name',
            accessorKey: "worker_name",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[150px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Ouvrier
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("worker_name")}</div>
            }
        }, {
            name: 'Worker Registration Number',
            accessorKey: "worker_registration_number",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[150px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Matricule
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("worker_registration_number")}</div>
            }
        },{
            name: 'Type',
            accessorKey: "type",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[150px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Type
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                const rawType = row.getValue("type");
                const type = rawType !== null && rawType !== undefined ? parseInt(rawType) : null;

                // si tu veux afficher juste le numéro :
                // return <div className="text-center">{type ?? ""}</div>

                // si tu veux afficher le texte du type :
                let label = "";
                switch (type) {
                    case 1:
                        label = "Service Normal";
                        break;
                    case 2:
                        label = "Travail à la tache";
                        break;
                    case 3:
                        label = "Travail à la tache multiple";
                        break;
                    case 4:
                        label = "Licencié";
                        break;
                    case 5:
                        label = "Absent autorisé";
                        break;
                    case 6:
                        label = "Absent non autorisé";
                        break;
                    case 7:
                        label = "Malade";
                        break;
                    default:
                        label = "";
                }

                return <div className="text-center">{label}</div>;
            }
        }, {
            name: 'Normal Hours',
            accessorKey:
                "normal_hours",
            header:
                ({column}) => {
                    return (
                        <div className="flex justify-start items-start min-w-[150px]">
                            <Button
                                variant="ghost2"
                                className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            >
                                Heures Normales
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

                    return <div className="text-center">{`${row.getValue("normal_hours")}`}</div>
                }
        },  {
            name: 'Overtime Hours',
            accessorKey:
                "overtime_hours",
            header:
                ({column}) => {
                    return (
                        <div className="flex justify-start items-start min-w-[150px]">
                            <Button
                                variant="ghost2"
                                className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            >
                                Heures Supplémentaires
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

                    return <div className="text-center">{`${row.getValue("overtime_hours")}`}</div>
                }
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
                const reportWorkTypeId = item.report_work_type_id;

                const isValidate = item?.report_validated ?? false;

                return (
                    <div className="flex justify-center items-center gap-1">
                        {
                            permissions.includes("update report work type workers") && !isValidate &&
                            <ReportWorkTypeWorkersUpdateLayout reportWorkTypeWorker={item} reportWorkTypeId={reportWorkTypeId}/>
                        }

                        {
                            (permissions.includes("delete report work type workers")) && !isValidate &&
                            <ReportWorkTypeWorkersDestroyLayout reportWorkTypeWorker={item}/>
                        }
                    </div>
                )
            },
        },
    ]
};