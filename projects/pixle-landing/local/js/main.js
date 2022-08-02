document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    const main_navbar = document.getElementById('main-navbar');
    const section_welcome = document.getElementById('welcome');

    // Scroll event
    window.onscroll = () => {
      let do_not_show_class = 'do-not-show';
      let navbar_scroll_barrier = section_welcome.offsetTop + section_welcome.offsetHeight;
      if (window.scrollY > navbar_scroll_barrier) {
        if (!main_navbar.classList.contains(do_not_show_class)) return;
        main_navbar.classList.remove(do_not_show_class);
      } else {
        if (main_navbar.classList.contains(do_not_show_class)) return;
        main_navbar.classList.add(do_not_show_class);
      }
    };

    // Pixle countdown
    this.setPixleCountdown();
    window.setInterval(() => {
      this.setPixleCountdown();
    }, 1000);
  }
}

function scrollToHowToGuide() {
  const section_welcome = document.getElementById('welcome');
  let scrollDiv = document.getElementById('how-to-play').offsetTop + section_welcome.offsetHeight;
  let newScrollTop = scrollDiv - 70;
  window.scrollTo({top: newScrollTop, behavior: 'smooth'});
}

function setPixleCountdown() {
  let date_now = new Date();
  let date_tomorrow = new Date(date_now);
  date_tomorrow.setUTCDate(date_tomorrow.getUTCDate() + 1);
  date_tomorrow.setHours(0, 0, 0, 0);

  let date_diff = date_tomorrow.getTime() - date_now.getTime();
  let hours = Math.floor((date_diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((date_diff % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((date_diff % (1000 * 60)) / 1000);

  const pixle_countdown_html = document.getElementById('pixle-countdown');
  const pixle_countdown_progress = pixle_countdown_html.querySelector('div.pixle-countdown-progress');

  pixle_countdown_progress.style.width = ((date_now.getHours() / 24) + (date_now.getMinutes() / 60 / 24) + (date_now.getSeconds() / 60 / 60 / 24)) * 100 + '%';

  pixle_countdown_html.querySelector('span.hours').innerHTML = (hours < 10) ? '0' + hours : hours.toString();
  pixle_countdown_html.querySelector('span.minutes').innerHTML = (minutes < 10) ? '0' + minutes : minutes.toString();
  pixle_countdown_html.querySelector('span.seconds').innerHTML = (seconds < 10) ? '0' + seconds : seconds.toString();
}
