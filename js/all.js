/////////////////////<----------Tetris-------->/////////////////////////
var arr = [
    [
        [1, 1, 1, 1]
    ],
    [
        [1],
        [1],
        [1],
        [1]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    [
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 0],
        [1, 1],
        [0, 1]
    ],
    [
        [0, 1],
        [1, 1],
        [1, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 1]
    ],
    [
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 1],
        [1, 1],
        [0, 1]
    ],
    [
        [1, 0],
        [1, 1],
        [1, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 1]
    ],
    [
        [0, 0, 1],
        [1, 1, 1]
    ],
    [
        [1, 0],
        [1, 0],
        [1, 1]
    ],
    [
        [0, 1],
        [0, 1],
        [1, 1]
    ]
]
/////////////////////<----------创建canvas-------->/////////////////////////

var canvas = document.getElementById('canvas1');
var gc = canvas.getContext("2d"); //创建2d绘图环境
var y = 0;
var x = 5;
var timer = null;
var onOff = false;
var arrEmp = [];
for (var i = 0; i < 12; i++) {
    arrEmp.push(0);
}

/////////////////////<----------游戏数据-------->/////////////////////////

/*
    数组中的0代表着地图上的未被俄罗斯方块覆盖的背景位置
    数组中的1代表着俄罗斯方块所占位置
*/

//设置地图行列数量
var matrix = mold();
var data = map(20, 12);
render(data, gc);
auto(400);

function auto(time) {
    timer = setInterval(function () {
        fall();
    }, time)
}

create(matrix);

function map(r, c) {
    var data = [];
    for (var i = 0; i < r; i++) {
        data.push([]);
        for (var j = 0; j < c; j++) {
            data[i].push(0);
        }
    }
    return data;
}

//生成地图数据
function render(data, gc) {

    var w = canvas.width / 12 - 10;
    var h = canvas.height / 20 - 10;
    var rLen = data.length;
    var cLen = data[0].length;

    for (var i = 0; i < rLen; i++) {
        for (var j = 0; j < cLen; j++) {
            gc.fillStyle = data[i][j] === 0 ? 'yellow' : '#FF8C69';
            gc.fillRect(j * (w + 10) + 5, i * (h + 10) + 5, w, h);
        }
    }
}

//随机生成俄罗斯数据
function mold() {
    var num = Math.floor(Math.random() * 18);
    return arr[num];
}

//创建方块数据
function create(arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            if (!data[i + y][j + x]) {
                data[i + y ][j + x] = arr[i][j];
            }
        }
    }
    render(data, gc);
}

function fall() {
    //判断当放开移动到底部的时候就停下，从新生成一个新的方块从顶部开始下移。
    if (collideTest(matrix)) {
        clearLine();
        y = 0;
        x = 5;
        matrix = mold();
    }

    //清除前边
    clearPre(matrix);
    y++;
    create(matrix);
}
//在移动中清除前边的方块
function clearPre(arr) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            if (arr[i][j]) {
                data[i + y][j + x] = 0;
            }

        }
    }
}

//检测下方碰撞
function collideTest(matrix1) {
    //检测是否到达地图底部或撞上其他方块
    var len = matrix1.length;
    //判断已经到达底部
    if (y + len >= data.length) {
        return true;
    }
    // for (var i = len - 1; i < len; i++) {
    //     for (var j = 0; j < matrix[i].length; j++) {
    //         //方块的数组这个位置是0说明是空的，就不需要检测了
    //         //如果data[i+y+1][j+4]的位置是1，说明这个位置已经有一个放开了，就是说移动中的放开碰到了下边的方块。	
    //         if (matrix[i][j] && data[i + y + 1][j + x] == 1) {
    //             return true;
    //         }
    //     }
    // }
    var arr = matrix1[len - 1];
    var n;
    for (var i = 0; i < arr.length; i++) {
        n = len - 1;
        while (!matrix1[n][i]) {
            n--;
        }
        if (data[y + 1 + n][x + i]) {
            return true;
        }
    }
    return false;
}

//检测左右碰撞
function collideTestX(n,matrix1) {
    //左右移动的过程中，如果碰撞了边缘或着其他方块，就返回true，否则返回false
    //-1向左，1向右
    var maxX = data[0].length - matrix1[0].length;
    if (x + n < 0 || x + n > maxX) {
        return true;
    }
    if (n === -1) {
        for (var i = 0; i < matrix1.length; i++) {
            var index = 0;
            while (!matrix1[i][index]) {
                index++;
            }
            if (!data[i + y] || data[i + y][x + index - 1]) {
                return true;
            }
        }
    } else if (n === 1) {
        for (var i = 0; i < matrix1.length; i++) {
            var index = matrix1[0].length;
            while (!matrix1[i][index]) {
                index--;
            }
            if (!data[i + y] || data[i + y][x + index + 1]) {
                return true;
            }
        }
    }
    return false;

}

//方块旋转
function rotate() {
    var arr = [];
    var x = matrix[0].length;
    var y = matrix.length;
    for (var i = 0; i < x; i++) {
        arr.push([]);
    }
    for (var i = 0; i < y; i++) {
        for (var j = 0; j < x; j++) {
            arr[j][y - i - 1] = matrix[i][j];
        }
    }
    if(collideTest(arr)||collideTestX(1,arr)||collideTestX(-1,arr)){
        return;
    }
    matrix = arr;
}

//消除函数
function clearLine() {
    var y = data.length;
    var x = data[0].length;
    var n = null;
    for (var i = 0; i < y; i++) {
        n = true;
        for (var j = 0; j < x; j++) {
            if (!data[i][j]) {
                n = false
            }
        }
        if (n) {
            data.splice(i, 1);
            data.unshift([].concat(arrEmp));
        }
    }

}


/////////////////////<----------玩家操作事件-------->/////////////////////////

function play() {
    document.onkeydown = function (ev) {
        switch (ev.keyCode) {
            case 37: //向左
                clearPre(matrix);
                if (!collideTestX(-1,matrix)) {
                    x--;
                }
                create(matrix);
                break;
            case 39: //向右
                clearPre(matrix);
                if (!collideTestX(1,matrix)) {
                    x++;
                }
                create(matrix);
                break;
            case 38: //变形
                //先清除，再变形
                clearPre(matrix);
                rotate(matrix);
                create(matrix);
                break;
            case 40: //先下快速掉落
                if (onOff) return;
                onOff = true;
                clearInterval(timer)
                auto(50);
                break;
        }
    }
    document.onkeyup = function (ev) {
        if (ev.keyCode === 40) {
            onOff = false;
            clearInterval(timer)
            auto(400);
        }
    }
}
play()