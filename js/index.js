$('.newgame').on('click',function(){
  $('.toast').css('display','block')
})
$('.toast .esay').on('click',function(){
  localStorage.schema = '简单'
  window.location.href = './html/game.html'
})
$('.toast .hard').on('click',function(){
  localStorage.schema = '困难'
  window.location.href = './html/game.html' 
})