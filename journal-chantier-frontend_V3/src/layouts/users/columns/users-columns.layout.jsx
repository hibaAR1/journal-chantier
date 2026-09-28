import { Button } from "../../../components/ui/button.jsx";
import { useAuthContext } from "../../../context/auth/auth.context.jsx";

import UsersUpdateLayout from "../update/users-update.layout.jsx";
import UsersDestroyLayout from "../destroy/users-destroy.layout.jsx";
import UsersToggleStatusLayout from "../toggle-status/users-toggle-status.layout.jsx";
import UsersResetPasswordLayout from "../reset-password/users-reset-password.layout.jsx";

import FilterTextComponent from "../../../components/filters/filter-text/filter-text.component.jsx";

const UsersColumnsLayout = () => {
    const { user } = useAuthContext();
    const permissions = user?.permissions || [];

    return [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <div className="min-w-[180px]">
                    <Button
                        variant="ghost2"
                        className="font-bold w-full justify-start"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nom
                    </Button>
                </div>
            ),
            filterFn: "includesString",
            Filter: ({ column }) => <FilterTextComponent column={column} />,
            cell: ({ row }) => <div className="px-2 text-left">{row.getValue("name")}</div>
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <div className="min-w-[200px]">
                    <Button
                        variant="ghost2"
                        className="font-bold w-full justify-start"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Email
                    </Button>
                </div>
            ),
            filterFn: "includesString",
            Filter: ({ column }) => <FilterTextComponent column={column} />,
            cell: ({ row }) => <div className="px-2 text-left">{row.getValue("email")}</div>
        },
        {
            accessorKey: "job",
            header: ({ column }) => (
                <div className="min-w-[160px]">
                    <Button
                        variant="ghost2"
                        className="font-bold w-full justify-start"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Poste
                    </Button>
                </div>
            ),
            filterFn: "includesString",
            Filter: ({ column }) => <FilterTextComponent column={column} />,
            cell: ({ row }) => <div className="px-2 text-left">{row.getValue("job")}</div>
        },
        {
            accessorKey: "username",
            header: ({ column }) => (
                <div className="min-w-[150px]">
                    <Button
                        variant="ghost2"
                        className="font-bold w-full justify-start"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nom d'utilisateur
                    </Button>
                </div>
            ),
            filterFn: "includesString",
            Filter: ({ column }) => <FilterTextComponent column={column} />,
            cell: ({ row }) => <div className="px-2 text-left">{row.getValue("username")}</div>
        },
        {
            accessorKey: "registration_number",
            header: ({ column }) => (
                <div className="min-w-[160px]">
                    <Button
                        variant="ghost2"
                        className="font-bold w-full justify-start"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        N° d'enregistrement
                    </Button>
                </div>
            ),
            filterFn: "includesString",
            Filter: ({ column }) => <FilterTextComponent column={column} />,
            cell: ({ row }) => <div className="px-2 text-left">{row.getValue("registration_number")}</div>
        },
        {
            id: "actions",
            header: () => <div className="font-bold text-center">Actions</div>,
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex justify-center items-center gap-1">
                        {permissions.includes("update users") && <UsersUpdateLayout user={user} />}
                        {permissions.includes("delete users") && <UsersDestroyLayout user={user} />}
                        {permissions.includes("toggle users") && <UsersToggleStatusLayout user={user} />}
                        {permissions.includes("reset password users") && <UsersResetPasswordLayout user={user} />}
                    </div>
                );
            }
        }
    ];
};

export default UsersColumnsLayout;