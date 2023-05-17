import React from 'react'
import {
  CButton,
  CCol,
  CContainer,
  CInputGroup,
  CRow,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

const Page500 = () => {
	const navigate = useNavigate()
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <span className="clearfix">
              <h1 className="float-start display-3 me-4">500</h1>
              <h4 className="pt-3">Houston, we have a problem!</h4>
              <p className="text-medium-emphasis float-start">
                The page you are looking for is temporarily unavailable.
              </p>
            </span>
            <CInputGroup className="input-prepend">
            	<CButton color="info" onClick={() => navigate('/dashboard')	}>Back Home</CButton>
            </CInputGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page500
