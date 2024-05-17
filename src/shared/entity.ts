export abstract class Entity<TTYpe>{
  public initialState : TTYpe;
  public props : TTYpe

  constructor(data: TTYpe){
    this.initialState = data
    this.props = data
    Object.freeze(this.initialState)
  }

  update(data:Partial<TTYpe>):void {
    this.props = {...this.props, ...data}
  }

  commit():void  { 
    this.initialState = this.props
  }
}