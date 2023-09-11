import { Service } from "../service/index.js";

export class Controller {
  constructor() {
    this.service = new Service()
  }

  async getFileStream(fileName) {
    return this.service.getFileStream(fileName);
  }
}