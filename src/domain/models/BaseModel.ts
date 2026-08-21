interface IBaseModel {
    id: string;
  }
  
  export type IModel<TModel> = TModel & IBaseModel;
  
  /**
   * An Entity (Model) is an object with its own properties (state, data) and methods that implements the business logic that is executed on these properties. An entity is represented by its unique identifier (Id)
   */
  export abstract class BaseModel implements IBaseModel {
    id;
  
    constructor(id?: string) {
      this.id = id || '';
    }
  }