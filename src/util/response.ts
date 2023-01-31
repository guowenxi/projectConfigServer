export const success = (message = "success", data = {}) => {
  return {
    success: 1,
    message: message,
    data
  };
};

export const error = (message = "error", data = {}) => {
  console.error(data);
  return {
    success: 0,
    message: message,
    data
  };
};

export class pageType {
  list: Array<any>
  total: number
  current: number
  pageSize: number
}

export class requestPageType {
  pageNo: String | Number
  pageSize: string | Number
}

export function pagination<T>(
  pageType: pageType
) {

  return {
    data: {
      data: pageType.list,
      pageSize: pageType.pageSize,
      current: pageType.current,
      total: pageType.total,
    },
    success: 1,
    message: '查询成功',
    // totalPage: Math.ceil(total / pageSize),
  };
}

