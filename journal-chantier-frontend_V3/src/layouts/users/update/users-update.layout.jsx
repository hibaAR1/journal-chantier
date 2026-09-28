// src/layouts/users/update/users-update.layout.jsx
import {useEffect, useState} from "react";

import { useUsersContext } from "../../../context/users/users.context.jsx";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import SheetFormLayout from "../../sheet-form/sheet-form.layout.jsx";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form.jsx";
import { Input } from "../../../components/ui/input.jsx";
import { Button } from "../../../components/ui/button.jsx";

import LabelRequiredStarComponent from "../../../components/form/label-required-star/label-required-star.component.jsx";
import { FiEdit2, FiLoader } from "react-icons/fi";
import {useRolesContext} from "../../../context/role-users/role-users.context.jsx";

const UsersUpdateLayout = ({ user }) => {
    const { updateUser } = useUsersContext();
    const { roles, getRoles } = useRolesContext();

    const [isOpen, setIsOpen] = useState(false);

    const formSchema = z.object({
        name: z.string().min(2).max(150),
        email: z.string().email(),
        job: z.string().min(2).max(100),
        username: z.string().min(2).max(100),
        registration_number: z.string().min(2).max(100),
        role: z.string().min(1),
        is_active: z.boolean()
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            job: user.job,
            username: user.username,
            registration_number: user.registration_number,
            role: user.role, // si tu le récupères dans UserResource
            is_active: user.is_active
        }
    });

    const { isSubmitting } = form.formState;

    const onSubmit = async (values) => {
        await updateUser(user.id, values);
        setIsOpen(false);
    };

    useEffect(() => {
        getRoles();
    }, []);

    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title={`Modifier: ${user.name}`}
            btn={
                <Button variant="primaryOutline" className="h-6 px-1">
                    <FiEdit2 />
                </Button>
            }
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    {['name', 'email', 'job', 'username', 'registration_number'].map(fieldName => (
                        <FormField
                            key={fieldName}
                            control={form.control}
                            name={fieldName}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace('_', ' ')}
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
                                <FormLabel>Rôle <LabelRequiredStarComponent /></FormLabel>
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

                    <FormField
                        control={form.control}
                        name="is_active"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Actif</FormLabel>
                                <FormControl>
                                    <input
                                        type="checkbox"
                                        {...field}
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                    />
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

export default UsersUpdateLayout;
