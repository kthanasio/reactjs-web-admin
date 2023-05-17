import React, {useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from "react-router-dom";
import dayjs from 'dayjs';
import {
	CCard,
	CContainer,
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
	CFormInput,
	CFormSwitch,
	CToaster,
	COffcanvas,
	COffcanvasHeader,
	CCloseButton,
	COffcanvasBody,
	COffcanvasTitle,
	CPopover
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilPencil, cilPlus, cilTrash, cilFilter, cilHistory} from '@coreui/icons';
import { Toast } from '../toast/Toast';
import { useKeycloak } from '@react-keycloak/web';
import { IApplication } from '../../../interfaces';
import ApplicationService from '../../../services/Application/ApplicationService';
import keycloak from '../../../Keycloak';

const Applications = () => {
  const navigate = useNavigate()
  const kc = useKeycloak();
  const RESOURCE_ID = 'backend-application-map'

  const ROLE_ADMIN = kc.keycloak.hasResourceRole('application-admin', RESOURCE_ID)
  const ROLE_CREATE = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('application-create', RESOURCE_ID)
  const ROLE_LIST = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('application-list', RESOURCE_ID)
  const ROLE_UPDATE   = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('application-update', RESOURCE_ID)
  const ROLE_DELETE = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('application-delete', RESOURCE_ID)

  const [applicationsData, setApplicationsData] = useState<IApplication[]>([]);

  const [deleteModalVisible, setDeleteModalVisible] = useState<{open: boolean, id: string}>({open: false, id: ''})
  const [deleteAproved, setDeleteAproved] = useState(false)

  const [toast, setToast] = useState<JSX.Element>(<></>)
  const toaster = useRef<HTMLDivElement>(null)

  const [visible, setVisible] = useState(false)

  useEffect(() => {
	listApplications();
  }, []);

  const listApplications = async (name?: string) => {
	try {
		let response;
		if (name !== undefined && name !== '') {
			response = await ApplicationService.findByName(name);
		} else {
			response = await ApplicationService.getAll();
		} 
		setApplicationsData(response.data);
	}
	catch (error: any) {
		setToast(Toast( { message: JSON.stringify(error.message) ,color: 'danger'}))
		navigate('/500')
	}
  };

  useEffect(() => {	
	if (deleteAproved && deleteModalVisible.id !== '') {
		ApplicationService.delete(deleteModalVisible.id)
		 .then((message)=> { 
			setToast(Toast( { message: `Application [${message.data.name}] Deleted Successfully!`,color: 'success'})) })
		 .catch((e) => {
			console.error(e)
			setToast(Toast( {message: 'Something went wrong!',color: 'danger'}))
		 })
		 .finally(() => {
			setDeleteModalVisible({ open: false, id: ''})
			setDeleteAproved(false)
			listApplications()
		});
	}
  }, [deleteAproved, deleteModalVisible.id])

  const handleDelete = async (index: number) => {
	if (!deleteAproved) {
		setDeleteModalVisible({ open: true, id: applicationsData[index]._id || '' });
	}
  }
  
  const handleSearch = async (e: any) => {
	const name = e.target.value
	await listApplications(name)
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
				<strong>Application</strong> <small>List of Application</small>
			</CCardHeader>
			<CCardBody>
				<COffcanvas placement="end" visible={visible} onHide={() => setVisible(false)}>
					<COffcanvasHeader>
						<COffcanvasTitle>Filter</COffcanvasTitle>
						<CCloseButton className="text-reset" onClick={() => setVisible(false)} />
					</COffcanvasHeader>
					<COffcanvasBody>
						<CFormInput
									type="text"
									onChange={(event) => handleSearch(event)}
									id="searchApplicationName"
									label="Search"
									size='sm'
									placeholder='Type to start searching...'
								/>
					</COffcanvasBody>
				</COffcanvas>

				{/* search */}
				{/* className="d-grid column g-3" */}
				<CContainer>
					<CRow className="p-1 align-items-center">
						<CCol xs={6} sm={6} className='pb-3'>
							<CFormInput
								type="text"
								onChange={(event) => handleSearch(event)}
								id="searchApplicationName"
								label="Search"
								size='sm'
								placeholder='Type to start searching...'
							/>
						</CCol>
						<CCol xs={4} sm={4} className="d-sm-flex justify-content-start">
							<CIcon icon={cilFilter} size="lg" className='mt-1' onClick={() => setVisible(true)}/> 
						</CCol>
						<CCol xs={2} sm={2} className="gap-2 d-sm-flex justify-content-end">
							{ ROLE_CREATE && <Link to={`/applications-create`} className="d-flex justify-content-start">
								<CIcon icon={cilPlus} size="lg" className='m-1' /> 
								<span>New</span>
							</Link> }
						</CCol>
					</CRow>
				</CContainer>

				{/* Deletion Confirmation Modal */}
				<CModal visible={deleteModalVisible.open} onClose={() => setDeleteModalVisible({ open:false, id: ''})}>
					<CModalHeader>
						<CModalTitle>Application</CModalTitle>
					</CModalHeader>
					<CModalBody>Are you sure?</CModalBody>
					<CModalFooter>
						<CButton color="secondary" onClick={() => setDeleteModalVisible({ open: false, id: '' })}>Cancel</CButton>
						<CButton color="danger" onClick={()=> setDeleteAproved(true)}>Delete</CButton>
					</CModalFooter>
				</CModal>

				<CTable hover responsive small>
				<CTableCaption>List of Applications</CTableCaption>
				<CTableHead>
					<CTableRow>
					<CTableHeaderCell scope="col" className="w-20">Name</CTableHeaderCell>
					<CTableHeaderCell scope="col" className="w-20">Type</CTableHeaderCell>
					<CTableHeaderCell scope="col" className="w-20">Department</CTableHeaderCell>
					<CTableHeaderCell scope="col" className="w-20">Product Lead</CTableHeaderCell>
					<CTableHeaderCell scope="col" className="w-20">Companies</CTableHeaderCell>
					<CTableHeaderCell scope="col" className="w-5">Enabled</CTableHeaderCell>
					<CTableHeaderCell scope="col"/>
					<CTableHeaderCell scope="col"/>
					<CTableHeaderCell scope="col"/>
					</CTableRow>
				</CTableHead>
				<CTableBody>
					{applicationsData && applicationsData.map((pl, index) => (
						<CTableRow key={pl._id}>
						<CTableDataCell>{ pl.name }</CTableDataCell>
						<CTableDataCell>{ pl.applicationType }</CTableDataCell>
						<CTableDataCell>{ pl.department?.name }</CTableDataCell>
						<CTableDataCell>{ pl.productLead?.name }</CTableDataCell>
						<CTableDataCell>{ pl.companies[0]?.name }</CTableDataCell>
						<CTableDataCell>
							<CFormSwitch 
								type='checkbox' 
								disabled
								id="pl-status-checkbox" 
								checked={pl.status === '1' ? true : false } />
						</CTableDataCell>
						<CTableDataCell>
							<CPopover
								content={
										(
											<>
												<span><strong>Created:</strong> {dayjs(pl.createdAt).format('DD/MM/YY h:mm:ss A')}</span><br />
												<span><strong>User:</strong> {keycloak.tokenParsed?.name}</span><br /><br />
												<span><strong>Updated:</strong> {dayjs(pl.updatedAt).format('DD/MM/YY h:mm:ss A')}</span><br />
												<span><strong>User:</strong> {keycloak.tokenParsed?.name}</span>
											</>
										)
										}
								placement="top"
								trigger='hover'>
								<CIcon icon={cilHistory} size="lg" />
							</CPopover>
							
							
						</CTableDataCell>
						<CTableDataCell>
							{ ROLE_UPDATE && <Link to={`/applications/${pl._id}`} className="d-grid justify-content-center">
								<CIcon icon={cilPencil} size="lg" />
							</Link> }
						</CTableDataCell>
						<CTableDataCell>
							{ ROLE_DELETE && <CIcon className="d-grid justify-content-center" icon={cilTrash} size="lg" onClick={() => handleDelete(index)}/> }
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

export default Applications
