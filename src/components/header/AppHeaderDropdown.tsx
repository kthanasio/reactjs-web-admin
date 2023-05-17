import React from 'react'
import { useKeycloak } from "@react-keycloak/web";
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const AppHeaderDropdown = () => {
  // eslint-disable-next-line no-unused-vars
  const { keycloak, initialized } = useKeycloak();
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle  className="py-0" caret={false}> 
	  {/* placement="bottom-end" */}
        Olá, {keycloak.tokenParsed?.name || keycloak.tokenParsed?.preferred_username} !
      </CDropdownToggle>
	  <CDropdownMenu className="pt-0" placement="bottom-end">
        {!!keycloak.authenticated && (
			<CDropdownItem onClick={() => keycloak.logout()} >
          		<CIcon icon={cilUser} className="me-2" />Logout
        	</CDropdownItem>
		)}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
