import { IsNotEmpty } from "class-validator"

export class pointConfigDto {
  id: any

  deviceGroupId: any

  dataSource: any
}
export class pointConfigListDto {

  @IsNotEmpty({ message: '设备id为空!' })
  equipId: string

  pointConfigList: Array<pointConfigDto>
}