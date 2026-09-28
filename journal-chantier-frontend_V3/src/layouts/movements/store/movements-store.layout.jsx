import {useEffect, useState} from "react";

import {useMovementsContext} from "../../../context/movements/movements.context.jsx";

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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../../../components/ui/select.jsx";
import {format} from "date-fns";
import {Calendar} from "../../../components/ui/calendar.jsx";
import {Textarea} from "../../../components/ui/textarea.jsx";

const MovementsStoreLayout = () => {
    const {sites, products, suppliers, addMovement} = useMovementsContext();

    const [isOpen, setIsOpen] = useState(false);

    const closeSheet = () => setIsOpen(false);

    const formSchema = z.object({
        site_id: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }).positive({message: errorMessages.select('un chantier')}),
        product_id: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }).positive({message: errorMessages.select('un article')}),
        supplier_id: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }).positive({message: errorMessages.select('un fournisseur')}),
        date: z.date({invalid_type_error: errorMessages.selectDate()}),
        type: z.enum(["1", "2"], {
            errorMap: () => ({message: errorMessages.select('un type')}),
        }),
        quantity: z.number({
            required_error: errorMessages.required(),
            invalid_type_error: errorMessages.required()
        }),
        delivery_num: z.string().optional(),
        receipt_num: z.string().optional(),
        exit_num: z.string().optional(),
        transfer_num: z.string().optional(),
        observation: z.string().optional(),
    });


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            site_id: "",
            product_id: "",
            supplier_id: "",
            date: new Date(),
            type: "",
            quantity: "",
            delivery_num: "",
            receipt_num: "",
            exit_num: "",
            transfer_num: "",
            observation: "",
        },
    });

    const {formState: {isSubmitting, errors}} = form;

    useEffect(() => {
        if (!isOpen) {
            form.reset();
        }
    }, [isOpen]);

    const onSubmit = async values => {
        values.date = format(values.date, "yyyy-MM-dd");

        await addMovement(values, form);

        if (Object.keys(errors).length <= 0) {
            closeSheet();
        }
    };

    return (
        <SheetFormLayout
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Ajouter un mouvement"
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
                        name="site_id"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Chantier <LabelRequiredStarComponent/>
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="primaryControl"
                                                role="combobox"
                                            >
                                                {field.value
                                                    ? sites.find(
                                                        (site) => site.value === field.value
                                                    )?.label
                                                    : "Sélectionner chantier"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-0">
                                        <Command>
                                            <CommandInput placeholder="Sélectionner chantier"/>
                                            <CommandList>
                                                <CommandEmpty>Aucun chantier trouvable.</CommandEmpty>
                                                <CommandGroup>
                                                    {sites.length > 0 && sites.map((site) => (
                                                        <CommandItem
                                                            value={Number(site.label)}
                                                            key={site.value}
                                                            onSelect={() => {
                                                                form.setValue("site_id", site.value)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    site.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {site.label}
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
                        name="product_id"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Article <LabelRequiredStarComponent/>
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="primaryControl"
                                                role="combobox"
                                            >
                                                {field.value
                                                    ? products.find(
                                                        (product) => product.value === field.value
                                                    )?.label
                                                    : "Sélectionner article"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-0">
                                        <Command>
                                            <CommandInput placeholder="Sélectionner article"/>
                                            <CommandList>
                                                <CommandEmpty>Aucun article trouvable.</CommandEmpty>
                                                <CommandGroup>
                                                    {products.length > 0 && products.map((product) => (
                                                        <CommandItem
                                                            value={Number(product.label)}
                                                            key={product.value}
                                                            onSelect={() => {
                                                                form.setValue("product_id", product.value)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    product.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {product.label}
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
                        name="supplier_id"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Fournisseur <LabelRequiredStarComponent/>
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="primaryControl"
                                                role="combobox"
                                            >
                                                {field.value
                                                    ? suppliers.find(
                                                        (supplier) => supplier.value === field.value
                                                    )?.label
                                                    : "Sélectionner fournisseur"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-0">
                                        <Command>
                                            <CommandInput placeholder="Sélectionner fournisseur"/>
                                            <CommandList>
                                                <CommandEmpty>Aucun fournisseur trouvable.</CommandEmpty>
                                                <CommandGroup>
                                                    {suppliers.length > 0 && suppliers.map((supplier) => (
                                                        <CommandItem
                                                            value={Number(supplier.label)}
                                                            key={supplier.value}
                                                            onSelect={() => {
                                                                form.setValue("supplier_id", supplier.value)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    supplier.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {supplier.label}
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
                        name="date"
                        render={({field}) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>
                                    Date <LabelRequiredStarComponent/>
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"primaryControl"}
                                            >
                                                {field.value ? (
                                                    format(field.value, "dd-MM-yyyy")
                                                ) : (
                                                    <span>Sélectionner une date</span>
                                                )}
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Type <LabelRequiredStarComponent/>
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger variant="primary">
                                            <SelectValue placeholder="Sélectionner"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="1">Entrée</SelectItem>
                                        <SelectItem value="2">Sortie</SelectItem>
                                        <SelectItem value="3">Transfert</SelectItem>
                                    </SelectContent>
                                </Select>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Quantité <LabelRequiredStarComponent/>
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Quantité"
                                        type="number"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className="text-black text-sm"
                                    />
                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="delivery_num"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Num BL
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Num BL"
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
                        name="receipt_num"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Num Réception
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Num Récéption"
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
                        name="exit_num"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Num Sortie
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Num Sortie"
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
                        name="transfer_num"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Num Transfert
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Num Transfert"
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
                        name="observation"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Observation
                                </FormLabel>

                                <FormControl>
                                    <Textarea
                                        placeholder="Observation"
                                        {...field}
                                        className="text-black text-sm resize-none"
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

export default MovementsStoreLayout;
