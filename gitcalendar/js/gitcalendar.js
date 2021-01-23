const gitcalendar = new Vue({
    el: '#gitcalendar',
    data: {
        simplemode: true, //打开时使用canvas绘制gitgitcalendar，关闭时使用svg绘制gitgitcalendar
                          //canvas：dom数少，但图像会发生模糊，自适应一般  svg：dom数多，图像清晰，自适应更佳

        user: 'MeucoMei', //这里填写你的github用户名

        fixed: 'fixed',
        px: 'px',
        x: '',
        y: '',
        span1: '',
        span2: '',
        month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthchange: [],
        oneyearbeforeday: '',
        thisday: '',
        amonthago: '',
        aweekago: '',
        weekdatacore: 0,
        datacore: 0,
        total: 0,
        datadate: '',
        data: [],
        positionplusdata: [],
        firstweek: [],
        lastweek: [],
        beforeweek: [],
        thisweekdatacore: 0,
        mounthbeforeday: 0,
        mounthfirstindex: 0,
        crispedges: 'crispedges',
        thisdayindex: 0,
        amonthagoindex: 0,
        amonthagoweek: [],
        firstdate: [],
        first2date: [],
        montharrbefore: [],
        monthindex: 0,
        purple: ['#ebedf0', '#fdcdec', '#fc9bd9', '#fa6ac5', '#f838b2', '#f5089f', '#c4067e', '#92055e', '#540336', '#48022f', '#30021f',],
        green: ['#ebedf0', '#f0fff4', '#dcffe4', '#bef5cb', '#85e89d', '#34d058', '#28a745', '#22863a', '#176f2c', '#165c26', '#144620'],
        blue: ['#ebedf0', '#f1f8ff', '#dbedff', '#c8e1ff', '#79b8ff', '#2188ff', '#0366d6', '#005cc5', '#044289', '#032f62', '#05264c',],
        color: ['#ebedf0', '#fdcdec', '#fc9bd9', '#fa6ac5', '#f838b2', '#f5089f', '#c4067e', '#92055e', '#540336', '#48022f', '#30021f',]
    },
    methods: {
        selectStyle(data, event) {
            document.querySelector('.angle-wrapper').style.display = 'block'
            this.span1 = data.date;
            this.span2 = data.count;
            this.x = event.clientX - 100;
            this.y = event.clientY - 60
        },
        outStyle() {
            document.querySelector('.angle-wrapper').style.display = 'none'
        },
        thiscolor(x) {
            if (x === 0) {
                let i = parseInt(x / 2);
                return this.color[0]
            } else if (x < 2) {
                return this.color[1]
            } else if (x < 20) {
                let i = parseInt(x / 2);
                return this.color[i]
            } else {
                return this.color[9]
            }
        },
    }
});

let githubapiurl = "https://python-github-calendar-api.vercel.app/api?" + gitcalendar.user;
//let githubapiurl = "https://githubapi.ryanchristian.dev/user/" + gitcalendar.user;  
//旧的api策略

//canvas绘图
function responsiveChart() {if(gitcalendar.simplemode){
    let c = document.getElementById("gitcanvas");
    let cmessage = document.getElementById("gitmessage");
    let ctx = c.getContext("2d");
    c.width = document.getElementById("gitcalendarcanvasbox").offsetWidth;
    let linemaxwitdh = 0.96 * c.width / gitcalendar.data.length;
    c.height = 9 * linemaxwitdh;
    let lineminwitdh = 0.8 * linemaxwitdh;
    let setposition = {
        x: 0.02 * c.width,
        y: 0.025 * c.width
    };
    for (let week in gitcalendar.data) {
        weekdata = gitcalendar.data[week];
        for (let day in weekdata) {
            let dataitem = {date: "", count: "", x: 0, y: 0};
            gitcalendar.positionplusdata.push(dataitem);
            ctx.fillStyle = gitcalendar.thiscolor(weekdata[day].count);
            setposition.y = Math.round(setposition.y * 100) / 100;
            dataitem.date = weekdata[day].date;
            dataitem.count = weekdata[day].count;
            dataitem.x = setposition.x;
            dataitem.y = setposition.y;
            ctx.fillRect(setposition.x, setposition.y, lineminwitdh, lineminwitdh);
            setposition.y = setposition.y + linemaxwitdh
        }
        ;
        setposition.y = 0.025 * c.width;
        setposition.x = setposition.x + linemaxwitdh
    }
    ;
    ctx.font = "600  Arial";
    ctx.fillStyle = '#aaa';
    ctx.fillText("日", 0, 1.9 * linemaxwitdh);
    ctx.fillText("二", 0, 3.9 * linemaxwitdh);
    ctx.fillText("四", 0, 5.9 * linemaxwitdh);
    ctx.fillText("六", 0, 7.9 * linemaxwitdh);
    let monthindexlist = c.width / 24;
    for (let index in gitcalendar.monthchange) {
        ctx.fillText(gitcalendar.monthchange[index], monthindexlist, 0.7 * linemaxwitdh);
        monthindexlist = monthindexlist + c.width / 12
    }
    ;
    cmessage.onmousemove = function (event) {
        document.querySelector('.angle-wrapper').style.display = 'none'
    };
    c.onmousemove = function (event) {
        document.querySelector('.angle-wrapper').style.display = 'none'
        getMousePos(c, event);
    };

    function getMousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left * (canvas.width / rect.width);
        var y = event.clientY - rect.top * (canvas.height / rect.height);
        //console.log("x:"+x+",y:"+y);
        for (let item of gitcalendar.positionplusdata) {
            let lenthx = x - item.x;
            let lenthy = y - item.y;
            //console.log(lenthx,lenthy);
            if (0 < lenthx && lenthx < lineminwitdh) {
                if (0 < lenthy && lenthy < lineminwitdh) {
                    //console.log(item.date,item.count)
                    document.querySelector('.angle-wrapper').style.display = 'block'
                    gitcalendar.span1 = item.date;
                    gitcalendar.span2 = item.count;
                    gitcalendar.x = event.clientX - 100;
                    gitcalendar.y = event.clientY - 60
                }
            }
            //if(0< x - item.x <lineminwitdh&&0< y - item.y <lineminwitdh){
            //console.log(item.count,item.date);
            //}
        }
    }
}}

//数据统计算法
function addlastmonth() {
    if (gitcalendar.thisdayindex === 0) {
        thisweekcore(52);
        thisweekcore(51);
        thisweekcore(50);
        thisweekcore(49);
        thisweekcore(48);
        gitcalendar.thisweekdatacore += gitcalendar.firstdate[6].count;
        gitcalendar.amonthago = gitcalendar.firstdate[6].date
    } else {
        thisweekcore(52);
        thisweekcore(51);
        thisweekcore(50);
        thisweekcore(49);
        thisweek2core();
        gitcalendar.amonthago = gitcalendar.first2date[gitcalendar.thisdayindex - 1].date
    }
};
function thisweek2core() {
    for (let i = gitcalendar.thisdayindex - 1; i < gitcalendar.first2date.length; i++) {
        gitcalendar.thisweekdatacore += gitcalendar.first2date[i].count
    }
};
function thisweekcore(index) {
    for (let item of gitcalendar.data[index]) {
        gitcalendar.thisweekdatacore += item.count
    }
};
function addlastweek() {
    for (let item of gitcalendar.lastweek) {
        gitcalendar.weekdatacore += item.count
    }
};
function addbeforeweek() {
    for (let i = gitcalendar.thisdayindex; i < gitcalendar.beforeweek.length; i++) {
        gitcalendar.weekdatacore += gitcalendar.beforeweek[i].count
    }
};
function addweek(data) {
    if (gitcalendar.thisdayindex === 6) {
        gitcalendar.aweekago = gitcalendar.lastweek[0].date;
        addlastweek()
    } else {
        lastweek = data.contributions[51];
        gitcalendar.aweekago = lastweek[gitcalendar.thisdayindex + 1].date;
        addlastweek();
        addbeforeweek()
    }
}

fetch(githubapiurl)
    .then(data => data.json())
    .then(data => {
        gitcalendar.data = data.contributions;
        gitcalendar.total = data.total;
        gitcalendar.first2date = gitcalendar.data[48];
        gitcalendar.firstdate = gitcalendar.data[47];
        gitcalendar.firstweek = data.contributions[0];
        gitcalendar.lastweek = data.contributions[52];
        gitcalendar.beforeweek = data.contributions[51];
        gitcalendar.thisdayindex = gitcalendar.lastweek.length - 1;
        gitcalendar.thisday = gitcalendar.lastweek[gitcalendar.thisdayindex].date;
        gitcalendar.oneyearbeforeday = gitcalendar.firstweek[0].date;
        gitcalendar.monthindex = gitcalendar.thisday.substring(5, 7) * 1;
        gitcalendar.montharrbefore = gitcalendar.month.splice(gitcalendar.monthindex, 12 - gitcalendar.monthindex);
        gitcalendar.monthchange = gitcalendar.montharrbefore.concat(gitcalendar.month);
        addweek(data);
        addlastmonth();
        responsiveChart();
    })
    .catch(function (error) {
        console.log(error);
    });

//手机版更换为svg绘制
if(document.getElementById("gitcalendarcanvasbox").offsetWidth<500){gitcalendar.simplemode=false}

//当改变窗口大小时重新绘制canvas
window.onresize = function(){
    responsiveChart();
}

//解决滚动滑轮时出现的标签显示
window.onscroll = function () {
   if(document.querySelector('.angle-wrapper')){ document.querySelector('.angle-wrapper').style.display = 'none'}
};
