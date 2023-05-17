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
import { ProductLeadService } from '../../../services';
import { IProductLead } from '../../../interfaces';
import { Toast } from '../toast/Toast';
import { useKeycloak } from '@react-keycloak/web';

const ProductLeads = () => {
  const navigate = useNavigate()
  const kc = useKeycloak();
  const RESOURCE_ID = 'backend-application-map'

  const ROLE_ADMIN = kc.keycloak.hasResourceRole('product-leads-admin', RESOURCE_ID)
  const ROLE_CREATE = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('product-leads-create', RESOURCE_ID)
  const ROLE_LIST = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('product-leads-list', RESOURCE_ID)
  const ROLE_UPDATE   = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('product-leads-update', RESOURCE_ID)
  const ROLE_DELETE = ROLE_ADMIN ? true : kc.keycloak.hasResourceRole('product-leads-delete', RESOURCE_ID)
  const [productLeadsData, setProductLeadsData] = useState<IProductLead[]>([]);

  const [deleteModalVisible, setDeleteModalVisible] = useState<{open: boolean, id: string}>({open: false, id: ''})
  const [deleteAproved, setDeleteAproved] = useState(false)

  const [toast, setToast] = useState<JSX.Element>(<></>)
  const toaster = useRef<HTMLDivElement>(null)

  useEffect(() => {
	if (ROLE_LIST) {
    	listProductLeads();
	}
  }, []);

  const listProductLeads = async (name?: string) => {
	try {
		let response;
		if (name !== undefined && name !== '') {
			response = await ProductLeadService.findByName(name);
		} else {
			response = await ProductLeadService.getAll();
		} 
		setProductLeadsData(response.data);
	}
	catch (error: any) {
		setToast(Toast( { message: JSON.stringify(error.message) ,color: 'danger'}))
		navigate('/500')
	}
  };

  useEffect(() => {	
	if (deleteAproved && deleteModalVisible.id !== '') {
		ProductLeadService.delete(deleteModalVisible.id)
		 .then((message)=> { 
			setToast(Toast( { message: `Product Lead [${message.data.name}] Deleted Successfully!`,color: 'success'})) })
		 .catch((e) => {
			console.error(e)
			setToast(Toast( {message: 'Something went wrong!',color: 'danger'}))
		 })
		 .finally(() => {
			setDeleteModalVisible({ open: false, id: ''})
			setDeleteAproved(false)
			listProductLeads()
		});
	}
  }, [deleteAproved, deleteModalVisible.id])

  const handleDelete = async (index: number) => {
	if (!deleteAproved) {
		setDeleteModalVisible({ open: true, id: productLeadsData[index]._id || '' });
	}
  }
  
  const handleSearch = async (e: any) => {
	const name = e.target.value
	await listProductLeads(name)
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
				<strong>Product Leads</strong> <small>List of Product Leads</small>
			</CCardHeader>
			<CCardBody>

				{/* search */}
				<CForm className="d-grid column g-3">
					<CRow className="p-1">
						<CCol lg={3} className='pb-3'>
							<CFormInput
								type="text"
								onChange={(event) => handleSearch(event)}
								id="searchProductLeadName"
								label="Search"
								size='sm'
								placeholder='Type to start searching...'
							/>
						</CCol>
						<CCol className="gap-2 d-sm-flex justify-content-end">
							{ ROLE_CREATE && <Link to={`/product-leads-create`} className="d-flex justify-content-start">
								<CIcon icon={cilPlus} size="lg" className='m-1' /> 
								<span>New</span>
							</Link> }
						</CCol>
					</CRow>
				</CForm>

				{/* Deletion Confirmation Modal */}
				<CModal visible={deleteModalVisible.open} onClose={() => setDeleteModalVisible({ open:false, id: ''})}>
					<CModalHeader>
						<CModalTitle>Product Leads</CModalTitle>
					</CModalHeader>
					<CModalBody>Are you sure?</CModalBody>
					<CModalFooter>
						<CButton color="secondary" onClick={() => setDeleteModalVisible({ open: false, id: '' })}>Cancel</CButton>
						<CButton color="danger" onClick={()=> setDeleteAproved(true)}>Delete</CButton>
					</CModalFooter>
				</CModal>

				<CTable hover responsive small>
				<CTableCaption>List of Product Leads</CTableCaption>
				<CTableHead>
					<CTableRow>
					<CTableHeaderCell scope="col" className="w-20">Name</CTableHeaderCell>
					<CTableHeaderCell scope="col" className="w-20">Email</CTableHeaderCell>
					<CTableHeaderCell scope="col" className="w-5">Enabled</CTableHeaderCell>
					<CTableHeaderCell scope="col" className="w-10">Created</CTableHeaderCell>
					<CTableHeaderCell scope="col" className="w-10">Updated</CTableHeaderCell>
					<CTableHeaderCell scope="col"/>
					<CTableHeaderCell scope="col"/>
					</CTableRow>
				</CTableHead>
				<CTableBody>
					{productLeadsData && productLeadsData.map((pl, index) => (
						<CTableRow key={pl._id}>
						<CTableDataCell>{ pl.name }</CTableDataCell>
						<CTableDataCell>{ pl.email }</CTableDataCell>
						<CTableDataCell>
							<CFormSwitch 
								type='checkbox' 
								disabled
								id="pl-status-checkbox" 
								checked={pl.status === '1' ? true : false } />
						</CTableDataCell>
						<CTableDataCell>{ dayjs(pl.createdAt).format('DD/MM/YYYY h:mm:ss A') }</CTableDataCell>
						<CTableDataCell>{ dayjs(pl.updatedAt).format('DD/MM/YYYY h:mm:ss A') }</CTableDataCell>
						<CTableDataCell>
							{ ROLE_UPDATE && <Link to={`/product-leads/${pl._id}`} className="d-grid justify-content-center">
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

export default ProductLeads
