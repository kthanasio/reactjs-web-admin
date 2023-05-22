import React, {useEffect, useRef, useState} from 'react'
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
	CToaster,
	CFormFeedback
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilChevronLeft } from '@coreui/icons';
import { ICompany } from '../../../interfaces';
import { Link } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useCreateMutate } from '../../../hooks/Companies/useCreateMutate';
import { Toast } from '../Toast/Toast';
import { AxiosError } from 'axios';
import { Loader } from '../Loader/Loader';

const CompanyCreate = () => {
	const kc = useKeycloak();
	const RESOURCE_ID = 'backend-application-map'
	const ROLE_ADMIN = kc.keycloak.hasResourceRole('company-admin', RESOURCE_ID)
	const ROLE_CREATE = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('company-create', RESOURCE_ID)

	const [toast, setToast] = useState<JSX.Element>(<></>)
  	const toaster = useRef<HTMLDivElement>(null)

	const [companyName, setCompanyName] = useState('');
	const [companyStatus, setCompanyStatus] = useState('1');
	
	const [isEnabled, setIsEnabled] = useState(true)

	const { mutate, isSuccess, isError, isLoading, error } = useCreateMutate()

	const handleSubmit = async (event: any) => {
		event.preventDefault()
		const company: ICompany = {
			name: companyName,
			status: companyStatus
		}
		mutate(company)
	}

	useEffect( () => {
		if (isSuccess) {
			setToast(Toast( { message: 'Company Created Successfully!',color: 'success'}))
		}
	}, [ isSuccess ])

	useEffect( () => {
		if (isError && error instanceof AxiosError) {
			setToast(Toast( { message: JSON.stringify(error.response?.data.message) ,color: 'danger'}))
		}
	}, [ isError, error ])
  
	const handleStatusChange = async () => {
		setIsEnabled(current => !isEnabled)
	}
	
	useEffect(()=> {
		setCompanyStatus(() => { return isEnabled ? '1' : '0' })
	}, [isEnabled])
  
	return (
	<>
		{ !ROLE_CREATE && <><span>Permission Required</span></>}
		{ isLoading && <><span><Loader /></span></>}
		{ !!ROLE_CREATE &&
		<CRow>
			<CCol xs={12}>
			<CCard className="mb-4">
			<CToaster ref={toaster} push={toast} placement="top-end" />
				<CCardHeader>
				<strong>Company</strong> <small>Create</small>
				</CCardHeader>
				<CCardBody>
					<CForm
						className="column g-1 needs-validation"
						onSubmit={handleSubmit}>
						<CRow className="d-grid p-1">
							<CCol md={12} className='mb-3'>
								<CFormInput
									type="text"
									value={ companyName }
									onChange={ (e) => setCompanyName(e.target.value)}
									id="companyName"
									label="Name"
									required
								/>
								<CFormFeedback invalid>Name is required.</CFormFeedback>
							</CCol>
							<CCol md={2}>
								<CFormSwitch 
										label="Enabled" 
										type='checkbox' 
										id="company-status-checkbox" 
										value={companyStatus} 
										defaultChecked 
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
								<CButton 
										color="primary" 
										type="submit" >
									Save
								</CButton>
							</CCol>
						</CRow>
					</CForm>
				</CCardBody>
			</CCard>
			</CCol>
		</CRow>
		}
	</>
	)
}

export default CompanyCreate
