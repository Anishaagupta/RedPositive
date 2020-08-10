document.getElementById('add-btn').addEventListener('click', function(){
    document.querySelector('.bg-modal1').style.display = 'flex';
});
document.querySelector('.close').addEventListener('click', function(){
    document.querySelector('.bg-modal1').style.display = 'none';
});
document.querySelector('request').addEventListener('click', function(){
    document.querySelector('.bg-modal1').style.display = 'none';
});