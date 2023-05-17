export default interface IApplication {
	_id?: string
	name: string
	status: string
	productLead: { _id: string, name?: string}
	department: { _id: string, name?: string}
	companies: [{ _id: string, name?: string}]
	applicationType: string
	createdAt?: Date
	updatedAt?: Date
}
