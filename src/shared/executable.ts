export interface Executable<TResquest, TResponse>{
  execute(request: TResquest): Promise<TResponse>
}