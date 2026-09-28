import SiteLocationsUpdateLayout from "../update/site-locations-update.layout.jsx";
import SiteLocationsDestroyLayout from "../destroy/site-locations-destroy.layout.jsx";

import FilterTextComponent from "../../../components/filters/filter-text/filter-text.component.jsx";

import {Button} from "../../../components/ui/button.jsx";
import {useAuthContext} from "../../../context/auth/auth.context.jsx";

export const SiteLocationsColumnsLayout = () => {
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
            name: 'Location',
            accessorKey: "location_name",
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
                return <div className="text-left px-2">{row.getValue("location_name")}</div>
            }
        }, {
            name: 'Block',
            accessorKey: "block",
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
                return <div className="text-left px-2">{row.getValue("block")}</div>
            }
        }, {
            name: 'Element',
            accessorKey: "element",
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
                return <div className="text-left px-2">{row.getValue("element")}</div>
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
                const siteId = item.site_id;

                return (
                    <div className="flex justify-center items-center gap-1">
                        {
                            permissions.includes("update site locations") &&
                            <SiteLocationsUpdateLayout siteLocation={item} siteId={siteId}/>
                        }

                        {
                            (permissions.includes("delete site locations")) &&
                            <SiteLocationsDestroyLayout siteLocation={item}/>
                        }
                    </div>
                )
            },
        },
    ]
};
