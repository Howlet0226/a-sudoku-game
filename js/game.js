
function Item() {
  this.num = '';
  this.x = 0;
  this.y - 0
}
//缓存，用于返回
var cache = []
// 被选中的item，用于删除和填数
var citem = {};
// 为true的时候才会填数有效果
var flag = false;
var timer
var items = []
let m = 0
let s = 0
let hs = 0
let final
$('.game-text .schema').text(`${localStorage.schema}`)
$.ajax({
  type: "GET",
  // localStorage.schema就是难度，与文件名必须一致，这是从index页面传过来的
  url: `http://127.0.0.1:8080/content/${localStorage.schema}.json`,
  dataType: 'json',
  success: function (res) {
    final = res.final
    createGame(res.pre)
    handleClick()
    recordTime()
  }
});

function createGame(con) {
  for (let i = 0; i < 9; i++) {
    items[i] = []
    for (let j = 0; j < 9; j++) {
      items[i][j] = new Item()
      items[i][j].x = i;
      items[i][j].y = j;
      // console.log(items);
      if(con[i][j] === 0){
      $('.game-box').append(`<div class="game-item" data-x="${i}" data-y="${j}"></div>`)
      items[i][j].num = ''
      }else
      {
        items[i][j].num = con[i][j]
        $('.game-box').append(`<div class="game-item" data-x="${i}" data-y="${j}">${items[i][j].num}</div>`)
      }
    }
  }

}

function handleClick() {
  // 元素点击绑定
  $('.game-box').on('click', function (e) {
    $('.game-box .game-item').css({
      'backgroundColor': '#fff'
    })
    let x = e.target.getAttribute('data-x')
    let y = e.target.getAttribute('data-y')
    $(`.game-item[data-x="${x}"][data-y="${y}"`).addClass('animated jello')
    // console.log(items[x][y]);
    citem = items[x][y]
    // 改变相同数字的颜色
    if (items[x][y].num !== '') {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          // console.log(items[x][y].num);
          if (items[i][j].num === items[x][y].num && (items[i][j].x === items[x][y].x || items[i][j].y === items[x][y].y)) {
            // console.log( $(`.game-box .game-item[data-x="${i}"][data-y="${j}"]`));
            $(`.game-box .game-item[data-x="${i}"][data-y="${j}"]`).css({
              'backgroundColor': 'red',
            })
          } else if (items[i][j].num === items[x][y].num) {
            $(`.game-box .game-item[data-x="${i}"][data-y="${j}"]`).css({
              'backgroundColor': '#888',
            })
          }
        }
      }
    }
    $(`.game-item[data-x="${x}"][data-y="${y}"`).css({
      'backgroundColor': '#888',
    })

    flag = true;
    setTimeout(function () {
      $(`.game-item[data-x="${x}"][data-y="${y}"`).removeClass('animated jello')
    }, 1000)
  })
  // 填数
  $('.game-num').on('click', function (num) {
    if (!flag) {
      return
    }
    if (num.target.innerHTML.indexOf('li') > 0) {
      return
    }
    // 放入缓存,用于撤回
    cache.push(JSON.parse(JSON.stringify(citem)))
    $(`.game-box .game-item[data-x="${citem.x}"][data-y="${citem.y}"]`).text(num.target.innerHTML)
    items[citem.x][citem.y].num = Number(num.target.innerHTML)
    $('.game-box .game-item').css({
      'backgroundColor': '#fff'
    })
    // console.log($(`.game-box .game-item[data-x="${citem.x}"][data-y="${citem.y}"]`).text());
    // console.log(num.target.innerHTML);
    flag = false
    let result = checkwin()
    if(result === 2){
      stopTime()
      $('.over .usetime').text(`${m}分${s}秒${hs}`)
      $('.over').css({
        'display': 'block'
      })
      $('.over .over-box').addClass('bounceIn')
    }
  })
  // 撤回
  $('.game-fun .back').on('click', function (e) {
    $('.game-box .game-item').css({
      'backgroundColor': '#fff'
    })
    let preItem = cache.pop()
    console.log(preItem);
    if (!preItem) {
      return
    }
    $(`.game-box .game-item[data-x="${preItem.x}"][data-y="${preItem.y}"]`).text(preItem.num)
    items[preItem.x][preItem.y].num = preItem.num
  })

  // 删除
  $('.game-fun .del').on('click', function (e) {
    if (!flag) {
      return
    }
    // console.log(citem);
    cache.push(JSON.parse(JSON.stringify(citem)))
    $(`.game-box .game-item[data-x="${citem.x}"][data-y="${citem.y}"]`).text('')
    items[citem.x][citem.y].num = ''
    $('.game-box .game-item').css({
      'backgroundColor': '#fff'
    })
    flag = false
  })
  // 暂停
  $('.game-text .stop').on('click', function () {

    stopTime()
    $('.zanting .usetime').text(`${m}分${s}秒${hs}`)
    $('.zanting').addClass('fadeInDown').css({
      'display': 'block'
    })
    setTimeout(() => {
      $('.zanting').removeClass('fadeInDown')
    }, 1000)
  })

  // 继续
$('.zanting .keepgoing').on('click', function () {
  recordTime()
  $('.zanting').addClass('fadeOutUp')
  setTimeout(() => {
    $('.zanting').removeClass('fadeOutUp').css({
      'display': 'none'
    })
  }, 1000)
})

// over
$('.over .again').on('click', function () {
  location.href = '../index.html'
})
}

function checkwin() {

    for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if(items[i][j].num === ''){
        return 1
      }
      if(items[i][j].num !== final[i][j]){
        return 0
      }
    }
  }
  return 2


  // // console.log(items);
  // let winarr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  // for (let i = 0; i < 9; i++) {
  //   let xarr = []
  //   let yarr = []
  //   for (let j = 0; j < 9; j++) {
  //     xarr.push(items[i][j].num)
  //     yarr.push(items[j][i].num)
  //   }
  //   // 判断是否填完
  //   let osx = new Set(xarr)
  //   let osy = new Set(yarr)
  //   // if (osx.has('') || osy.has('')) {
  //   //   console.log(xarr);
  //   //   console.log(yarr);
  //   //   return 1
  //   // }
  //   // 如果填完判断是否正确
  //   // console.log(xarr);
  //   //  console.log(yarr);
  //   let resultx = [...winarr].filter(item => osx.has(item))
  //   let resulty = [...winarr].filter(item => osy.has(item))
  //   var res = 2
  //   winarr.forEach((item, index) => {
  //     if (item !== resultx[index] || item !== resulty[index]) {
  //       res = 0
  //     }
  //   })
  //   // console.log('res is '+res);
  //   if (res === 0) {
  //     return res
  //   }
  // }
  // return 2
}

function recordTime() {
  timer = setInterval(function () {
    hs++
    if (hs === 10) {
      hs = 0;
      s++
    }
    if (s === 60) {
      s = 0;
      m++;
    }
    $('.game-text .time').text(`${m}分${s}秒${hs}`)
  }, 100)
}
function stopTime() {
  clearInterval(timer)
}
