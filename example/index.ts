import EasyApi from "../app";

const api = new EasyApi({});

api.start().then(r => api.logger.info("api started"));
