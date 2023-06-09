import {Controller} from '@nestjs/common';
import {AuthService} from './auth.service';
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {SharedService} from "@app/shared/services/shared/shared.service";
import {CreateProfileDto} from "@app/shared/dtos/auth-dto/create-profile.dto";
import {CreateRoleDto} from "@app/shared/dtos/auth-dto/user-role.dto";
import {RolesService} from "./role/role.service";
import {ProfileService} from "./profile/profile.service";


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly sharedService: SharedService,
              private readonly roleService: RolesService,
              private readonly profileService: ProfileService
              ) {}

  @MessagePattern('register')
  async register(@Ctx() context: RmqContext, @Payload() dto: CreateProfileDto){
    await this.sharedService.acknowledgeMessage(context)
    return await this.authService.registration(dto)
  }

  @MessagePattern('login')
  async login(@Ctx() context: RmqContext, @Payload() dto: CreateProfileDto){
    await this.sharedService.acknowledgeMessage(context)

    return await this.authService.login(dto)
  }

  @MessagePattern('createRole')
  async createRole(@Ctx() context: RmqContext, @Payload() dto: CreateRoleDto){
    await this.sharedService.acknowledgeMessage(context)
    return await this.roleService.createRole(dto)
  }

  @MessagePattern('deleteProfile')
  async deleteProfile(@Ctx() context: RmqContext, @Payload() payload: object ){
    await this.sharedService.acknowledgeMessage(context)

    const id = payload['id']
    const authHeader = payload['authHeader'].replace('Bearer ', '')

    return await this.authService.deleteUser(id, authHeader)
  }
  @MessagePattern('getAllProfiles')
  async getAllProfiles(@Ctx() context: RmqContext){
    await this.sharedService.acknowledgeMessage(context)

    return await this.authService.getAllProfiles()
  }


}
