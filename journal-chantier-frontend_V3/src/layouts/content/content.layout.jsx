import {useEffect, useState} from "react";

import ContentStyles from "./content.styles.jsx";

import {Tabs, TabsList, TabsTrigger} from "../../components/ui/tabs.jsx";
import {useAuthContext} from "../../context/auth/auth.context.jsx";
import {useNavigate} from "react-router-dom";
import {HOME_ROUTE, LOGIN_ROUTE} from "../../router/index.jsx";

const ContentLayout = ({
                           children,
                           permission,
                           title,
                           type = 'simple',
                           tabs = [
                               {title: 'list', value: "Liste"},
                               {title: 'new', value: "Nouveau"}
                           ],
                           defaultTab = 'list'
}) => {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const {user} = useAuthContext();

    const permissions = user?.permissions || [];

    const navigate = useNavigate();

    useEffect(() => {
        if (!permissions.includes(permission)) {
            navigate(HOME_ROUTE);
        }
    }, []);

    return (
        <ContentStyles className="content px-3 py-3 sm:py-4 overflow-hidden bg-white text-primary-600">
            {
                type === 'simple'
                    ? (
                        <>
                            <h1 className="font-semibold text-primary-600 text-3xl">
                                {title}
                            </h1>

                            <div className="section p-0 flex flex-wrap justify-start mt-1.5 border-2 border-primary-600 rounded-md overflow-scroll">
                                {children}
                            </div>
                        </>
                    ) : (
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <div className="flex justify-between items-center">
                                <h1 className="font-semibold text-primary-600 text-3xl">
                                    {title}
                                </h1>

                                <TabsList className="bg-primary-600 text-white">
                                    {
                                        tabs.map((tab, index) =>
                                            (
                                                <TabsTrigger
                                                    key={index}
                                                    value={tab.title}
                                                >
                                                    {tab.value}
                                                </TabsTrigger>
                                            )
                                        )
                                    }
                                </TabsList>
                            </div>

                            <div className="section p-0 flex flex-wrap justify-start mt-1.5 border-2 border-primary-600 rounded-md overflow-scroll">
                                {children}
                            </div>
                        </Tabs>
                    )
            }
        </ContentStyles>
    )
};

export default ContentLayout;
