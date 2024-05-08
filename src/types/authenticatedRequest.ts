import { Request } from "express"
import { User } from "src/entities"

type AuthenticatedRequest = Request & {
  user: User
}

export default AuthenticatedRequest
