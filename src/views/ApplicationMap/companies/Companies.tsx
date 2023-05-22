import React, {useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom";
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
import { Toast } from '../toast/Toast';

import { useData, useDeleteMutate } from '../../../hooks/Companies';
import { AxiosError } from 'axios';
import { Loader } from '../Loader/Loader';
import { useQueryClient } from '@tanstack/react-query';

const Companies = () => {
  const queryClient = useQueryClient()
  const kc = useKeycloak();
  const RESOURCE_ID = 'backend-application-map'
  
  const ROLE_ADMIN = kc.keycloak.hasResourceRole('company-admin', RESOURCE_ID)
  const ROLE_CREATE = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('company-create', RESOURCE_ID)
  const ROLE_LIST = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('company-list', RESOURCE_ID)
  const ROLE_UPDATE   = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('company-update', RESOURCE_ID)
  const ROLE_DELETE = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('company-delete', RESOURCE_ID)

  const [deleteModalVisible, setDeleteModalVisible] = useState<{open: boolean, id: string}>({open: false, id: ''})

  const [toast, setToast] = useState<JSX.Element>(<></>)
  const toaster = useRef<HTMLDivElement>(null)

  const [nameSearch, setNameSearch] = useState("")

  const { data } = useData(nameSearch)
  const { mutate, isSuccess, isError, error, isLoading } = useDeleteMutate()

  useEffect( () => {
	if (isSuccess) {
		setDeleteModalVisible({ open: false, id: ''})
		setToast(Toast( { message: `Company Deleted Successfully!`,color: 'success'}))
	}
	}, [ isSuccess ])

	useEffect( () => {
		if (isError && error instanceof AxiosError) {
			setToast(Toast( { message: JSON.stringify(error.response?.data.message) ,color: 'danger'}))
		}
	}, [ isError, error ])

  const handleDelete = async (id: string | undefined) => {
	setDeleteModalVisible((prevState) => ({
		...prevState, 
		open: !prevState.open, 
		id: id || '' 
	}));
	
  }
  
  const handleSearch = async (e: any) => {
	e.preventDefault()
	e.stopPropagation()
	const name = e.target.value
	setNameSearch(name)
	// await queryClient.cancelQueries()
	// await queryClient.refetchQueries({ queryKey: ['company-data']})
  }

  return (
	<>
	{ (!ROLE_LIST) && <><span>Permission Required</span></>}
	{ isLoading && <><span><Loader /></span></>}
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
								value={nameSearch}
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
						{/* <small>{deleteModalVisible.id}</small> */}
						<CButton color="secondary" onClick={() => setDeleteModalVisible({ open: false, id: '' })}>Cancel</CButton>
						<CButton color="danger" onClick={() => mutate(deleteModalVisible.id)}>Delete</CButton>
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
					{data && data.map((company, index) => (
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
							{ROLE_DELETE && <CIcon className="d-grid justify-content-center" icon={cilTrash} size="lg" onClick={() => handleDelete(company._id)}/>}
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
