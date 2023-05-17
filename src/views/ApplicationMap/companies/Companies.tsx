import React, {useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useKeycloak } from '@react-keycloak/web';
import dayjs from 'dayjs';
import {
	CCard,
	CCardBody,
	CCardHeader,
	CCol,
	CRow,
	CTable,
	CTableCaption,
	CTableBody,
	CTableDataCell,
	CTableHead,
	CTableHeaderCell,
	CTableRow,
	CButton,
	CModal,
	CModalHeader,
	CModalTitle,
	CModalBody,
	CModalFooter,
	CForm,
	CFormInput,
	CFormSwitch,
	CToaster,
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilPencil, cilPlus, cilTrash} from '@coreui/icons';
import { CompanyService } from '../../../services';
import { ICompany } from '../../../interfaces';
import { Toast } from '../toast/Toast';

const Companies = () => {
  const navigate = useNavigate()
  const kc = useKeycloak();
  const RESOURCE_ID = 'backend-application-map'
  
  const ROLE_ADMIN = kc.keycloak.hasResourceRole('company-admin', RESOURCE_ID)
  const ROLE_CREATE = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('company-create', RESOURCE_ID)
  const ROLE_LIST = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('company-list', RESOURCE_ID)
  const ROLE_UPDATE   = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('company-update', RESOURCE_ID)
  const ROLE_DELETE = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('company-delete', RESOURCE_ID)

  const [companiesData, setCompaniesData] = useState<ICompany[]>([]);

  const [deleteModalVisible, setDeleteModalVisible] = useState<{open: boolean, id: string}>({open: false, id: ''})
  const [deleteAproved, setDeleteAproved] = useState(false)

  const [toast, setToast] = useState<JSX.Element>(<></>)
  const toaster = useRef<HTMLDivElement>(null)

  useEffect(() => {
	if (ROLE_LIST) {
    	listCompanies();
	}
  }, []);

  const listCompanies = async (name?: string) => {
	try {
		let response;
		if (name !== undefined && name !== '') {
			response = await CompanyService.findByName(name);
		} else {
			response = await CompanyService.getAll();
		} 
		setCompaniesData(response.data);
	} catch (error: any) {
		setToast(Toast( { message: JSON.stringify(error.message) ,color: 'danger'}))
		setInterval(() => navigate('/500'), 3000) 
	}
  };

  useEffect(() => {	
	if (deleteAproved && deleteModalVisible.id !== '') {
		CompanyService.delete(deleteModalVisible.id)
		 .then((message)=> { 
			setToast(Toast( { message: `Company [${message.data.name}] Deleted Successfully!`,color: 'success'})) })
		 .catch((e) => {
			console.error(e)
			setToast(Toast( {message: 'Something went wrong!',color: 'danger'}))
		 })
		 .finally(() => {
			setDeleteModalVisible({ open: false, id: ''})
			setDeleteAproved(false)
			listCompanies()
		});
	}
  }, [deleteAproved, deleteModalVisible.id])

  const handleDelete = async (index: number) => {
	if (!deleteAproved) {
		setDeleteModalVisible({ open: true, id: companiesData[index]._id || '' });
	}
  }
  
  const handleSearch = async (e: any) => {
	const name = e.target.value
	await listCompanies(name)
  }

  return (
	<>
	{ (!ROLE_LIST) && <><span>Permission Required</span></>}
	{ ROLE_LIST &&
		<CRow>
		<CCol md={12}>
			<CCard className="mb-4">
			<CToaster ref={toaster} push={toast} placement="top-end" />
			<CCardHeader>
				<strong>Companies</strong> <small>List of Companies</small>
			</CCardHeader>
			<CCardBody>

				{/* search */}
				<CForm className="d-grid column g-3">
					<CRow className="p-1">
						<CCol lg={3} className='pb-3'>
							<CFormInput
								type="text"
								onChange={(event) => handleSearch(event)}
								id="searchCompanyName"
								label="Search"
								size='sm'
								placeholder='Type to start searching...'
							/>
						</CCol>
						{ ROLE_CREATE && <CCol className="gap-2 d-sm-flex justify-content-end">
							<Link to={`/companies-create`} className="d-flex justify-content-start">
								<CIcon icon={cilPlus} size="lg" className='m-1' /> 
								<span>New</span>
							</Link>
						</CCol>}
					</CRow>
				</CForm>

				{/* Deletion Confirmation Modal */}
				<CModal visible={deleteModalVisible.open} onClose={() => setDeleteModalVisible({ open:false, id: ''})}>
					<CModalHeader>
						<CModalTitle>Company</CModalTitle>
					</CModalHeader>
					<CModalBody>Are you sure?</CModalBody>
					<CModalFooter>
						<CButton color="secondary" onClick={() => setDeleteModalVisible({ open: false, id: '' })}>Cancel</CButton>
						<CButton color="danger" onClick={()=> setDeleteAproved(true)}>Delete</CButton>
					</CModalFooter>
				</CModal>

				<CTable hover responsive small>
				<CTableCaption>List of Companies</CTableCaption>
				<CTableHead>
					<CTableRow>
					<CTableHeaderCell scope="col" className="w-50">Name</CTableHeaderCell>
					<CTableHeaderCell scope="col" className="w-5">Enabled</CTableHeaderCell>
					<CTableHeaderCell scope="col" className="w-10">Created</CTableHeaderCell>
					<CTableHeaderCell scope="col" className="w-10">Updated</CTableHeaderCell>
					<CTableHeaderCell scope="col"/>
					<CTableHeaderCell scope="col"/>
					</CTableRow>
				</CTableHead>
				<CTableBody>
					{companiesData && companiesData.map((company, index) => (
						<CTableRow key={company._id}>
						<CTableDataCell>{ company.name }</CTableDataCell>
						<CTableDataCell>
							<CFormSwitch 
								type='checkbox' 
								disabled
								id="company-status-checkbox" 
								checked={company.status === '1' ? true : false } />
						</CTableDataCell>
						<CTableDataCell>{ dayjs(company.createdAt).format('DD/MM/YYYY h:mm:ss A') }</CTableDataCell>
						<CTableDataCell>{ dayjs(company.updatedAt).format('DD/MM/YYYY h:mm:ss A') }</CTableDataCell>
						<CTableDataCell>
							{ROLE_UPDATE && <Link to={`/companies/${company._id}`} className="d-grid justify-content-center">
								<CIcon icon={cilPencil} size="lg" />
							</Link>}
						</CTableDataCell>
						<CTableDataCell>
							{ROLE_DELETE && <CIcon className="d-grid justify-content-center" icon={cilTrash} size="lg" onClick={() => handleDelete(index)}/>}
						</CTableDataCell>
					</CTableRow>
					))}
				</CTableBody>
				</CTable>
			</CCardBody>
			</CCard>
		</CCol>
		</CRow>
	}
	</>
  )
}

export default Companies
