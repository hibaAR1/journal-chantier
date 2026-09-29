import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs.jsx";

import DashboardDailyLayout from "../daily/dashboard-daily.layout.jsx";
import DashboardHistoryLayout from "../history/dashboard-history.layout.jsx";
import DashboardComparisonLayout from "../comparison/dashboard-comparison.layout.jsx";
import DashboardPricesLayout from "../prices/dashboard-prices.layout.jsx";
/**
 * Les 4 écrans d'exploitation des journaux (cahier des charges V3 — § 2.2 à 2.5).
 * Chaque onglet a ses propres filtres.
 */
const TABS = [
  { value: "daily", label: "Journalier", content: <DashboardDailyLayout /> },
  {
    value: "history",
    label: "Historique",
    content: <DashboardHistoryLayout />,
  },
  {
    value: "comparison",
    label: "Multi-chantiers",
    content: <DashboardComparisonLayout />,
  },
  {
    value: "prices",
    label: "Base de prix",
    content: <DashboardPricesLayout />,
  },
];

const DashboardTabsLayout = () => {
  return (
    <Tabs defaultValue="daily" className="w-full">
      <div className="px-4 pt-4">
        <TabsList className="bg-primary-600 text-white">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {TABS.map((tab) => (
        // forceMount : on garde les filtres choisis quand on change d'onglet
        <TabsContent
          key={tab.value}
          value={tab.value}
          forceMount
          className="data-[state=inactive]:hidden"
        >
          {tab.content ?? (
            <p className="p-4 text-sm text-secondary-500">
              Écran en cours de développement.
            </p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DashboardTabsLayout;
