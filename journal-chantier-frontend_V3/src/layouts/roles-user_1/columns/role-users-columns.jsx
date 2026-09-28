import { Button } from "../../../components/ui/button.jsx";
import { useAuthContext } from "../../../context/auth/auth.context.jsx";
import RolesUpdateLayout from "../update/role-users-update.layout.jsx";
import FilterTextComponent from "../../../components/filters/filter-text/filter-text.component.jsx";

export const RolesColumnsLayout = () => {
    const { user } = useAuthContext();
    const permissions = user?.permissions || [];

    return [
        {
            accessorFn: (row) => row.name ?? "",
            id: "name",
            header: ({ column }) => (
                <div className="flex justify-start items-start min-w-[190px]">
                    <Button
                        variant="ghost2"
                        className="justify-center font-bold hover:text-gray-100 px-0 w-full"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Nom
                    </Button>
                </div>
            ),
            filterFn: "includesString",
            Filter: ({ column }) => <FilterTextComponent column={column} />,
            cell: ({ getValue }) => (
                <div className="text-left px-2">{getValue()}</div>
            ),
        },
        {
            accessorKey: "abbreviation",
            header: () => (
                <div className="text-left font-bold min-w-[150px]">Abréviation</div>
            ),
            cell: ({ row }) => {
                const role = row.original;
                return <div className="text-left px-2">{role.abbreviation ?? ""}</div>;
            },
        },


        {
            id: "actions",
            header: () => (
                <div className="flex justify-center items-center font-bold min-w-[100px]">
                    Actions
                </div>
            ),
            cell: ({ row }) => {
                const role = row.original;

                return (
                    <div className="flex justify-center items-center gap-1">
                        {permissions.includes("update roles") && (
                            <RolesUpdateLayout role={role} />
                        )}
                    </div>
                );
            },
        },
    ];
};
