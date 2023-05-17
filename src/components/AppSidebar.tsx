import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CImage, CLink } from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

import SimpleBar from 'simplebar-react'
import '../../node_modules/simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'
import Logo from '../assets/brand/logo-white-on-transparent-background.png'

type ISideBarShow = {
	sidebarShow: boolean
	sidebarUnfoldable: boolean
}
const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state: ISideBarShow) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state: ISideBarShow) => state.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" >
		<CLink href="/#/dashboard">
        	<CImage src={Logo} height={60} alt='Logo'/>
		</CLink>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
