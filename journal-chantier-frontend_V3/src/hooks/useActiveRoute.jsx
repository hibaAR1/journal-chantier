import {matchRoutes, useLocation} from "react-router-dom";

import {router} from '../router/index';

const useActiveRoute = () => {
    const location = useLocation();
    const routes = router.routes;

    const matches = matchRoutes(routes, location);

    if (!matches || matches.length === 0) return null;

    const lastMatch = matches[matches.length - 1];
    return lastMatch.route.name;
};

export default useActiveRoute;
