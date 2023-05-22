import React, {useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from "react-router-dom";
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
import { DepartmentService } from '../../../services';
import { IDepartment } from '../../../interfaces';
import { Toast } from '../toast/Toast';
import { useKeycloak } from '@react-keycloak/web';

const Departments = () => {
  const navigate = useNavigate()
  const kc = useKeycloak();
  const RESOURCE_ID = 'backend-application-map'

  const ROLE_ADMIN = kc.keycloak.hasResourceRole('department-admin', RESOURCE_ID)
  const ROLE_CREATE = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('department-create', RESOURCE_ID)
  const ROLE_LIST = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('department-list', RESOURCE_ID)
  const ROLE_UPDATE   = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('department-update', RESOURCE_ID)
  const ROLE_DELETE = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('department-delete', RESOURCE_ID)
  
  const [departmentsData, setDepartmentsData] = useState<IDepartment[]>([]);

  const [deleteModalVisible, setDeleteModalVisible] = useState<{open: boolean, id: string}>({open: false, id: ''})
  const [deleteAproved, setDeleteAproved] = useState(false)

  const [toast, setToast] = useState<JSX.Element>(<></>)
  const toaster = useRef<HTMLDivElement>(null)

  useEffect(() => {
	if (ROLE_LIST) {
    	listDepartments();
	}
  }, []);

  const listDepartments = async (name?: string) => {
	try {
		let response;
		if (name !== undefined && name !== '') {
			response = await DepartmentService.findByName(name);
		} else {
			response = await DepartmentService.getAll();
		} 
		setDepartmentsData(response.data);
	} catch (error: any) {
		setToast(Toast( { message: JSON.stringify(error.message) ,color: 'danger'}))
		// navigate('/500')
	}
  };

  useEffect(() => {	
	if (deleteAproved && deleteModalVisible.id !== '') {
		DepartmentService.delete(deleteModalVisible.id)
		 .then((message)=> { 
			setToast(Toast( { message: `Department [${message.data.name}] Deleted Successfully!`,color: 'success'})) })
		 .catch((e) => {
			console.error(e)
			setToast(Toast( {message: 'Something went wrong!',color: 'danger'}))
		 })
		 .finally(() => {
			setDeleteModalVisible({ open: false, id: ''})
			setDeleteAproved(false)
			listDepartments()
		});
	}
  }, [deleteAproved, deleteModalVisible.id])

  const handleDelete = async (index: number) => {
	if (!deleteAproved) {
		setDeleteModalVisible({ open: true, id: departmentsData[index]._id || '' });
	}
  }
  
  const handleSearch = async (e: any) => {
	const name = e.target.value
	await listDepartments(name)
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
				<strong>Departments</strong> <small>List of Departments</small>
			</CCardHeader>
			<CCardBody>

				{/* search */}
				<CForm className="d-grid column g-3">
					<CRow className="p-1">
						<CCol lg={3} className='pb-3'>
							<CFormInput
								type="text"
								onChange={(event) => handleSearch(event)}
								id="searchDepartmentName"
								label="Search"
								size='sm'
								placeholder='Type to start searching...'
							/>
						</CCol>
						{ ROLE_CREATE && <CCol className="gap-2 d-sm-flex justify-content-end">
							<Link to={`/departments-create`} className="d-flex justify-content-start">
								<CIcon icon={cilPlus} size="lg" className='m-1' /> 
								<span>New</span>
							</Link>
						</CCol>}
					</CRow>
				</CForm>

				{/* Deletion Confirmation Modal */}
				<CModal visible={deleteModalVisible.open} onClose={() => setDeleteModalVisible({ open:false, id: ''})}>
					<CModalHeader>
						<CModalTitle>Department</CModalTitle>
					</CModalHeader>
					<CModalBody>Are you sure?</CModalBody>
					<CModalFooter>
						<CButton color="secondary" onClick={() => setDeleteModalVisible({ open: false, id: '' })}>Cancel</CButton>
						<CButton color="danger" onClick={()=> setDeleteAproved(true)}>Delete</CButton>
					</CModalFooter>
				</CModal>

				<CTable hover responsive small>
				<CTableCaption>List of Departments</CTableCaption>
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
					{departmentsData && departmentsData.map((dep, index) => (
						<CTableRow key={dep._id}>
						<CTableDataCell>{ dep.name }</CTableDataCell>
						<CTableDataCell>
							<CFormSwitch 
								type='checkbox' 
								disabled
								id="dep-status-checkbox" 
								checked={dep.status === '1' ? true : false } />
						</CTableDataCell>
						<CTableDataCell>{ dayjs(dep.createdAt).format('DD/MM/YYYY h:mm:ss A') }</CTableDataCell>
						<CTableDataCell>{ dayjs(dep.updatedAt).format('DD/MM/YYYY h:mm:ss A') }</CTableDataCell>
						<CTableDataCell>
							{ ROLE_UPDATE && <Link to={`/departments/${dep._id}`} className="d-grid justify-content-center">
								<CIcon icon={cilPencil} size="lg" />
							</Link>}
						</CTableDataCell>
						<CTableDataCell>
							{ ROLE_DELETE && <CIcon className="d-grid justify-content-center" icon={cilTrash} size="lg" onClick={() => handleDelete(index)}/>}
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

export default Departments
