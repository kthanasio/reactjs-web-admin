import { CompanyService } from "../../services";
import { ICompany } from "../../interfaces";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from "axios";

const putData = async ({id, data}: {id: string, data: ICompany}): Promise<AxiosResponse<ICompany>> => {
	return CompanyService.update(id,{
		name: data.name,
		status: data.status
	});
  };

export function useUpdateMutate () {
	const queryClient = useQueryClient()
	const mutate = useMutation({ 
		mutationFn: putData,
		onSuccess: () => {
			queryClient.invalidateQueries(['company-data'])
		}
	})

	return mutate
}

