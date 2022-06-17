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
  }
}
