import {Button} from "../../../components/ui/button.jsx";

import {useAuthContext} from "../../../context/auth/auth.context.jsx";
import FilterTextComponent from "../../../components/filters/filter-text/filter-text.component.jsx";

import MovementsUpdateLayout from "../update/movements-update.layout.jsx";
import MovementsDestroyLayout from "../destroy/movements-destroy.layout.jsx";

import {dateRangeFilterFn, numberRangeFilterFn, selectIncludesFilterFn} from "../../../utilities/filters.js";
import FilterSelectComponent from "../../../components/filters/filter-select/filter-select.component.jsx";
import FilterDateComponent from "../../../components/filters/filter-date/filter-date.component.jsx";
import {format} from "date-fns";
import FilterNumberComponent from "../../../components/filters/filter-number/filter-number.component.jsx";
import {formatNumber} from "../../../utilities/format.js";

export const MovementsColumnsLayout = () => {
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
            name: 'Products',
            accessorKey: "product_name",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[190px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Article
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("product_name")}</div>
            }
        },  {
            name: 'Suppliers',
            accessorKey: "supplier_value",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[200px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Fournisseur
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("supplier_value")}</div>
            }
        }, {
            name: 'Type',
            accessorKey:
                "type",
            header:
                ({column}) => {
                    return (
                        <div className="flex justify-start items-start min-w-[120px]">
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
            filterFn:
            selectIncludesFilterFn,
            Filter:
                ({column}) => <FilterSelectComponent
                    column={column}
                    placeholder="Rechercher"
                    options={[
                        {value: 1, name: 'Entrée'},
                        {value: 2, name: 'Sortie'},
                        {value: 3, name: 'Transfert'},
                    ]}
                />,
            cell:
                ({row}) => {
                    const type = parseInt(row.getValue('type'));
                    let value = '';

                    switch (type) {
                        case 1:
                            value = 'Entrée';
                            break;
                        case 2:
                            value = 'Sortie';
                            break;
                        case 3:
                            value = 'Transfert';
                            break;
                    }
                    return <div className="text-center">{value}</div>
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
            name: 'Quantity',
            accessorKey:
                "quantity",
            header:
                ({column}) => {
                    return (
                        <div className="flex justify-start items-start min-w-[150px]">
                            <Button
                                variant="ghost2"
                                className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                            >
                                Quantité
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
                    const {product_unit, coefficient, quantity} = row.original;

                    const quantityValue = parseFloat(quantity);

                    return <div className="text-center">{`${formatNumber(quantityValue)} ${product_unit}`}</div>
                }
        }, {
            name: 'Delivery',
            accessorKey: "delivery_num",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[125px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Num BL
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("delivery_num")}</div>
            }
        }, {
            name: 'Receipt',
            accessorKey: "receipt_num",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[125px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Num Réception
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("receipt_num")}</div>
            }
        }, {
            name: 'Exit',
            accessorKey: "exit_num",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[125px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Num Sortie
                        </Button>
                    </div>
                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("exit_num")}</div>
            }
        }, {
            name: 'Transfer',
            accessorKey: "transfer_num",
            header: ({column}) => {
                return (
                    <div className="flex justify-start items-start min-w-[125px]">
                        <Button
                            variant="ghost2"
                            className="justify-center font-bold hover:text-gray-100 px-0 w-[100%]"
                            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                        >
                            Num Transfert
                        </Button>
                    </div>

                )
            },
            filterFn: 'includesString',
            Filter: ({column}) => <FilterTextComponent column={column}/>,
            cell: ({row}) => {
                return <div className="text-left px-2">{row.getValue("transfer_num")}</div>
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

                return (
                    <div className="flex justify-center items-center gap-1">
                        {
                            permissions.includes("update movements") &&
                            <MovementsUpdateLayout movement={item}/>
                        }

                        {
                            (permissions.includes("delete movements")) &&
                            <MovementsDestroyLayout movement={item}/>
                        }
                    </div>
                )
            },
        },
    ]
};
