import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak"
import { CSpinner } from '@coreui/react';
import './scss/style.scss'
import PrivateRoute from './helpers/PrivateRoute';

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

const Page500 = React.lazy(() => import('./views/pages/page500'))

const loading = (
  <CSpinner color="primary"/>
)

class App extends Component {
render() {	
	return (
		<div>
			<ReactKeycloakProvider authClient={keycloak} >
      			<HashRouter>
					<Suspense fallback={loading}>
						<Routes>
							<Route path="/500" element={<Page500 />} />
							<Route path="*"
							       element={
											<PrivateRoute>
												<DefaultLayout />
											</PrivateRoute>
											} />
						</Routes>
					</Suspense>
      			</HashRouter>
	  		</ReactKeycloakProvider>
	  </div>
    )
  }
}

export default App
