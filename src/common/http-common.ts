import axios from "axios";
import keycloak from "../Keycloak";

export default axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  headers: {
    "Content-type": "application/json",
	"Authorization": `Bearer ${keycloak.token}`
  }
});