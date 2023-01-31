import { Controller, Req, Res, Get, Post, Render, HttpCode } from '@nestjs/common';
import { Param, Query } from '@nestjs/common';


@Controller('/a')
export class AppController {
  constructor() { }
  @Get('/b')
  getone() {
    return '123465'
  }
}
