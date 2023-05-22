import { AxiosResponse } from "axios";
import http from "../../common/http-common";
import { IDepartment } from "../../interfaces";

const MAIN_RESOURCE=`/departments`

class DepartmentsService {
  async getAll(): Promise<AxiosResponse<IDepartment[]>> {
    return await http.get(`${MAIN_RESOURCE}`);
  }

  async get(id: string): Promise<AxiosResponse<IDepartment>> {
    return await http.get(`${MAIN_RESOURCE}/${id}`);
  }

  async create(data: IDepartment): Promise<AxiosResponse<IDepartment>> {
    return await http.post(`${MAIN_RESOURCE}`, data);
  }

  async update(id: string, data: IDepartment): Promise<AxiosResponse<IDepartment>> {
    return await http.put(`${MAIN_RESOURCE}/${id}`, data);
  }

  async delete(id: string): Promise<AxiosResponse<IDepartment>> {
    return await http.delete(`${MAIN_RESOURCE}/${id}`);
  }

  async findByName(name: string): Promise<AxiosResponse<IDepartment[]>> {
    return await http.get(`${MAIN_RESOURCE}?name=${name}`);
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new DepartmentsService();
