import http from "../../common/http-common";
import { IApplication } from "../../interfaces";

const MAIN_RESOURCE=`/applications`
const DEPARTMENTS_PUBLIC_RESOURCE=`/public/departments`
const PRODUCT_LEADS_PUBLIC_RESOURCE=`/public/product-leads`
const COMPANIES_PUBLIC_RESOURCE=`/public/companies`

class ApplicationService {
  async getAll() {
    return await http.get(`${MAIN_RESOURCE}`);
  }

  async get(id: string) {
    return await http.get(`${MAIN_RESOURCE}/${id}`);
  }

  async create(data: IApplication){
	return await http.post<IApplication>(`${MAIN_RESOURCE}`, data);
  }

  async update(id: string, data: IApplication) {
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

  async getDepartments() {
    return await http.get(`${DEPARTMENTS_PUBLIC_RESOURCE}?status=true`);
  }

  async getProductLeads() {
    return await http.get(`${PRODUCT_LEADS_PUBLIC_RESOURCE}?status=true`);
  }

  async getCompanies() {
    return await http.get(`${COMPANIES_PUBLIC_RESOURCE}?status=true`);
  }
}

// eslint-disable-next-line
export default new ApplicationService();
