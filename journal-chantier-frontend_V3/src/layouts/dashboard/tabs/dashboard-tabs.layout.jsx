import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs.jsx";

import { useAuthContext } from "../../../context/auth/auth.context.jsx";

import DashboardDailyLayout from "../daily/dashboard-daily.layout.jsx";
import DashboardHistoryLayout from "../history/dashboard-history.layout.jsx";
import DashboardComparisonLayout from "../comparison/dashboard-comparison.layout.jsx";
import DashboardPricesLayout from "../prices/dashboard-prices.layout.jsx";
/**
 * Les 4 écrans d'exploitation des journaux (cahier des charges V3 — § 2.2 à 2.5).
 * Chaque onglet a ses propres filtres et sa propre permission
 * (Utilisateurs → Permissions → Tableau de bord).
 */
const TABS = [
  {
    value: "daily",
    label: "Journalier",
    permission: "view dashboard daily",
    content: <DashboardDailyLayout />,
  },
  {
    value: "history",
    label: "Historique",
    permission: "view dashboard history",
    content: <DashboardHistoryLayout />,
  },
  {
    value: "comparison",
    label: "Multi-chantiers",
    permission: "view dashboard comparison",
    content: <DashboardComparisonLayout />,
  },
  {
    value: "prices",
    label: "Base de prix",
    permission: "view dashboard prices",
    content: <DashboardPricesLayout />,
  },
];

const DashboardTabsLayout = () => {
  const { user } = useAuthContext();

  const permissions = user?.permissions || [];

  // On n'affiche (et on ne charge) que les onglets autorisés pour cet utilisateur
  const allowedTabs = TABS.filter((tab) =>
    permissions.includes(tab.permission),
  );

  if (allowedTabs.length === 0) {
    return (
      <p className="p-4 text-sm text-secondary-500">
        Vous n&apos;avez accès à aucun onglet du tableau de bord.
      </p>
    );
  }

  return (
    <Tabs defaultValue={allowedTabs[0].value} className="w-full">
      <div className="px-4 pt-4">
        <TabsList className="bg-primary-600 text-white">
          {allowedTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {allowedTabs.map((tab) => (
        // forceMount : on garde les filtres choisis quand on change d'onglet
        <TabsContent
          key={tab.value}
          value={tab.value}
          forceMount
          className="data-[state=inactive]:hidden"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DashboardTabsLayout;
