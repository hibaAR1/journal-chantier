import { useState, useEffect } from "react";
import { useUsersContext } from "../../../context/users/users.context.jsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRolesContext } from "../../../context/role-users/role-users.context.jsx";

import SheetFormLayout from "../../sheet-form/sheet-form.layout.jsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../components/ui/form.jsx";
import { Input } from "../../../components/ui/input.jsx";
import { Button } from "../../../components/ui/button.jsx";
import LabelRequiredStarComponent from "../../../components/form/label-required-star/label-required-star.component.jsx";
import { FiPlusCircle, FiLoader } from "react-icons/fi";

const UsersStoreLayout = () => {
    const { addUser } = useUsersContext();
    const [isOpen, setIsOpen] = useState(false);
    const { roles, getRoles } = useRolesContext();
    const [permissionsByModule, setPermissionsByModule] = useState({});

    const formSchema = z.object({
        name: z.string().min(2).max(150),
        email: z.string().email().nullable(),
        job: z.string().min(2).max(100),
        username: z.string().min(2).max(100),
        registration_number: z.string().min(2).max(100).nullable(),
        phone: z.string().nullable(),
        role: z.string().min(1, "Rôle requis"),
        is_active: z.boolean(),
            });

    useEffect(() => {
        getRoles();
    }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            job: "",
            username: "",
            registration_number: "",
            phone: "",
            role: "",
            is_active: true,
        },
    });

    const { isSubmitting, errors } = form.formState;



    const onSubmit = async (values) => {
        try {
            console.log("Données envoyées :", values);
            await addUser(values, form);
            if (Object.keys(errors).length <= 0) {
                setIsOpen(false);
            }
        } catch (error) {
            console.error('Erreur lors de la création utilisateur :', error.response?.data || error.message);
            alert('Erreur lors de la création utilisateur : ' + (error.response?.data?.error || error.message));
        }
    };



    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Ajouter un utilisateur"
            btn={
                <Button variant="primaryOutline" className="justify-start gap-2">
                    <FiPlusCircle />
                    <span className="hidden md:inline">Ajouter</span>
                </Button>
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    {["name", "email", "phone", "job", "username", "registration_number"].map((field) => (
                        <FormField
                            key={field}
                            control={form.control}
                            name={field}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {field.name.charAt(0).toUpperCase() + field.name.slice(1).replace("_", " ")}
                                        <LabelRequiredStarComponent />
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} className="text-black text-sm" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}

                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Rôle <LabelRequiredStarComponent />
                                </FormLabel>
                                <FormControl>
                                    <select {...field} className="text-black text-sm w-full border rounded px-3 py-2">
                                        <option value="">Sélectionner un rôle</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.name}>
                                                {role.abbreviation}
                                            </option>
                                        ))}
                                    </select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-start gap-2">
                        <Button type="button" variant="primaryOutline" onClick={() => form.reset()}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isSubmitting} variant="primary">
                            {isSubmitting && <FiLoader className="me-2 animate-spin" />}
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </Form>
        </SheetFormLayout>
    );
};

export default UsersStoreLayout;