import {Button} from "../../../components/ui/button.jsx";

import {useAuthContext} from "../../../context/auth/auth.context.jsx";
import FilterTextComponent from "../../../components/filters/filter-text/filter-text.component.jsx";

import SiteWorkTypesUpdateLayout from "../update/site-work-types-update.layout.jsx";
import SiteWorkTypesDestroyLayout from "../destroy/site-work-types-destroy.layout.jsx";
import FilterNumberComponent from "../../../components/filters/filter-number/filter-number.component.jsx";

export const SiteWorkTypesColumnsLayout = () => {
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
                    <div className="flex justify-start items-start min-w-[190px]">
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
            accessorKey: "name",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[190px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Nom
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("name")}</div>
            }
        },
        {
            accessorKey: "unit",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[100px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Unité
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => (
                <FilterTextComponent column={column} />
            ),
            cell: ({row}) => {
                const unit = row.getValue("unit");

                return (
                    <div className="text-center">
                        {unit ? unit : "-"}
                    </div>
                );
            }
        },
        {
            name: 'Temps unitaire réf.',
            accessorKey: "t_u",
            header: () => (
                <div className="flex justify-start items-start min-w-[150px]">
                    <Button
                        variant="ghost2"
                        className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                    >
                        Temps Unitaire réf.
                    </Button>
                </div>
            ),
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                const value = row.getValue("t_u");
                return (
                    <div className="text-left px-2">
                        {value !== null && value !== undefined ? value : "-"}
                    </div>
                );
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

                return (
                    <div className="flex justify-center items-center gap-1">
                        {
                            permissions.includes("update work types") &&
                            <SiteWorkTypesUpdateLayout workType={item}/>
                        }

                        {
                            (permissions.includes("delete work types")) &&
                            <SiteWorkTypesDestroyLayout workType={item}/>
                        }
                    </div>
                )
            },
        },
    ]
};
