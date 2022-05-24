import { GoodsServiceDescription } from "./GoodsServiceDescription";

class ClassDescription {
  classNumber: number | null;
  descriptions: GoodsServiceDescription[] | null;
  constructor(classDescriptionNode: any) {
    this.classNumber = classDescriptionNode.ClassNumber != null ? Number.parseInt(classDescriptionNode.ClassNumber) : null;
    this.descriptions = classDescriptionNode.GoodsServicesDescription?.map((descNode: any) => new GoodsServiceDescription(descNode))
  }
}

export { ClassDescription }