import { HttpService } from '@nestjs/axios';
var moment = require('moment');
import { CronJob } from 'cron';
import { Like } from 'typeorm';
export let commonData = {
    asToken: ""
}

export function repositoryWhereLike(restQuery?: any) {
    if (!restQuery) {
        return {};
    }
    return Object.entries(restQuery).reduce((acc, [key, value]) => {
        return {
            ...acc,
            [key]: Like(`%${value}%`),
        };
    }, {});
}
export const regroupTime = function (data, me, execute) {
    const { id, daySetting, loopState, timeSetting, triggerState } = data;
    let _time;
    /**
     * * 1持续 2 定时
     */
    switch (Number(triggerState)) {
        case 1:
            _time = `* * * * * *`;
            break;
        case 2:
            _time = convertTime(timeSetting, daySetting)
            _time.map(function (item, idx) {
                item.cronName = `cron_${data?.id}_${item.cron} ${item.start} ${item.end}`;
                item.execute = execute; //启动即为开启
                item.cronId = id; //附上id
                item.cron = item.cron
                item.loopState = loopState
            })
            break;
        case 3:
            break;
    }
    return _time;
}

const convertTime = function (list, day) {
    let _timeList = [],
        f_hour,
        f_minutes,
        s_hour,
        s_minutes
        ;
    list.split(",").map(function (item) {
        const [first, second] = item.split("-");
        f_hour = moment(first, moment.HTML5_FMT.TIME).hour()
        f_minutes = moment(first, moment.HTML5_FMT.TIME).minutes();
        s_hour = moment(second, moment.HTML5_FMT.TIME).hour()
        s_minutes = moment(second, moment.HTML5_FMT.TIME).minutes();
        const _time = `* * ${f_hour + '-' + s_hour} * * ${day[0] + '-' + day.slice(-1)}`;
        _timeList.push({
            cron: _time,
            start: first,
            end: second,
        })

    })
    return _timeList;
}

export const createJob = function (name, code, time, loopState, me) {
    if (loopState == 1) {

    } else {

    }
    let state = false;
    //运行机制问题,这个state受当前函数作用域保护,各不影响
    let job = new CronJob(time.cron, async () => {
        if (state) {
            return;
        }
        let start = moment().unix();
        if (
            start >= moment(time.start, moment.HTML5_FMT.TIME).unix() &&
            start <= moment(time.end, moment.HTML5_FMT.TIME).unix() && !state
        ) {
            state = true;
            //loopState 1 执行一次 2 循环执行
            const temp = `
            const highlightBlock = function(){};
            const _this = me;
            async function start_fn(){
              ${code}
              if (loopState == 2) {
                state = false;
            }
              console.log("${name}调试完毕");
            };
            start_fn();
            `
            try {
                eval(temp)
            } catch (err) {
                console.log(err);
            }
            start = moment().unix();
        }
    });
    me.schedulerRegistry.addCronJob(name, job);
    return job;
}


export const resetScheduler = function ({ data, removeList, execute }) {
    if (removeList) {
        removeList.map((item) => {
            if (this.schedulerRegistry.doesExist("cron", item.cronName)) {
                //删除
                const job = this.schedulerRegistry.deleteCronJob(item.cronName);
            }
        })
    }
    if (data) {
        const {
            id,
            codeData,
            loopState
        } = data;
        const timerList = regroupTime(data, this, execute);
        //启动
        timerList.map((item, idx) => {
            item.cronId = id;
            const job = createJob(
                item.cronName,
                codeData || "",
                item,
                loopState,
                this
            )
            if (execute == '1') {
                job.start();
            }
        })
        return timerList;
    }
}