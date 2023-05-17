import React from "react"
import { CToast, CToastBody, CToastClose } from "@coreui/react"

type IProps = {
	message: string
	color: string
	}
	
export const Toast = (props: IProps) => { 
	return (
    		<CToast autohide={true} color={props.color} className="text-white align-items-center">
				<div className="d-flex">
					<CToastBody>{props.message}</CToastBody>
					<CToastClose className="me-2 m-auto" white />
				</div>
			</CToast>
			)
}
