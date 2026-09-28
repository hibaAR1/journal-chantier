import {Button} from "../../../components/ui/button.jsx";

import FilterTextComponent from "../../../components/filters/filter-text/filter-text.component.jsx";

import SiteWorksUpdateLayout from "../update/site-works-update.layout.jsx";
import SiteWorksDestroyLayout from "../destroy/site-works-destroy.layout.jsx";

import {useAuthContext} from "../../../context/auth/auth.context.jsx";

export const SiteWorksColumnsLayout = (siteId) => {
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
        // {
        //     accessorKey: "unit",
        //     header: ({column}) => {
        //         return (
        //             <div className="flex justify-start items-start min-w-[190px]">
        //                 <Button
        //                     variant="ghost2"
        //                     className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
        //                     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        //                 >
        //                     Unité
        //                 </Button>
        //             </div>
        //         )
        //     },
        //     filterFn: 'includesString',
        //     Filter: ({column}) => <FilterTextComponent column={column}/>,
        //     cell: ({row}) => {
        //         return <div className="text-left px-2">{row.getValue("unit")}</div>
        //     }
        // },
        {
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
                            permissions.includes("update works") &&
                            <SiteWorksUpdateLayout work={item} siteId={siteId}/>
                        }

                        {
                            (permissions.includes("delete works")) &&
                            <SiteWorksDestroyLayout work={item}/>
                        }
                    </div>
                )
            },
        },
    ]
};
