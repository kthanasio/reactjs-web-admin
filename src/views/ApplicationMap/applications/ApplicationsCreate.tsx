
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
	CFormFeedback,
	CFormSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilChevronLeft } from '@coreui/icons';
import { IApplication } from '../../../interfaces';
import { Link } from 'react-router-dom';
import { Toast } from '../Toast/Toast';
import { useKeycloak } from '@react-keycloak/web';
import ApplicationService from '../../../services/Application/ApplicationService';

const ApplicationsCreate = () => {
	const initialState: IApplication =	{ 
											_id: '',
											name: '',
											applicationType: '',
											status: '1',
											productLead: { _id: '' },
											department: { _id: '' },
											companies: [{ _id: '' }],
											createdAt: undefined,
											updatedAt: undefined,
										}

	const [productLeads, setProductLeads] = useState([{ _id: '', name: ''}])
	const [departments, setDepartments] = useState([{ _id: '', name: ''}])
	const [companies, setCompanies] = useState([{ _id: '', name: ''}])

	const kc = useKeycloak();
	const RESOURCE_ID = 'backend-application-map';
	const ROLE_ADMIN = kc.keycloak.hasResourceRole('application-admin', RESOURCE_ID)
	const ROLE_CREATE = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('application-create', RESOURCE_ID)

	const [toast, setToast] = useState<JSX.Element>(<></>)
  	const toaster = useRef<HTMLDivElement>(null)

	const [applicationsData, setApplicationsData] = useState<IApplication>(initialState);
	
	const [validated, setValidated] = useState(false)
    const [isEnabled, setIsEnabled] = useState(true)

	useEffect(()=>{
		listDepartments()
		listProductLeads()
		listCompanies()
	},[])

	const listDepartments = async () => {
		return ApplicationService.getDepartments()
				.then((response) => {
							const result: any = []
							response.data.forEach((dep) => {
								result.push({
									_id: dep._id,
									name: dep.name
								})
							})
							setDepartments(result)
						})
	}

	const listProductLeads = async () => {
		return ApplicationService.getProductLeads()
				.then((response) => {
							const result: any = []
							response.data.forEach((pl) => {
								result.push({
									_id: pl._id,
									name: pl.name
								})
							})
			setProductLeads(result)
		})
	}

	const listCompanies = async () => {
		return await ApplicationService.getCompanies()
		.then((response) => {
			const result: any = []
			response.data.forEach((co) => {
				result.push({
					_id: co._id,
					name: co.name
				})
			})
			setCompanies(result)
		})
	}

	const handleSubmit = async (event: any) => {
		event.preventDefault()
		event.stopPropagation()
		setValidated(true)
		await ApplicationService.create(
			{
				name: applicationsData.name,
				applicationType: applicationsData.applicationType,
				status: applicationsData.status,
				department: { _id: applicationsData.department._id },
				productLead: { _id: applicationsData.productLead._id},
				companies: [ { _id: applicationsData.companies[0]._id }]
			})
			.then(() => {
				setToast(Toast( { message: 'Application Created Successfully!',color: 'success'}))
				setApplicationsData(initialState)
				setValidated(false)
				})
			.catch((e) => { 
					setToast(Toast( { message: e.response.data.message,color: 'danger'}))
					setValidated(false)
				});
	}
  
	const handleNameChange = async (e: any) => {
	  const name = e.target.value;
	  setApplicationsData(prevState => ({
		  ...prevState,
		  name: name
	  }))
	}
	const handleApplicationTypeChange = async (e: any) => {
		const applicationType = e.target.value;
		setApplicationsData(prevState => ({
			...prevState,
			applicationType: applicationType
		}))
	}
	const handleDepartmentChange = async (e: any) => {
		const department = e.target.value;
		setApplicationsData(prevState => ({
			...prevState,
			department: { _id: department }
		}))
	}
	const handleProductLeadChange = async (e: any) => {
		const productLead = e.target.value;
		setApplicationsData(prevState => ({
			...prevState,
			productLead: { _id: productLead }
		}))
	}
	const handleCompanyChange = async (e: any) => {
		const company = e.target.value;
		setApplicationsData(prevState => ({
			...prevState,
			companies: [{ _id: company }]
		}))
	}
	const handleStatusChange = async () => {
		setIsEnabled(!isEnabled)
	}
	useEffect(()=> {
		setApplicationsData(prevState => ({
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
					<strong>Application</strong> <small>Create</small>
				</CCardHeader>
				<CCardBody>
					<CForm
						className="column g-1 needs-validation"
						validated={validated}
						onSubmit={handleSubmit}>
						<CRow className="d-flex p-1">
							<CCol md={8} className='mb-3'>
								<CFormInput
									type="text"
									value={ applicationsData.name }
									onChange={handleNameChange}
									id="applicationName"
									label="Name"
									required
								/>
								<CFormFeedback invalid>Name is required.</CFormFeedback>
							</CCol>
							<CCol md={4} className='mb-3'>
								<CFormSelect 
											id="typeCreate" 
											label="Type"
											value={ applicationsData.applicationType }
											onChange={handleApplicationTypeChange}
											required
											>
									<option selected>Select...</option>
									<option value={"TOOLS"}>Tools</option>
									<option value={"PARTNERS"}>Partners</option>
									<option value={"PRODUCT"}>Products</option>
								</CFormSelect>
								<CFormFeedback invalid>Type is required.</CFormFeedback>
							</CCol>
						</CRow>
						<CRow className="d-flex p-1">
							<CCol md={4} className='mb-3'>
								<CFormSelect 
											id="departaments" 
											label="Departmet"
											value={ applicationsData.department._id }
											onChange={handleDepartmentChange}
											required
											>
									<option selected>Select...</option>
									{ departments && departments.map( (dep) =>
										(<option value={dep._id}>{dep.name}</option>)
									) }
								</CFormSelect>
								<CFormFeedback invalid>Department is required.</CFormFeedback>
							</CCol>
							<CCol md={4} className='mb-3'>
								<CFormSelect 
											id="productLeadName" 
											label="Product Lead"
											value={ applicationsData.productLead._id }
											onChange={handleProductLeadChange}
											required
											>
									<option selected>Select...</option>
									{ productLeads && productLeads.map( (pl) =>
										(<option value={pl._id}>{pl.name}</option>)
									) }
								</CFormSelect>
								<CFormFeedback invalid>Product Lead is required.</CFormFeedback>
							</CCol>
							<CCol md={4} className='mb-3'>
								<CFormSelect 
											id="companies" 
											label="Companies"
											value={ applicationsData.companies[0]._id }
											onChange={handleCompanyChange}
											required
											>
									<option selected>Select...</option>
									{ companies && companies.map( (c) =>
										(<option value={c._id}>{c.name}</option>)
									) }
								</CFormSelect>
								<CFormFeedback invalid>Company is required.</CFormFeedback>
							</CCol>
							<CCol md={4}>
								<CFormSwitch 
										label="Enabled" 
										type='checkbox' 
										id="application-status-checkbox" 
										value={applicationsData.status} 
										defaultChecked 
										onClick={handleStatusChange}/>
							</CCol>
						</CRow>
						<CRow className="g-1 m-1">
							<CCol xs={10}>
								<Link to={`/applications`} className="d-grid justify-content-start">
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

export default ApplicationsCreate
