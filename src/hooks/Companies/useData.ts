import { CompanyService } from "../../services";
import { ICompany } from "../../interfaces";
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from "axios";

const fetchData = async (name?: string): Promise<AxiosResponse<ICompany[]>> => {
	let response;
	if (name !== undefined && name !== '') {
		response = await CompanyService.findByName(name);
	} else {
		response = await CompanyService.getAll();
	} 
	return response;
  };

export function useData (name?: string) {
	const query = useQuery({ 
		queryKey: ['company-data', name], 
		queryFn: () => fetchData(name)})

	return {
		...query,
		data: query.data?.data
	}

}

