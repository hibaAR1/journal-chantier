import {useEffect, useState} from "react";

import {useWorkersContext} from "../../../context/workers/workers.context.jsx";

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
import {Popover, PopoverContent, PopoverTrigger} from "../../../components/ui/popover.jsx";
import {cn} from "../../../lib/utils.js";
import {Check, ChevronsUpDown} from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from "../../../components/ui/command.jsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../../components/ui/select.jsx";

const WorkersUpdateLayout = ({worker}) => {
    const {resources, updateWorker} = useWorkersContext();

    const [isOpen, setIsOpen] = useState(false);

    const closeSheet = () => setIsOpen(false);

    const formSchema = z.object({
        resource_id: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }).positive({message: errorMessages.select('un type')}),
        name: z.string()
            .min(2, {message: errorMessages.min(2)})
            .max(250, {message: errorMessages.max(250)})
            .trim(),
        registration_number: z.string()
            .min(2, {message: errorMessages.min(2)})
            .max(250, {message: errorMessages.max(250)})
            .trim(),
        contract_type: z.enum(["CDC", "TECTRA", "CDI"], {
            errorMap: () => ({message: errorMessages.select('un type de contrat')}),
        }),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            resource_id: worker.resource_id ?? '',
            name: worker.name ?? '',
            registration_number: worker.registration_number ?? '',
            contract_type: worker.contract_type ?? '',
        },
    });

    const {formState: {isSubmitting, errors}} = form;

    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen]);

    const onSubmit = async (values) => {
        await updateWorker(worker.id, values, form);

        if (Object.keys(errors).length <= 0) {
            closeSheet();
        }
    };

    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Modifier l'ouvrier"
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
                >
                    <FormField
                        control={form.control}
                        name="registration_number"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Matricule <LabelRequiredStarComponent/>
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Matricule"
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
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Nom <LabelRequiredStarComponent/>
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Nom"
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
                        name="resource_id"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Callification <LabelRequiredStarComponent/>
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="primaryControl"
                                                role="combobox"
                                            >
                                                {field.value
                                                    ? resources.find(
                                                        (resource) => resource.value === field.value
                                                    )?.label
                                                    : "Sélectionner type"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-0">
                                        <Command>
                                            <CommandInput placeholder="Sélectionner type"/>
                                            <CommandList>
                                                <CommandEmpty>Aucun type trouvable.</CommandEmpty>
                                                <CommandGroup>
                                                    {resources.length > 0 && resources.map((resource) => (
                                                        <CommandItem
                                                            value={Number(resource.label)}
                                                            key={resource.value}
                                                            onSelect={() => {
                                                                form.setValue("resource_id", resource.value)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    resource.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {resource.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="contract_type"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Type de contrat <LabelRequiredStarComponent/>
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger variant="primary">
                                            <SelectValue placeholder="Sélectionner"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="CDC">CDC</SelectItem>
                                        <SelectItem value="TECTRA">TECTRA</SelectItem>
                                        <SelectItem value="CDI">CDI</SelectItem>
                                    </SelectContent>
                                </Select>

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

export default WorkersUpdateLayout;
