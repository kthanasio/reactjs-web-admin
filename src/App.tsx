import React, { Component, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak"
import './scss/style.scss'
import PrivateRoute from './helpers/PrivateRoute';
import { Loader } from './views/ApplicationMap/Loader/Loader';

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

const Page500 = React.lazy(() => import('./views/pages/page500'))

const loading = (
  <Loader />
)

class App extends Component {
render() {	
	return (
		<div>
			<ReactKeycloakProvider authClient={keycloak} >
      			<BrowserRouter>
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
				</BrowserRouter>
	  		</ReactKeycloakProvider>
	  </div>
    )
  }
}

export default App
