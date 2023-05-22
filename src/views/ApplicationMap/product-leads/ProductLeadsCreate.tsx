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
import { ProductLeadService } from '../../../services';
import { IProductLead } from '../../../interfaces';
import { Link } from 'react-router-dom';
import { Toast } from '../Toast/Toast';
import { useKeycloak } from '@react-keycloak/web';

const ProductLeadsCreate = () => {

	const kc = useKeycloak();
	const RESOURCE_ID = 'backend-application-map'
  
	const ROLE_ADMIN = kc.keycloak.hasResourceRole('product-leads-admin', RESOURCE_ID)
	const ROLE_CREATE = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('product-leads-create', RESOURCE_ID)

	const [toast, setToast] = useState<JSX.Element>(<></>)
  	const toaster = useRef<HTMLDivElement>(null)

	const [productLeadData, setProductLeadData] = useState<IProductLead>({ _id: '',
																name: '',
																email: '',
																status: '1',
																createdAt: undefined,
																updatedAt: undefined,
															});
	
	const [validated, setValidated] = useState(false)
    const [isEnabled, setIsEnabled] = useState(true)

	const handleSubmit = async (event: any) => {
		event.preventDefault()
		event.stopPropagation()
		setValidated(true)
	  await ProductLeadService.create({
		  name: productLeadData.name,
		  email: productLeadData.email,
		  status: productLeadData.status
	  })
	  .then(() => {
		setToast(Toast( { message: 'Product Lead Created Successfully!',color: 'success'}))
		setProductLeadData({ _id: '',
						name: '',
						email: '',
						status: isEnabled ? '1' : '0',
						createdAt: undefined,
						updatedAt: undefined,
						})
		setValidated(false)
		})
	  .catch((e) => { 
			setToast(Toast( { message: e.response.data.message,color: 'danger'}))
		});
	}
  
	const handleNameChange = async (e: any) => {
	  const name = e.target.value;
	  setProductLeadData(prevState => ({
		  ...prevState,
		  name: name
	  }))
	}
	const handleEmailChange = async (e: any) => {
		const email = e.target.value;
		setProductLeadData(prevState => ({
			...prevState,
			email: email
		}))
	  }
	const handleStatusChange = async () => {
		setIsEnabled(current => !isEnabled)
	}
	useEffect(()=> {
		setProductLeadData(prevState => ({
			...prevState,
			status: isEnabled ? '1' : '0'
			}))

	}, [isEnabled])
  
	return (
		<>
		{ !ROLE_CREATE && <><span>Permission Required</span></>}
		{ !!ROLE_CREATE &&
		<CRow>
			<CCol xs={12}>
			<CCard className="mb-4">
			<CToaster ref={toaster} push={toast} placement="top-end" />
				<CCardHeader>
				<strong>Product Leads</strong> <small>Create</small>
				</CCardHeader>
				<CCardBody>
					<CForm
						className="column g-1 needs-validation"
						validated={validated}
						onSubmit={handleSubmit}>
						<CRow className="d-grid p-1">
							<CCol md={12} className='mb-3'>
								<CFormInput
									type="text"
									value={ productLeadData.name }
									onChange={handleNameChange}
									id="productLeadName"
									label="Name"
									required
								/>
								<CFormFeedback invalid>Name is required.</CFormFeedback>
							</CCol>
							<CCol md={12} className='mb-3'>
								<CFormInput
									type="email"
									value={ productLeadData.email }
									onChange={handleEmailChange}
									id="productLeadEmail"
									label="Email"
									required
								/>
								<CFormFeedback invalid>Email is required.</CFormFeedback>
							</CCol>
							<CCol md={12}>
								<CFormSwitch 
										label="Enabled" 
										type='checkbox' 
										id="product-lead-status-checkbox" 
										value={productLeadData.status} 
										defaultChecked 
										onClick={handleStatusChange}/>
							</CCol>	
						</CRow>
						<CRow className="g-1 m-1">
							<CCol xs={10}>
								<Link to={`/product-leads`} className="d-grid justify-content-start">
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
		</CRow>}
		</>
	)
}

export default ProductLeadsCreate
