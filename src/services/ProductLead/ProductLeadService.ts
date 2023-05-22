import { AxiosResponse } from "axios";
import http from "../../common/http-common";
import { IProductLead } from "../../interfaces";

const MAIN_RESOURCE=`/product-leads`

class ProductLeadService {
  async getAll(): Promise<AxiosResponse<IProductLead[]>> {
    return await http.get(`${MAIN_RESOURCE}`);
  }

  async get(id: string): Promise<AxiosResponse<IProductLead>> {
    return await http.get(`${MAIN_RESOURCE}/${id}`);
  }

  async create(data: IProductLead): Promise<AxiosResponse<IProductLead>> {
    return await http.post(`${MAIN_RESOURCE}`, data);
  }

  async update(id: string, data: IProductLead): Promise<AxiosResponse<IProductLead>> {
    return await http.put(`${MAIN_RESOURCE}/${id}`, data);
  }

  async delete(id: string): Promise<AxiosResponse<IProductLead>> {
    return await http.delete(`${MAIN_RESOURCE}/${id}`);
  }

  async findByName(name: string): Promise<AxiosResponse<IProductLead[]>> {
    return await http.get(`${MAIN_RESOURCE}?name=${name}`);
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new ProductLeadService();
