import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../ui/form.jsx";
import {Input} from "../../ui/input.jsx";

const InputComponent = ({
                            form,
                            type = 'text',
                            label,
                            name,
                            placeholder,
                            onChange = (e) => e.target.value,
                            variant = 'black'
                        }) => {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({field}) => (
                <FormItem>
                    <FormLabel>
                        {label}
                    </FormLabel>

                    <FormControl>
                        <Input
                            variant={variant}
                            placeholder={placeholder}
                            type={type}
                            {...field}
                            onChange={(e) => {
                                onChange(e)
                            }}
                            className="text-black text-sm"
                        />
                    </FormControl>

                    <FormMessage/>
                </FormItem>
            )}
        />
    )
};

export default InputComponent;
