import { useKeycloak } from "@react-keycloak/web";
import Login from '../views/pages/Login'

const PrivateRoute = ({ children }: {children: any}) : JSX.Element => {
	const { keycloak, initialized} = useKeycloak();
	
	if (!initialized) {
		return (
			<div className="pt-3 text-left">
				<div className="sk-spinner sk-spinner-pulse">Loading...</div>
			</div>
		)
	}	
	const isLoggedIn = keycloak.authenticated;
		return isLoggedIn ? children : Login();
};
export default PrivateRoute;
