$('.newgame').on('click',function(){
  $('.toast').css('display','block')
})
$('.toast .esay').on('click',function(){
  localStorage.schema = '难度1'
  window.location.href = './html/game.html'
})
$('.toast .hard').on('click',function(){
  localStorage.schema = '难度2'
  window.location.href = './html/game.html' 
})