import React, {useState, useEffect, useRef} from 'react'
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

import { DepartmentService } from '../../../services';
import { Toast } from '../toast/Toast';
import { useKeycloak } from '@react-keycloak/web';

const DepartmentEdit = () => {
  const kc = useKeycloak();
  const RESOURCE_ID = 'backend-application-map'
  
  const ROLE_ADMIN = kc.keycloak.hasResourceRole('department-admin', RESOURCE_ID)
  const ROLE_UPDATE = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('department-update', RESOURCE_ID)
  
  const [toast, setToast] = useState<JSX.Element>(<></>)
  const toaster = useRef<HTMLDivElement>(null)
  const params = useParams()
  const [departmentData, setDepartmentData] = useState({ _id: '',
														name: '',
														status: ''
														});
  useEffect(() => {
	if (ROLE_UPDATE) {
		getDepartment(params?.id?.split('&')[0] || '');
	}
  }, [ params.id ]);

  const getDepartment = async (id: string) => {
	DepartmentService.get(id)
	.then((response) => {
		const { _id = '', name, status } = response.data
		setDepartmentData({
			_id,
			name,
			status,
		})
	})
  };

  const [validated, setValidated] = useState(false)
  const handleSubmit = async (event: any) => {
      event.preventDefault()
      event.stopPropagation()
    setValidated(true)
	await DepartmentService.update(params?.id || '', {
		name: departmentData.name,
		status: departmentData.status
	})
	.then( ()=> {
		setToast(Toast( { message: 'Department Updated Successfully!',color: 'success'}))
	} )
	.catch((e) => { 
		setToast(Toast( { message: e.response.data.message,color: 'danger'}))
	});
	setValidated(false)
	// navigate("/companies")
  }

  const handleNameChange = async (e: any) => {
	const name = e.target.value;
	setDepartmentData(prevState => ({
		...prevState,
		name: name
	}))
  }
  const [isEnabled, setIsEnabled] = useState(false)
  useEffect(()=> {
	setDepartmentData(prevState => ({
		...prevState,
		status: isEnabled ? '1' : '0'
		}))

	}, [isEnabled])
	
	const handleStatusChange = async () => {
		setIsEnabled(cur => !isEnabled)
	}

  return (
	<>
		{ (!ROLE_UPDATE) && <><span>Permission Required</span></>}
		{ ROLE_UPDATE &&
			<CRow>
			<CCol xs={12}>
				<CCard className="mb-4">
				<CToaster ref={toaster} push={toast} placement="top-end" />
				<CCardHeader>
					<strong>Department</strong> <small>Edit</small>
				</CCardHeader>
				<CCardBody>
					<div>
						<CForm
							className="column g-3 needs-validation"
							noValidate
							validated={validated}
							onSubmit={handleSubmit}
						>
							<CRow className="d-grid p-1">
								<CCol md={12} className="mb-3">
									<CFormInput
										type="text"
										value={ departmentData.name }
										onChange={handleNameChange}
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
											value={departmentData.status} 
											checked={departmentData.status === '1' ? true : false}
											onChange={()=> handleStatusChange()}/>
								</CCol>	
							</CRow>
							<CRow className="g-1 m-1">
								<CCol xs={10}>
									<Link to={`/departments`} className="d-grid justify-content-start">
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

export default DepartmentEdit
