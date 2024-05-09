import { Response as ExpressResponse } from "express"
import { ApiNoContentResponse, ApiOperation } from "@nestjs/swagger"
import { Controller, Get, HttpStatus, Response } from "@nestjs/common"

@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: "API Health Check" })
  @ApiNoContentResponse({ description: "API is running" })
  healthCheck(@Response() res: ExpressResponse) {
    res.sendStatus(HttpStatus.NO_CONTENT)
  }
}
