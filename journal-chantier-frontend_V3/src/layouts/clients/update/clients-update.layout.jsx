import {useEffect, useState} from "react";

import {useClientsContext} from "../../../context/clients/clients.context.jsx";

import {useForm} from "react-hook-form";

import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import {errorMessages} from "../../../utilities/errors.js";

import SheetFormLayout from "../../sheet-form/sheet-form.layout.jsx";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../../components/ui/form.jsx";
import {Input} from "../../../components/ui/input.jsx";

import {Button} from "../../../components/ui/button.jsx";

import LabelRequiredStarComponent from "../../../components/form/label-required-star/label-required-star.component.jsx";

import {FiEdit2, FiLoader} from "react-icons/fi";

const ClientsUpdateLayout = ({client}) => {
    const {updateClient} = useClientsContext();

    const [isOpen, setIsOpen] = useState(false);

    const closeSheet = () => setIsOpen(false);

    const formSchema = z.object({
        registered_name: z.string()
            .min(2, {message: errorMessages.min(2)})
            .max(150, {message: errorMessages.max(150)})
            .trim(),
        code_system: z.string()
            .min(2, {message: errorMessages.min(2)})
            .max(50, {message: errorMessages.max(50)})
            .trim(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            registered_name: client.registered_name ?? '',
            code_system: client.code_system ?? '',
        },
    });

    const {formState: {isSubmitting, errors}} = form;

    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen]);

    const onSubmit = async (values) => {
        await updateClient(client.id, values, form);

        if (Object.keys(errors).length <= 0) {
            closeSheet();
        }
    };

    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Modifier le client"
            btn={
                <Button variant="warningOutline" className="h-6 px-1">
                    <FiEdit2/>
                </Button>
            }
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-5"
                ><FormField
                    control={form.control}
                    name="code_system"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                Code Système <LabelRequiredStarComponent />
                            </FormLabel>

                            <FormControl>
                                <Input
                                    placeholder="Code Système"
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
                        name="registered_name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Raison Social <LabelRequiredStarComponent />
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Raison Social"
                                        {...field}
                                        className="text-black text-sm"
                                    />
                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-start gap-2">
                        <Button onClick={() => form.reset()} type='button' variant="primaryOutline">
                            Annuler
                        </Button>
                        <Button disabled={isSubmitting} type="submit" variant="primary"
                                className="hover:scale-105 transition-all">
                            {isSubmitting && <FiLoader className="me-2 animate-spin"/>}
                            Enregistrer
                        </Button>
                    </div>
                </form>
            </Form>
        </SheetFormLayout>
    )
};

export default ClientsUpdateLayout;
