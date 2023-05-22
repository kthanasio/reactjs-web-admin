import { CompanyService } from "../../services";
import { ICompany } from "../../interfaces";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from "axios";

const postData = async (data: ICompany): Promise<AxiosResponse<ICompany>> => {
	return CompanyService.create({
		name: data.name,
		status: data.status
	});
  };

export function useCreateMutate () {
	const queryClient = useQueryClient()
	const mutate = useMutation({ 
		mutationFn: postData,
		onSuccess: () => {
			queryClient.invalidateQueries(['company-data'])
		}
	})

	return mutate
}

