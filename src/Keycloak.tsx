import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
								url: `${process.env.REACT_APP_KC_URL}`,
								realm: `${process.env.REACT_APP_KC_REALM}`,
								clientId: `${process.env.REACT_APP_KC_CLIENTID}`,
								});
export default keycloak
