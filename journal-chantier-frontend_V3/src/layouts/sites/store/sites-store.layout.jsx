import {useEffect, useState} from "react";

import {useSitesContext} from "../../../context/sites/sites.context.jsx";

import {useForm} from "react-hook-form";

import {preprocess, z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import {errorMessages} from "../../../utilities/errors.js";

import SheetFormLayout from "../../sheet-form/sheet-form.layout.jsx";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../../components/ui/form.jsx";
import {Input} from "../../../components/ui/input.jsx";

import {Button} from "../../../components/ui/button.jsx";

import LabelRequiredStarComponent from "../../../components/form/label-required-star/label-required-star.component.jsx";

import {FiLoader, FiPlusCircle} from "react-icons/fi";
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

const SitesStoreLayout = () => {
    const { clients, addSite, projectResponsibles, conductors, dataEntries, workers } = useSitesContext();

    const [isOpen, setIsOpen] = useState(false);

    const closeSheet = () => setIsOpen(false);

    const formSchema = z.object({
        client_id: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }).positive({message: errorMessages.select('un client')}),
        project_responsible_id: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }).positive({message: errorMessages.select('un responsable projet')}),
        // conductor_id: z.number({
        //     required_error: errorMessages.required(),
        //     invalid_type_error: errorMessages.required()
        // }).positive({message: errorMessages.select('un conducteur')}),
        conductor_id: z.preprocess(
            (val) => {
                if(val === "" || val === null || typeof val === "undefined") return null;
                return Number(val);
            },
            z.number().positive().nullable()
        ),
        data_entry_id: z.preprocess(
            (val) => {
                if(val === "" || val === null || typeof val === "undefined") return null;
                return Number(val);
            },
            z.number().positive().nullable()
        ),
        worker_id: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }).positive({message: errorMessages.select('un magasinier')}),
        name: z.string()
            .min(2, {message: errorMessages.min(2)})
            .max(250, {message: errorMessages.max(250)})
            .trim(),
        address: z.string()
            .min(2, {message: errorMessages.min(2)})
            .max(250, {message: errorMessages.max(250)})
            .trim(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            client_id: "",
            project_responsible_id: "",
            conductor_id: "",
            data_entry_id: "",
            worker_id: "",
            name: "",
            address: "",
        },
    });

    const {formState: {isSubmitting, errors}} = form;

    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen]);

    const onSubmit = async values => {
        await addSite(values, form);

        if (Object.keys(errors).length <= 0) {
            closeSheet();
        }
    };

    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Ajouter un chantier"
            btn={
                <Button variant="primaryOutline" className="justify-start gap-2">
                    <FiPlusCircle/>
                    <span className="hidden md:inline">Ajouter</span>
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
                        name="client_id"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Client <LabelRequiredStarComponent />
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="primaryControl"
                                                role="combobox"
                                            >
                                                {field.value
                                                    ? clients.find(
                                                        (client) => client.value === field.value
                                                    )?.label
                                                    : "Sélectionner client"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-0">
                                        <Command>
                                            <CommandInput placeholder="Sélectionner client"/>
                                            <CommandList>
                                                <CommandEmpty>Aucun client trouvable.</CommandEmpty>
                                                <CommandGroup>
                                                    {clients.length > 0 && clients.map((client) => (
                                                        <CommandItem
                                                            value={Number(client.label)}
                                                            key={client.value}
                                                            onSelect={() => {
                                                                form.setValue("client_id", client.value)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    client.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {client.label}
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
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Nom <LabelRequiredStarComponent />
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
                        name="address"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Adresse <LabelRequiredStarComponent />
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Adresse"
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
                        name="project_responsible_id"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Responsable Projet <LabelRequiredStarComponent />
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="primaryControl"
                                                role="combobox"
                                            >
                                                {field.value
                                                    ? projectResponsibles.find(
                                                        (projectResponsible) => projectResponsible.value === field.value
                                                    )?.label
                                                    : "Sélectionner responsable projet"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-0">
                                        <Command>
                                            <CommandInput placeholder="Sélectionner responsable projet"/>
                                            <CommandList>
                                                <CommandEmpty>Aucun responsable projet trouvable.</CommandEmpty>
                                                <CommandGroup>
                                                    {projectResponsibles.length > 0 && projectResponsibles.map((projectResponsible) => (
                                                        <CommandItem
                                                            value={Number(projectResponsible.label)}
                                                            key={projectResponsible.value}
                                                            onSelect={() => {
                                                                form.setValue("project_responsible_id", projectResponsible.value)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    projectResponsible.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {projectResponsible.label}
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
                        name="conductor_id"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Conducteur
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="primaryControl"
                                                role="combobox"
                                            >
                                                {field.value
                                                    ? conductors.find(
                                                        (conductor) => conductor.value === field.value
                                                    )?.label
                                                    : "Sélectionner conducteur"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-0">
                                        <Command>
                                            <CommandInput placeholder="Sélectionner conducteur"/>
                                            <CommandList>
                                                <CommandEmpty>Aucun conducteur trouvable.</CommandEmpty>
                                                <CommandGroup>
                                                    {conductors.length > 0 && conductors.map((conductor) => (
                                                        <CommandItem
                                                            value={Number(conductor.label)}
                                                            key={conductor.value}
                                                            onSelect={() => {
                                                                form.setValue("conductor_id", conductor.value)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    conductor.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {conductor.label}
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
                        name="data_entry_id"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Agent de Saisie
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="primaryControl"
                                                role="combobox"
                                            >
                                                {field.value
                                                    ? dataEntries.find(
                                                        (dataEntry) => dataEntry.value === field.value
                                                    )?.label
                                                    : "Sélectionner agent de saisie"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-0">
                                        <Command>
                                            <CommandInput placeholder="Sélectionner agent de saisie"/>
                                            <CommandList>
                                                <CommandEmpty>Aucun agent de saisie trouvable.</CommandEmpty>
                                                <CommandGroup>
                                                    {dataEntries.length > 0 && dataEntries.map((dataEntry) => (
                                                        <CommandItem
                                                            value={Number(dataEntry.label)}
                                                            key={dataEntry.value}
                                                            onSelect={() => {
                                                                form.setValue("data_entry_id", dataEntry.value)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    dataEntry.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {dataEntry.label}
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
                        name="worker_id"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Magasinier <LabelRequiredStarComponent />
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="primaryControl"
                                                role="combobox"
                                            >
                                                {field.value
                                                    ? workers.find(
                                                        (worker) => worker.value === field.value
                                                    )?.label
                                                    : "Sélectionner magasinier"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-0">
                                        <Command>
                                            <CommandInput placeholder="Sélectionner magasinier"/>
                                            <CommandList>
                                                <CommandEmpty>Aucun magasinier trouvable.</CommandEmpty>
                                                <CommandGroup>
                                                    {workers.length > 0 && workers.map((worker) => (
                                                        <CommandItem
                                                            value={Number(worker.label)}
                                                            key={worker.value}
                                                            onSelect={() => {
                                                                form.setValue("worker_id", worker.value)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    worker.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {worker.label}
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

export default SitesStoreLayout;
