import { AxiosResponse } from "axios";
import http from "../../common/http-common";
import { IApplication, ICompany, IDepartment, IProductLead } from "../../interfaces";

const MAIN_RESOURCE=`/applications`
const DEPARTMENTS_PUBLIC_RESOURCE=`/public/departments`
const PRODUCT_LEADS_PUBLIC_RESOURCE=`/public/product-leads`
const COMPANIES_PUBLIC_RESOURCE=`/public/companies`

class ApplicationService {
  async getAll(): Promise<AxiosResponse<IApplication[]>> {
    return await http.get(`${MAIN_RESOURCE}`);
  }

  async get(id: string): Promise<AxiosResponse<IApplication>>  {
    return await http.get(`${MAIN_RESOURCE}/${id}`);
  }

  async create(data: IApplication): Promise<AxiosResponse<IApplication>> {
	return await http.post<IApplication>(`${MAIN_RESOURCE}`, data);
  }

  async update(id: string, data: IApplication): Promise<AxiosResponse<IApplication>>  {
    return await http.put(`${MAIN_RESOURCE}/${id}`, data);
  }

  async delete(id: string): Promise<AxiosResponse<IApplication>>  {
    return await http.delete(`${MAIN_RESOURCE}/${id}`);
  }

  async findByName(name: string): Promise<AxiosResponse<IApplication[]>>  {
    return await http.get(`${MAIN_RESOURCE}?name=${name}`);
  }

  async getDepartments(): Promise<AxiosResponse<IDepartment[]>>  {
    return await http.get(`${DEPARTMENTS_PUBLIC_RESOURCE}?status=true`);
  }

  async getProductLeads(): Promise<AxiosResponse<IProductLead[]>>  {
    return await http.get(`${PRODUCT_LEADS_PUBLIC_RESOURCE}?status=true`);
  }

  async getCompanies(): Promise<AxiosResponse<ICompany[]>>  {
    return await http.get(`${COMPANIES_PUBLIC_RESOURCE}?status=true`);
  }
}

// eslint-disable-next-line
export default new ApplicationService();
