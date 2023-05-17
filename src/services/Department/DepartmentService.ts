import http from "../../common/http-common";
import { IDepartment } from "../../interfaces";

const MAIN_RESOURCE=`/departments`

class DepartmentsService {
  getAll() {
    return http.get(`${MAIN_RESOURCE}`);
  }

  get(id: string) {
    return http.get(`${MAIN_RESOURCE}/${id}`);
  }

  create(data: IDepartment) {
    return http.post(`${MAIN_RESOURCE}`, data);
  }

  update(id: string, data: IDepartment) {
    return http.put(`${MAIN_RESOURCE}/${id}`, data);
  }

  delete(id: string) {
    return http.delete(`${MAIN_RESOURCE}/${id}`);
  }

  deleteAll() {
    return http.delete(`${MAIN_RESOURCE}`);
  }

  findByName(name: string) {
    return http.get(`${MAIN_RESOURCE}?name=${name}`);
  }
}

export default new DepartmentsService();
