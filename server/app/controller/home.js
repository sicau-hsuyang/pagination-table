'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async table() {
    console.log("Get Table Data List");
    let { pageSize, pageNum, orderBy, orderField, ticket, name, } = Object.assign({
      pageSize: 10,
      pageNum: 1,
      orderBy: 'ASC',
      orderField: 'createTime',
      name: '',
      ticket: '',
    }, this.ctx.query);


    const pattern = [
      {
        id: 1,
        name: "螺髻山",
        url:
          "https://baike.baidu.com/item/%E8%9E%BA%E9%AB%BB%E5%B1%B1%E9%A3%8E%E6%99%AF%E5%8C%BA/1226258?fr=aladdin",
        location: "凉山彝族自治州普格县",
        ticket: true,
        price: 100,
        createTime: Date.now()
      },
      {
        id: 2,
        name: "邛海",
        url:
          "https://baike.baidu.com/item/%E9%82%9B%E6%B5%B7/1247191?fr=aladdin",
        location: "凉山彝族自治州西昌市",
        price: 25,
        ticket: true,
        createTime: Date.now()
      },
      {
        id: 3,
        name: "兴隆湖",
        url: "https://baike.baidu.com/item/%E5%85%B4%E9%9A%86%E6%B9%96",
        location: "成都市天府新区兴隆镇",
        ticket: false,
        price: null,
        createTime: Date.now()
      }
    ];

    let data = [];

    for (let i = 0; i < 1000; i++) {
      for (let j = 0; j < 3; j++) {
        pattern[j].id = 3 * i + j + 1;
        data.push(JSON.parse(JSON.stringify(pattern[j])));
      }
    }

    data = data.filter(x => x.name.toLowerCase().indexOf(name) >= 0).filter(x => {
      return ticket != 1 && ticket != 2 ? true : ticket == 2 ? x.ticket === false : x.ticket === true;
    });

    this.ctx.body = {
      data: data.slice(pageSize * (pageNum - 1), pageSize * pageNum),
      total: data.length
    };

  }
}


module.exports = HomeController;
