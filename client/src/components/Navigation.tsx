function Header() {
    const navigateTo = (path: string) => {
        // Needs to be changed to `${path}` when build for production
      window.location.href = `http://localhost:5080${path}`;
    };
  
    return (
      <header>
        <nav>
          {/* <button onClick={() => navigateTo('/')}>Game Page</button> */}
          <button onClick={() => navigateTo('/about')}>About Page</button>
          <button onClick={() => navigateTo('/highscores')}>Highscores Page</button>
        </nav>
      </header>
    );
  }
  
  export default Header;
  