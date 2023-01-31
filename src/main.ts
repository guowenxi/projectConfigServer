import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from "@nestjs/common";
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import axios from "axios"
import config from '@/config/config';
import { commonData } from '@/util/util';
import { HttpExceptionFilter } from '@http-exception.filter';
const https = require('https');
var moment = require('moment');
//全局请求配置
axios.defaults.baseURL = config().axiosUrl;
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// // 添加响应拦截器
// //默认去请求加一的token
axios.request({
  url: "/services/LoginSaToken/notLoginByNode",
  method: "post",
}).then((res) => {
  console.log(res.data.data.tokenValue);
  commonData.asToken = res.data.data.tokenValue;
  let _list = [];

  for (var i = 0; i < 10; i++) {
    _list.push(new Promise(function (resolve) {
      // console.log("开始", moment().format("hh:mm:ss.SSSSSS"));
      axios.request({
        url: "/service/joint/sendInstruction",
        // url: "/service/joint/getPointByPointsId",
        method: "post",
        headers: {
          saToken: commonData.asToken,
        },
        data: {
          sendPointsId: 161,
          pointsValue: 0
        }
      }).then((res) => {

        resolve(1)
        console.log(res.data);
        console.log("结束123123", moment().format("hh:mm:ss.SSSSSS"));
      })
    }))
  }

  Promise.all(_list).then(function () {

  });

}).catch(function (err) {
  console.log(err);
});

// setTimeout(()=>{
//     const response = axios.request({
//       url: "/service/joint/getPointByPointsId",
//       method: "get",
//       headers:{
//           saToken:commonData.asToken,
//       },
//       params: {
//           pointsId: 161
//       }
//   }).then((res)=>{
//     console.log(123);

//   }).catch(function(err){
//       return err;
//   });
// },4000)


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors(); //允许跨域


  // 路由前缀
  app.setGlobalPrefix("/api");

  // 加入异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 添加管道 对 字段进行限制
  app.useGlobalPipes(
    new ValidationPipe(),
  );

  const configService = app.get(ConfigService);
  //设置静态文件路径
  app.useStaticAssets(join(__dirname, '..', configService.get<string>('filePath')), {
    prefix: '/public/' // 虚拟名称,匹配虚拟路径
  });
  const port: string = configService.get<string>('port');
  //使用hbs引擎来实现html输出
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // app.setViewEngine('hbs');
  await app.listen(port, () => {
    // console.log("启动成功", `http://localhost:${port}/api/point-position`);
  });
}
bootstrap();



