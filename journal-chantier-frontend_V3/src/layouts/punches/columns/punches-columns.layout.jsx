import {Button} from "../../../components/ui/button.jsx";

import {useAuthContext} from "../../../context/auth/auth.context.jsx";
import FilterTextComponent from "../../../components/filters/filter-text/filter-text.component.jsx";

import PunchesUpdateLayout from "../update/punches-update.layout.jsx";
import PunchesDestroyLayout from "../destroy/punches-destroy.layout.jsx";
import PunchesValidateLayout from "../validate/punches-Validate.Layout.jsx";
import {dateRangeFilterFn, selectIncludesFilterFn} from "../../../utilities/filters.js";
import FilterSelectComponent from "../../../components/filters/filter-select/filter-select.component.jsx";
import FilterDateComponent from "../../../components/filters/filter-date/filter-date.component.jsx";
import {format} from "date-fns";
import LinkIconBtnComponent from "../../../components/link-icon-btn/link-icon-btn.component.jsx";
import {GrUserSettings} from "react-icons/gr";
import {FaList} from "react-icons/fa6";
import PunchesInvalidateLayout from "../invalidate/punches-invalidate.layout.jsx";
import FilterNumberComponent from "../../../components/filters/filter-number/filter-number.component.jsx";

export const PunchesColumnsLayout = () => {
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
            cell: ({ row }) => {
                const date = row.getValue('date');
                if (!date) return <div className="text-center text-muted">-</div>;

                return <div className="text-center">{format(new Date(date), "dd-MM-yyyy")}</div>;
            }
        },{
            id: "worker_count",
            name: "Nb Ouvriers",
            accessorKey: "punch_workers_count",   // 🔥 IMPORTANT 🔥

            header: ({ column }) => (
                <div className="flex justify-start items-start min-w-[150px]">
                    <Button
                        variant="ghost2"
                        className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nb Ouvriers
                    </Button>
                </div>
            ),


            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({ row }) => {
                const count = row.original?.punch_workers_count || 0;
                return <div className="text-center">{count}</div>;
            }
        },
        {
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
                            permissions.includes("view punches") &&
                            <LinkIconBtnComponent
                                link={`/punch-workers/${item.id}`}
                                text_color={"#fff"}
                                bg_color={"#C94D25"}
                            >
                                <FaList />
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
                const item = row?.original;
                if (!item || typeof item.id === "undefined") return null;

                const isValidated = item?.validated ?? false;

                return (
                    <div className="flex justify-center items-center gap-1">
                        {
                            permissions.includes("update punches") && !isValidated &&
                                <PunchesUpdateLayout punch={item}/>
                        }

                        {
                            permissions.includes("delete punches") && !isValidated &&
                                <PunchesDestroyLayout punch={item}/>
                        }
                        {
                            permissions.includes("validate punches") && !isValidated &&
                            <PunchesValidateLayout punch={item}/>
                        }
                        {
                            permissions.includes("invalidate punches") && item.validated &&
                            <PunchesInvalidateLayout punch={item}/>
                        }
                    </div>
                )
            },
        },
    ]
};
