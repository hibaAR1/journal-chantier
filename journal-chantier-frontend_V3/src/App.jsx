import { RouterProvider } from "react-router-dom";

import { router } from "./router/index.jsx";

import { LoadingProvider } from "./context/loading/loading.context.jsx";
import { UserProvider } from "./context/auth/auth.context.jsx";
import { UsersProvider } from "./context/users/users.context.jsx";
import { ClientsProvider } from "./context/clients/clients.context.jsx";
import { SuppliersProvider } from "./context/suppliers/suppliers.context.jsx";
import { WorkersProvider } from "./context/workers/workers.context.jsx";
import { ProductCategoriesProvider } from "./context/product-categories/product-categories.context.jsx";
import { ProductsProvider } from "./context/products/products.context.jsx";
import { SitesProvider } from "./context/sites/sites.context.jsx";
import { SiteLocationsProvider } from "./context/site-locations/site-locations.context.jsx";
import { WorksProvider } from "./context/works/works.context.jsx";
import { WorkTypesProvider } from "./context/work-types/work-types.context.jsx";
import { ResourcesProvider } from "./context/resources/resources.context.jsx";
import { LocationsProvider } from "./context/locations/locations.context.jsx";
import { MovementsProvider } from "./context/movements/movements.context.jsx";
import { AssignmentsProvider } from "./context/assignments/assignments.context.jsx";
import { AssignmentWorkersProvider } from "./context/assignment-workers/assignment-workers.context.jsx";
import { PunchesProvider } from "./context/punches/punches.context.jsx";
import { PunchWorkersProvider } from "./context/punch-workers/punch-workers.context.jsx";
import { ReportsProvider } from "./context/reports/reports.context.jsx";
import { ReportWorkTypesProvider } from "./context/report-work-types/report-work-types.context.jsx";
import { ReportWorkTypeWorkersProvider } from "./context/report-work-type-workers/report-work-type-workers.context.jsx";
import { RolesProvider } from "./context/role-users/role-users.context.jsx";
import { PermissionsProvider } from "./context/permissions/permissions.context.jsx";
import { DashboardProvider } from "./context/dashboard/dashboard.context.jsx";
const App = () => {
  return (
    <LoadingProvider>
      <UserProvider>
        <UsersProvider>
          <RolesProvider>
            <PermissionsProvider>
              <ClientsProvider>
                <SuppliersProvider>
                  <WorkersProvider>
                    <ProductCategoriesProvider>
                      <ProductsProvider>
                        <SitesProvider>
                          <SiteLocationsProvider>
                            <WorksProvider>
                              <WorkTypesProvider>
                                <ResourcesProvider>
                                  <LocationsProvider>
                                    <MovementsProvider>
                                      <AssignmentsProvider>
                                        <AssignmentWorkersProvider>
                                          <PunchesProvider>
                                            <PunchWorkersProvider>
                                              <ReportsProvider>
                                                <ReportWorkTypesProvider>
                                                  <ReportWorkTypeWorkersProvider>
                                                    <DashboardProvider>
                                                      <RouterProvider
                                                        router={router}
                                                      />
                                                    </DashboardProvider>
                                                  </ReportWorkTypeWorkersProvider>
                                                </ReportWorkTypesProvider>
                                              </ReportsProvider>
                                            </PunchWorkersProvider>
                                          </PunchesProvider>
                                        </AssignmentWorkersProvider>
                                      </AssignmentsProvider>
                                    </MovementsProvider>
                                  </LocationsProvider>
                                </ResourcesProvider>
                              </WorkTypesProvider>
                            </WorksProvider>
                          </SiteLocationsProvider>
                        </SitesProvider>
                      </ProductsProvider>
                    </ProductCategoriesProvider>
                  </WorkersProvider>
                </SuppliersProvider>
              </ClientsProvider>
            </PermissionsProvider>
          </RolesProvider>
        </UsersProvider>
      </UserProvider>
    </LoadingProvider>
  );
};

export default App;
