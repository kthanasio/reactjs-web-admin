import http from "../../common/http-common";
import { ICompany } from "../../interfaces";

const MAIN_RESOURCE=`/companies`

class CompanyService {
  async getAll() {
    return await http.get(`${MAIN_RESOURCE}`);
  }

  async get(id: string) {
    return await http.get(`${MAIN_RESOURCE}/${id}`);
  }

  async create(data: ICompany){
	return await http.post<ICompany>(`${MAIN_RESOURCE}`, data);
  }

  async update(id: string, data: ICompany) {
    return await http.put(`${MAIN_RESOURCE}/${id}`, data);
  }

  async delete(id: string) {
    return await http.delete(`${MAIN_RESOURCE}/${id}`);
  }

  async deleteAll() {
    return await http.delete(`${MAIN_RESOURCE}`);
  }

  async findByName(name: string) {
    return await http.get(`${MAIN_RESOURCE}?name=${name}`);
  }
}

// eslint-disable-next-line
export default new CompanyService();
