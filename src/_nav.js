import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilApplications,
  cilSettings,
  cilBuilding,
  cilContact,
  cilSitemap,
} from '@coreui/icons'
import { CNavGroup, CNavItem,  } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Applications',
    to: '/applications',
    icon: <CIcon icon={cilApplications} customClassName="nav-icon" />
  },
  {
    component: CNavGroup,
    name: 'Settings',
    to: '/base',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Companies',
        to: '/companies',
		icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />
      },
	  {
        component: CNavItem,
        name: 'Product Leads',
        to: '/product-leads',
		icon: <CIcon icon={cilContact} customClassName="nav-icon" />
      },
	  {
        component: CNavItem,
        name: 'Departments',
        to: '/departments',
		icon: <CIcon icon={cilSitemap} customClassName="nav-icon" />
      }
	]
}
]

export default _nav
