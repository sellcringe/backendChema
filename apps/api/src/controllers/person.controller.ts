import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import {ClientProxy, RpcException} from "@nestjs/microservices";
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {Person} from "@app/shared/models/person.model";
import {FileInterceptor} from "@nestjs/platform-express";
import {CreatePersonDto} from "@app/shared/dtos/person-dto/createPerson.dto";
import {Roles} from "@app/shared/decorators/role-auth.decorator";
import {JwtAuthGuard} from "../../../auth/src/jwt-auth.guard";
import {FileService} from "../file/file.service";
import {catchError, lastValueFrom, throwError} from "rxjs";
import {RoleGuard} from "../guard/role.guard";

@Controller("person")
export class PersonController {
  constructor(@Inject("PERSON_SERVICE") private personService: ClientProxy,
              private readonly fileService: FileService
  ) {
  }


  // @UseInterceptors(FileInterceptor("image"))
  // @Post('/file')
  // async updateFile(@UploadedFile() image: any){
  //   return await this.fileService.creatFile(image)
  // }
  @ApiOperation({ summary: " Получить всех работников кино ", tags: ['person'] })
  @ApiResponse({ status: 200, type: Person })
  @Get()
  async getPersons() {
    return  this.personService.send(
      {
        cmd: "get-persons"
      },
      {}
    );
  }

  @ApiOperation({ summary: " Получить одного работника кино, включая смежные с ним бд ", tags: ['person'] })
  @ApiResponse({ status: 200, type: Person })
  @Get("/:id")
  async getOnePerson(@Param("id") payload: number) {
    return this.personService.send("getOnePerson", payload)
        .pipe(catchError(error => throwError(() => new RpcException(error.response))));;
  }

  @ApiOperation({ summary: " Создать нового работника сферы кино ", tags: ['person'] })
  @ApiResponse({ status: 201, type: Person })
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("ADMIN")
  @Post("")
  @UseInterceptors(FileInterceptor("image"))
  async createPerson(@Body() payload: CreatePersonDto, @UploadedFile() image: any) {
    let fileName = await this.fileService.creatFile(image);
    if(fileName) payload.picture_person = fileName
    else payload.picture_person = ' '
    return this.personService.send(
      "create-person",
      payload
    ).pipe(catchError(error => throwError(() => new RpcException(error.response))));
  }

  @ApiOperation({ summary: " обновить существующего работника кино ", tags: ['person'] })
  @ApiResponse({ status: 204, type: Number})
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("ADMIN")
  @Put('/:id')
  async updatePerson(@Param("id") id: number, @Body() dto: CreatePersonDto) {
    return this.personService.send("updatePerson", {dto: dto, id: id})
      .pipe(catchError(error => throwError(
        () => new RpcException(error.response))));
  }

  @ApiOperation({ summary: " Удалить работника кино ", tags: ['person'] })
  @ApiResponse({ status: 200, type: Number })
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard)
  @Roles("ADMIN")
  @Delete("/:id")
  async deletePerson(@Param("id") payload: number) {

    const responce =  this.personService.send("deletePerson", payload)
      .pipe(catchError(error => throwError(
        () => new RpcException(error.response))));

    const nameFile = await lastValueFrom(responce);
    console.log("name = " + JSON.stringify(nameFile));
    try {
      if (typeof nameFile == "string") {
        return await this.fileService.deleteFile(nameFile);
      }
      return nameFile;
    } catch (e) {
      throw new HttpException("Ошибка при удалении файла", HttpStatus.BAD_REQUEST);
    }
  }

}