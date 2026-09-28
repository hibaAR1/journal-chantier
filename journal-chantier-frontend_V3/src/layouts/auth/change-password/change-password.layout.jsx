import {useEffect, useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FiLoader, FiLock} from "react-icons/fi";
import SheetFormLayout from "../../sheet-form/sheet-form.layout.jsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../../components/ui/form.jsx";
import {Input} from "../../../components/ui/input.jsx";
import {Button} from "../../../components/ui/button.jsx";
import {useAuthContext} from "../../../context/auth/auth.context.jsx";

const ChangePasswordLayout = () => {
    const { changePassword } = useAuthContext();

    const [isOpen, setIsOpen] = useState(false);

    const closeSheet = () => setIsOpen(false);

    const formSchema = z.object({
        current_password: z.string().min(8, "Le mot de passe actuel doit contenir au moins 8 caractères"),
        new_password: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
        new_password_confirmation: z.string().min(8, "la confirmation du mot de passe doit contenir au moins 8 caractères")
    }).superRefine((data, ctx) => {
        if (data.new_password !== data.new_password_confirmation) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Les mots de passe ne correspondent pas",
                path: ["new_password_confirmation"],
            });
        }
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            current_password: "",
            new_password: "",
            new_password_confirmation: ""
        },
    });

    const {formState: {isSubmitting, errors}} = form;

    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen]);

    const toggleSheet = () => {
        setIsOpen(prevState => !prevState);
    };

    const handleSubmit = async (values) => {
        await changePassword(values, form);

        if (Object.keys(form.formState.errors).length <= 0) {
            closeSheet();
        }
    }

    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Changer le mot de passe"
            btn={
                <div
                    onClick={toggleSheet}
                    className="flex justify-center items-center gap-1/2 cursor-pointer px-2 py-1.5 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                    <FiLock className="me-2"/>
                    Changer le mot de passe
                </div>
            }
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="flex flex-col gap-5"
                >
                    <FormField
                        control={form.control}
                        name="current_password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Mot de passe actuel
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        variant='black'
                                        type="password"
                                        placeholder="Mot de passe actuel"
                                        {...field}
                                        className="text-black text-sm"
                                    />
                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="new_password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Nouveau mot de passe
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        variant='black'
                                        type="password"
                                        placeholder="Nouveau mot de passe"
                                        {...field}
                                        className="text-black text-sm"
                                    />
                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="new_password_confirmation"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Confirmation du mot de passe
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        variant='black'
                                        type="password"
                                        placeholder="Confirmer le nouveau mot de passe"
                                        {...field}
                                        className="text-black text-sm"
                                    />
                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-start gap-2">
                        <Button onClick={() => form.reset()} type='button' variant="blackOutline">
                            Annuler
                        </Button>
                        <Button disabled={isSubmitting} type="submit" variant="black"
                                className="hover:scale-105 transition-all">
                            {isSubmitting && <FiLoader className="me-2 animate-spin"/>}
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </Form>
        </SheetFormLayout>
    );
};

export default ChangePasswordLayout;