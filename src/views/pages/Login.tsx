import React from 'react'
import { useKeycloak } from "@react-keycloak/web";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CRow,
} from '@coreui/react'
const Login = () => {
  const { keycloak, initialized } = useKeycloak();

  return (
    (!initialized ? <div><h1>Loading...</h1></div> : <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={3}>
            <CCardGroup>
              <CCard className="p-3">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CRow>
                      <CCol xs={3}>
					  	{!keycloak.authenticated && (
						<CButton 
							color="primary" 
							className="px-4" 
							onClick={async () => { 
										await keycloak.login({redirectUri: 'https://appmap.azurewebsites.net/#/'}); 
										}}>
							Login
						</CButton>
						)}
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  ))
}

export default Login
