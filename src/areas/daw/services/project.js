import { Project } from '@models/daw/Project'

export async function load (id) {
  return new Project()
}

export async function save (id, project) {
  return id
}
