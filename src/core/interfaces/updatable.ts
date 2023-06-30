export interface Updatable {
  updateOrder: number
	
  update(timestep: number): void
}
