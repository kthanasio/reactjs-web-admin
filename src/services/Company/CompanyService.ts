import { AxiosResponse } from "axios";
import http from "../../common/http-common";
import { ICompany } from "../../interfaces";

const MAIN_RESOURCE=`/companies`

class CompanyService {
  async getAll(): Promise<AxiosResponse<ICompany[]>> {
    return await http.get(`${MAIN_RESOURCE}`);
  }

  async get(id: string): Promise<AxiosResponse<ICompany>>  {
    return await http.get(`${MAIN_RESOURCE}/${id}`);
  }

  async create(data: ICompany): Promise<AxiosResponse<ICompany>> {
	return await http.post<ICompany>(`${MAIN_RESOURCE}`, data);
  }

  async update(id: string, data: ICompany): Promise<AxiosResponse<ICompany>> {
    return await http.put(`${MAIN_RESOURCE}/${id}`, data);
  }

  async delete(id: string): Promise<AxiosResponse<ICompany>>  {
    return await http.delete(`${MAIN_RESOURCE}/${id}`);
  }

  async findByName(name: string): Promise<AxiosResponse<ICompany[]>> {
    return await http.get(`${MAIN_RESOURCE}?name=${name}`);
  }
}

// eslint-disable-next-line
export default new CompanyService();
