import React, {useState, useRef, useEffect} from 'react'
import { useParams } from 'react-router';
import { Link } from "react-router-dom";

import {
	CCard,
	CCardBody,
	CCardHeader,
	CCol,
	CRow,
	CButton,
	CForm,
	CFormInput,
	CFormSwitch,
	CToaster
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilChevronLeft } from '@coreui/icons';

import { Toast } from '../toast/Toast';
import { useKeycloak } from '@react-keycloak/web';
import { Loader } from '../Loader/Loader';
import { useUpdateMutate } from '../../../hooks/Companies/useUpdateMutate';
import { AxiosError } from 'axios';
import { CompanyService } from '../../../services';

const CompanyEdit = () => {
  const kc = useKeycloak();
  const RESOURCE_ID = 'backend-application-map'
  const ROLE_ADMIN = kc.keycloak.hasResourceRole('company-admin', RESOURCE_ID)
  const ROLE_UPDATE   = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('company-update', RESOURCE_ID)

  const [toast, setToast] = useState<JSX.Element>(<></>)
  const toaster = useRef<HTMLDivElement>(null)

  const [companyName, setCompanyName] = useState('');
  const [companyStatus, setCompanyStatus] = useState('1');
  
  const [isEnabled, setIsEnabled] = useState(true)

  const params = useParams()
  const { id = '' } = params

  useEffect(()=>{
	CompanyService.get(id).then((response): void => {
		const { name, status } = response.data
		setCompanyName(name)
		setCompanyStatus(status)	
	})
  }, [])

  const { mutate, isSuccess, isError, isLoading, error } = useUpdateMutate()

  const handleSubmit = async (event: any) => {
    event.preventDefault()
	
	const companyData = {
		name: companyName,
		status: companyStatus
	}

	mutate({ 
		id: id,
		data: companyData
	})
  }

  useEffect( () => { 
	if (isSuccess) {
		setToast(Toast( { message: 'Company Updated Successfully!',color: 'success'}))
	  }	
  }, [isSuccess])

  useEffect( () => { 
	if (isError && error instanceof AxiosError) {
		setToast(Toast( { message: JSON.stringify(error.response?.data.message) ,color: 'danger'}))
	}
  }, [isError, error])

  useEffect(()=> {
	setCompanyStatus(isEnabled ? '1' : '0' )
	}, [isEnabled])
	
	const handleStatusChange = async () => {
		setIsEnabled(cur => !isEnabled)
	}

	
  return (
	<>
		{ (!ROLE_UPDATE) && <><span>Permission Required</span></>}
		{ isLoading && <><span><Loader /></span></>}
		{ ROLE_UPDATE &&

			<CRow>
			<CCol xs={12}>
				<CCard className="mb-4">
				<CToaster ref={toaster} push={toast} placement="top-end" />
				<CCardHeader>
					<strong>Company</strong> <small>Edit</small>
				</CCardHeader>
				<CCardBody>
					<div>
						<CForm
							className="column g-3 needs-validation"
							noValidate
							onSubmit={handleSubmit}
						>
							<CRow className="d-grid p-1">
								<CCol md={12} className="mb-3">
									<CFormInput
										type="text"
										value={ companyName}
										onChange={(e) => { setCompanyName(e.target.value)}}
										id="companyName"
										label="Name"
										required
									/>
								</CCol>
								<CCol md={2}>
									<CFormSwitch 
											label="Enabled" 
											type='checkbox' 
											id="company-status-checkbox" 
											value={companyStatus} 
											checked={ companyStatus === '1' ? true : false }
											onChange={handleStatusChange}/>
								</CCol>	
							</CRow>
							<CRow className="g-1 m-1">
								<CCol xs={10}>
									<Link to={`/companies`} className="d-grid justify-content-start">
										<CIcon icon={cilChevronLeft} size="xl"/>
									</Link>
								</CCol>
								
								<CCol xs={2} className="d-grid gap-2 d-md-flex justify-content-md-end">
									<CButton color="primary" type="submit">
										Save
									</CButton>
								</CCol>
							</CRow>
						</CForm>
					</div>
				</CCardBody>
				</CCard>
			</CCol>
			</CRow>
		}
	</>
  )
}

export default CompanyEdit
