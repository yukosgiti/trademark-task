class GoodsServiceDescription {
  description: string;
  languageCode: string;
  constructor(goodsServiceDescriptionNode: any) {
    this.description = goodsServiceDescriptionNode["_"];
    this.languageCode = goodsServiceDescriptionNode["$"].languageCode;
  }
}

export { GoodsServiceDescription }