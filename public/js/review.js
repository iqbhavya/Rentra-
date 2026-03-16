
const stars = document.querySelectorAll('#stars span');

stars.forEach(star => {
    star.onclick = () => {
        document.getElementById('hiddenRating').value = star.dataset.val;
        stars.forEach(s => s.style.color = s.dataset.val <= star.dataset.val ? '#f5a623' : '#ccc');
    };
});
