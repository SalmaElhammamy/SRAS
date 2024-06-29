import { GET, POST } from "./services.js";

const getAssociationRules = async () => {
  return GET("/marketing/associations");
};

const saveAssociationRules = async (associationRules) => {
  return POST("/marketing/associations", associationRules);
};

export { getAssociationRules, saveAssociationRules };
