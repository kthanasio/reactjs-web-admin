import { CompanyService } from "../../services";
import { ICompany } from "../../interfaces";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from "axios";

const deleteMutation = async (id: string): Promise<AxiosResponse<ICompany>> => {
	return CompanyService.delete(id);
  };

export function useDeleteMutate () {
	const queryClient = useQueryClient()
	const mutate = useMutation({
		mutationFn: deleteMutation,
		onSuccess: () => {
			return queryClient.invalidateQueries({queryKey: ['company-data']})
		}
	  });
	return mutate
}


