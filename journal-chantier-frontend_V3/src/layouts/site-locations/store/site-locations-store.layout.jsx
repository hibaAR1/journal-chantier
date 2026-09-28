import {useEffect, useState} from "react";

import {useSiteLocationsContext} from "../../../context/site-locations/site-locations.context.jsx";

import {useForm} from "react-hook-form";

import {z} from "zod";
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

const SiteLocationsStoreLayout = ({siteId}) => {
    const {locations, addSiteLocation} = useSiteLocationsContext();

    const [isOpen, setIsOpen] = useState(false);

    const closeSheet = () => setIsOpen(false);

    const formSchema = z.object({
        location_id: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }).positive({message: errorMessages.select('un emplacemet')}),
        block: z.string()
            .min(1, {message: errorMessages.min(1)})
            .max(255, {message: errorMessages.max(255)})
            .trim(),
        element: z.string()
            .min(1, {message: errorMessages.min(1)})
            .max(255, {message: errorMessages.max(255)})
            .trim(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            site_id: siteId,
            location_id: "",
            block: "",
            element: "",
        },
    });

    const {formState: {isSubmitting, errors}} = form;

    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen]);

    const onSubmit = async (values) => {
        await addSiteLocation(values, form, siteId);

        if (Object.keys(errors).length <= 0) {
            closeSheet();
        }
    };

    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Ajouter un emplacement chantier"
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
                        name="location_id"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Emplacement <LabelRequiredStarComponent/>
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="primaryControl"
                                                role="combobox"
                                            >
                                                {field.value
                                                    ? locations.find(
                                                        (location) => location.value === field.value
                                                    )?.label
                                                    : "Sélectionner emplacement"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-0">
                                        <Command>
                                            <CommandInput placeholder="Sélectionner emplacement"/>
                                            <CommandList>
                                                <CommandEmpty>Aucun emplacement trouvable.</CommandEmpty>
                                                <CommandGroup>
                                                    {locations.length > 0 && locations.map((location) => (
                                                        <CommandItem
                                                            value={Number(location.label)}
                                                            key={location.value}
                                                            onSelect={() => {
                                                                form.setValue("location_id", location.value)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    location.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {location.label}
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
                        name="block"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Bloc <LabelRequiredStarComponent />
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Bloc"
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
                        name="element"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Element <LabelRequiredStarComponent />
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Element"
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

export default SiteLocationsStoreLayout;
