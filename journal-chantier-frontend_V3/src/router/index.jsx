import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../layouts/app/app.layout.jsx";
import GuestLayout from "../layouts/guest/guest.layout.jsx";

import ThirdPartyPage from "../pages/third-party/third-part.page.jsx";
import ProductCategoriesPage from "../pages/product-categories/product-categories.page.jsx";

import LoginPage from "../pages/login/login.page.jsx";
import ErrorPage from "../pages/error/error.page.jsx";
import ProductsPage from "../pages/products/products.page.jsx";
import SitesPage from "../pages/sites/sites.page.jsx";
import WorksPage from "../pages/works/works.page.jsx";
import WorkTypesPage from "../pages/work-types/work-types.page.jsx";
import ResourcesPage from "../pages/resources/resources.page.jsx";
import LocationsPage from "../pages/locations/locations.page.jsx";
import MovementsPage from "../pages/movements/movements.page.jsx";
import WorkersPage from "../pages/workers/workers.page.jsx";
import PunchesPage from "../pages/punches/punches.page.jsx";
import PunchSummaryPage from "../pages/punch-summary/punch-summary.page.jsx";
import ReportsPage from "../pages/reports/reports.page.jsx";
import ReportWorkTypesPage from "../pages/report-work-types/report-work-types.page.jsx";
import ReportWorkTypeWorkersPage from "../pages/report-work-type-workers/report-work-type-workers.page.jsx";
import SiteLocationsPage from "../pages/site-locations/site-locations.page.jsx";
import SiteWorksPage from "../pages/site-works/site-works.page.jsx";
import SiteWorkTypePage from "../pages/site-work-types/site-work-types.page.jsx";
import AssignmentsPage from "../pages/assignments/assignments.page.jsx";
import PunchWorkersPage from "../pages/punch-workers/punch-workers.page.jsx";
import AssignmentWorkersPage from "../pages/assignment-workers/assignment-workers.page.jsx";
import HomePage from "../pages/home/Home.page.jsx";
import UsersPage from "../pages/users/users.page.jsx";
import RoleUsersPage from "../pages/role-user/role-users.page.jsx";
import PermissionsPage from "../pages/permisssions/PermissionsPage.jsx";

export const HOME_ROUTE = "/";
export const LOGIN_ROUTE = "/login";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        name: "home",
        permission: "view dashboard",
      },
      {
        path: "/home",
        element: <HomePage />,
        name: "home",
        permission: "view dashboard",
      },
      {
        path: "/third-party",
        element: <ThirdPartyPage />,
        name: "third-party",
        permission: "view third parties",
      },
      { path: "/products", element: <ProductsPage />, name: "products" },
      {
        path: "/product-categories",
        element: <ProductCategoriesPage />,
        name: "products",
      },
      { path: "/sites", element: <SitesPage />, name: "sites" },
      {
        path: "/site-locations/:siteId",
        element: <SiteLocationsPage />,
        name: "sites",
      },
      {
        path: "/site-works/:siteId",
        element: <SiteWorksPage />,
        name: "site-works",
      },
      {
        path: "/site-works-type/:siteId",
        element: <SiteWorkTypePage />,
        name: "site-works",
      },
      { path: "/locations", element: <LocationsPage />, name: "locations" },
      { path: "/resources", element: <ResourcesPage />, name: "resources" },
      { path: "/works", element: <WorksPage />, name: "works" },
      { path: "/work-types", element: <WorkTypesPage />, name: "works" },
      { path: "/movements", element: <MovementsPage />, name: "movements" },
      { path: "/workers", element: <WorkersPage />, name: "workers" },
      {
        path: "/assignments",
        element: <AssignmentsPage />,
        name: "assignments",
      },
      {
        path: "/assignment-workers/:assignmentId",
        element: <AssignmentWorkersPage />,
        name: "assignments",
      },
      { path: "/punches", element: <PunchesPage />, name: "punches" },
      {
        path: "/punch-summary",
        element: <PunchSummaryPage />,
        name: "punch-summary",
      },
      {
        path: "/punch-workers/:punchId",
        element: <PunchWorkersPage />,
        name: "punches",
      },
      { path: "/reports", element: <ReportsPage />, name: "reports" },
      {
        path: "/report-work-types/:reportId",
        element: <ReportWorkTypesPage />,
        name: "reports",
      },
      {
        path: "/report-work-type-workers/:reportWorkTypeId",
        element: <ReportWorkTypeWorkersPage />,
        name: "reports",
      },
      { path: "/users", element: <UsersPage />, name: "users" },
      { path: "/roles", element: <RoleUsersPage />, name: "roles" },
      {
        path: "/permissions",
        element: <PermissionsPage />,
        name: "permissions",
      },
    ],
  },
  {
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
        name: "login",
      },
      {
        path: "*",
        element: <ErrorPage />,
        name: "404",
      },
    ],
  },
]);
