import {TabsContent} from "../../components/ui/tabs.jsx";

const TabContentLayout = ({
                              children,
                              value
}) => {
    return (
        <TabsContent
            value={value}
        >
            {children}
        </TabsContent>
    )
};

export default TabContentLayout;
