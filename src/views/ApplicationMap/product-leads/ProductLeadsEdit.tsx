import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChevronLeft } from '@coreui/icons'

import { ProductLeadService } from '../../../services'
import { Toast } from '../toast/Toast'
import { useKeycloak } from '@react-keycloak/web'

const ProductLeadEdit = () => {
  const kc = useKeycloak()
  const RESOURCE_ID = 'backend-application-map'

  const ROLE_ADMIN = kc.keycloak.hasResourceRole(
    'product-leads-admin',
    RESOURCE_ID,
  )
  const ROLE_UPDATE = ROLE_ADMIN
    ? true
    : kc.keycloak.hasResourceRole('product-leads-update', RESOURCE_ID)
  const [toast, setToast] = useState<JSX.Element>(<></>)
  const toaster = useRef<HTMLDivElement>(null)
  const params = useParams()
  const [productLeadData, setProductLeadData] = useState({
    _id: '',
    name: '',
    email: '',
    status: '',
  })
  useEffect(() => {
	if (ROLE_UPDATE) {
    	getProductLead(params?.id?.split('&')[0] || '')
	}
  }, [params.id, ROLE_UPDATE])

  const getProductLead = async (id: string) => {
    const response = await ProductLeadService.get(id)
	const { _id = '', name, email, status} = response.data
    setProductLeadData({
		_id,
		name,
		email,
		status
	})
  }

  const [validated, setValidated] = useState(false)
  const handleSubmit = async (event: any) => {
    event.preventDefault()
    event.stopPropagation()
    setValidated(true)
    await ProductLeadService.update(params?.id || '', {
      name: productLeadData.name,
      email: productLeadData.email,
      status: productLeadData.status,
    })
      .then(() => {
        setToast(
          Toast({
            message: 'Product Lead Updated Successfully!',
            color: 'success',
          }),
        )
      })
      .catch((e) => {
        setToast(Toast({ message: e.response.data.message, color: 'danger' }))
      })
    setValidated(false)
    // navigate("/companies")
  }

  const handleNameChange = async (e: any) => {
    const name = e.target.value
    setProductLeadData((prevState) => ({
      ...prevState,
      name: name,
    }))
  }
  const handleEmailChange = async (e: any) => {
    const email = e.target.value
    setProductLeadData((prevState) => ({
      ...prevState,
      email: email,
    }))
  }
  const [isEnabled, setIsEnabled] = useState(false)
  useEffect(() => {
    setProductLeadData((prevState) => ({
      ...prevState,
      status: isEnabled ? '1' : '0',
    }))
  }, [isEnabled])

  const handleStatusChange = async () => {
    setIsEnabled((cur) => !isEnabled)
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
				<strong>Product Lead</strong> <small>Edit</small>
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
						value={productLeadData.name}
						onChange={handleNameChange}
						id="productLeadName"
						label="Name"
						required
						/>
					</CCol>
					<CCol md={12} className="mb-3">
						<CFormInput
						type="email"
						value={productLeadData.email}
						onChange={handleEmailChange}
						id="productLeadEmail"
						label="Email"
						required
						/>
					</CCol>
					<CCol md={2}>
						<CFormSwitch
						label="Enabled"
						type="checkbox"
						id="product-lead-status-checkbox"
						value={productLeadData.status}
						checked={productLeadData.status === '1' ? true : false}
						onChange={() => handleStatusChange()}
						/>
					</CCol>
					</CRow>
					<CRow className="g-1 m-1">
					<CCol xs={10}>
						<Link
						to={`/product-leads`}
						className="d-grid justify-content-start"
						>
						<CIcon icon={cilChevronLeft} size="xl" />
						</Link>
					</CCol>

					<CCol
						xs={2}
						className="d-grid gap-2 d-md-flex justify-content-md-end"
					>
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
		</CRow>}
		</>
  )
}

export default ProductLeadEdit
