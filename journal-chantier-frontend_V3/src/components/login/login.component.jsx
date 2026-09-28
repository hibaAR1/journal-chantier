import {useAuthContext} from "../../context/auth/auth.context.jsx";

import {useNavigate} from "react-router-dom";

import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "../../components/ui/form.jsx";

import {Input} from "../../components/ui/input.jsx";
import {Button} from "../../components/ui/button.jsx";

import {FiLoader} from "react-icons/fi";

import logo from '../../assets/svg/logo.svg';

import motif from '../../assets/motif-tcgm.png';
import LabelRequiredStarComponent from "../form/label-required-star/label-required-star.component.jsx";

const formSchema = z.object({
    login: z.string().min(2).max(50).trim(),
    password: z.string().min(8).max(16),
});

const LoginComponent = () => {
    const authContext = useAuthContext();

    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            login: "",
            password: "",
        },
    });

    const {formState: {isSubmitting}} = form;

    const onSubmit = async values => {
        await authContext.login(values, form, navigate);
    };

    return (
        <div
            style={{
                backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url('${motif}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
            className="w-screen h-screen flex justify-center items-center"
        >

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 p-10 border-4 border-primary-500 rounded-2xl scale-120 bg-white min-w-[80%] max-w-[80%] sm:min-w-[400px] sm:max-w-[400px]"
                >
                    <div className="flex justify-center">
                        <img src={logo} alt="Logo" className="w-[190px]"/>
                    </div>

                    <FormField
                        control={form.control}
                        name="login"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Login <LabelRequiredStarComponent />
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Login"
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
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    Mot de passe <LabelRequiredStarComponent />
                                </FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Mot de passe"
                                        type="password" {...field}
                                        className="text-black text-sm"
                                    />
                                </FormControl>

                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button disabled={isSubmitting} type="submit" variant="primaryOutline"
                            className="hover:scale-105 transition-all">
                        {isSubmitting && <FiLoader className="me-2 animate-spin"/>}
                        Se connecter
                    </Button>
                </form>
            </Form>
        </div>
    )
};

export default LoginComponent;
