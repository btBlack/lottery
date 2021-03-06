var utils = require('./utils.js');

var Event = require('./event.js');

var staff = require('../data/staff.json');
var reward = require('../data/reward.json');


var staffInfo;
var init = function() {
    staffInfo = null;
    if (utils.getItem('staffInfo') === null) {
        staffInfo = staff;
        utils.setItem('staffInfo', staffInfo);
    } else {
        staffInfo = utils.getItem('staffInfo');
    }
}
init();



window.addEventListener('beforeunload', function(e) {
    if (staffInfo !== null) {
        // 刷新或关闭的时候写入 localStorage
        utils.setItem('staffInfo', staffInfo);
    }
    var message = "是否退出抽奖？";
    e.returnValue = message;
    return message;
});

// ctrl+shift+i 初始化抽奖程序
window.addEventListener('keyup', function(e) {
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        utils.confirm('是否初始化抽奖程序？', function() {
            for (i in localStorage) {
                staffInfo = null;
                utils.removeItem(i);
            }
            init();
            console.log("has init all!");
        }, function() {
            console.log('no init all!');
        })
    }
})


var choujiang = function(arr, len) {
    var newArr = [];
    for (var i = 0; i < len; i++) {
        var index = parseInt(Math.random() * arr.length);
        newArr.push(arr[index]);
        // 把抽过奖的从 staffInfo 中剔除
        arr.splice(index, 1);
    }
    return newArr;
}

var drawLottery = function(obj) {
    var awards = reward[obj.type];
    var result;
    if (utils.getItem(awards.name) === null) {
        result = choujiang(staffInfo, awards.number);
        var test = [];
        for (var i = 0; i < result.length; i++) {
            test.push(result[i].empName);
        }
        console.log(test.join(','));
        utils.setItem(awards.name, result);
    } else {
        utils.confirm('您已抽过' + awards.name + '！是否重新抽取？', function() {
            var _current = utils.getItem(awards.name);
            for (var i = 0; i < _current.length; i++) {
                staffInfo.push(_current[i]);
            }
            utils.removeItem(awards.name);
            drawLottery(obj);
        }, function() {
            return;
        })
    }
}


Event.on('start', function(obj) {
    drawLottery(obj);
})
