
import { Attributedictionary } from '@modules/entitie/Attributedictionary';
import { IsString, IsInt, Length, IsNotEmpty } from 'class-validator';

import { EquipparapetList } from './equipparapetList.dto';

export class EquipparapetDto extends Attributedictionary {

  @IsNotEmpty({ message: '参数名称为空!' })
  paramName: any

  @IsNotEmpty({ message: '绑定的应用的类型为空!' })
  applyType: any

  equipparapetList: Array<EquipparapetList>

  // 移除数据的时候使用
  removeList: Array<EquipparapetList> | null

}
