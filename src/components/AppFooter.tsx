import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
	  	<span className="ms-1">&copy; 2023 <a href="https://github.com/kthanasio" target="_blank" rel="noopener noreferrer">
          Kleber Thanasio</a>.
		</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
