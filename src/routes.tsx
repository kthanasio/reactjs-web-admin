import React from 'react'

const Dashboard = React.lazy(() => import('./views/ApplicationMap/dashboard/Dashboard'))
const Applications = React.lazy(()=> import('./views/ApplicationMap/applications/Applications'))
const Companies = React.lazy(() => import('./views/ApplicationMap/companies/Companies'))
const CompanyCreate = React.lazy(()=> import('./views/ApplicationMap/companies/CompanyCreate'))
const CompanyEdit = React.lazy(() => import('./views/ApplicationMap/companies/CompanyEdit'))
const Departments = React.lazy(() => import('./views/ApplicationMap/departments/Departments'))
const DepartmentCreate = React.lazy(()=> import('./views/ApplicationMap/departments/DepartmentCreate'))
const DepartmentEdit = React.lazy(() => import('./views/ApplicationMap/departments/DepartmentEdit'))
const ProductLeads = React.lazy(()=> import('./views/ApplicationMap/product-leads/ProductLeads'))
const ProductLeadsCreate = React.lazy(()=> import('./views/ApplicationMap/product-leads/ProductLeadsCreate'))
const ProductLeadsEdit = React.lazy(()=> import('./views/ApplicationMap/product-leads/ProductLeadsEdit'))
const ApplicationsCreate = React.lazy(() => import('./views/ApplicationMap/applications/ApplicationsCreate'))

const routes = [
  { path: '/', exact: true, name: 'Home', element: ''},
  
  { path: '/applications', name: 'Applications', element: Applications },
  { path: '/applications-create', name: 'Applications Create', element: ApplicationsCreate },

  { path: '/companies', name: 'Companies', element: Companies },
  { path: '/companies-create', name: 'Companies Create', element: CompanyCreate },
  { path: '/companies/:id', name: 'Company Edit', element: CompanyEdit },
 
  { path: '/departments', name: 'Departments', element: Departments },
  { path: '/departments-create', name: 'Departments Create', element: DepartmentCreate },
  { path: '/departments/:id', name: 'Departments Edit', element: DepartmentEdit },
 
  { path: '/product-leads', name: 'Product Leads', element: ProductLeads },
  { path: '/product-leads-create', name: 'Product Lead Create', element: ProductLeadsCreate },
  { path: '/product-leads/:id', name: 'Product Lead Edit', element: ProductLeadsEdit },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
]

export default routes
